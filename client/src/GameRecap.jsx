import { useEffect, useRef, useState } from 'react';
import './game-summary-page.css';



export default function GameRecap({ text, youtubeId, name }) {
  const playerRef = useRef(null);
  const iframeContainerRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoErrorCode, setVideoErrorCode] = useState(null);
  const [parts, setParts] = useState({ before: '', after: '' });

  useEffect(() => {
    const highlightWithPeriod = '%gamehighlight%.';
    const highlight = '%gamehighlight%';

    let processed;

    if (text.includes(highlightWithPeriod)) {
      processed = text.replace('%user%', name).split(highlightWithPeriod);
    } else {
      processed = text.replace('%user%', name).split(highlight);
    }

    setParts({ before: processed[0], after: processed[1] || '' });
  }, [text, name]);
  

  useEffect(() => {
    if (!youtubeId || !iframeContainerRef.current) return;

    const loadYouTubeAPI = () => {
      return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
        } else {
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScript = document.getElementsByTagName('script')[0];
          firstScript.parentNode.insertBefore(tag, firstScript);
          window.onYouTubeIframeAPIReady = () => resolve();
        }
      });
    };

    loadYouTubeAPI().then(() => {
      if (!iframeContainerRef.current) return;

      playerRef.current = new window.YT.Player(iframeContainerRef.current, {
        videoId: youtubeId,
        width: '100%',
        playerVars: { rel: 0 },
        events: {
          onReady: () => { },
          onError: (event) => {
            setVideoErrorCode(event.data);
            setVideoFailed(true);
          },
        },
      });
    });

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [youtubeId]);

  return (
    <div className="max-w-full space-y-4 text-left response-wrapper">
      {parts.before && (
        <p
          className="max-w-full"
          dangerouslySetInnerHTML={{ __html: parts.before }}
        />
      )}

      <div className="my-4 text-center">
        {!videoFailed ? (
          <div className="relative w-full pb-[56.25%] mx-auto my-7 video-container-outer">
            <div className="video-container" ref={iframeContainerRef} />
          </div>
        ) : videoErrorCode === 101 || videoErrorCode === 150 ? (
          <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 my-3 bg-red-600 !text-neutral-100 text-base font-medium rounded-full shadow hover:bg-red-700 hover:shadow-md transition duration-200"
          >
            ▶ Watch on YouTube
          </a>
        ) : (
          <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 my-3 bg-neutral-600 !text-neutral-100 text-base font-medium rounded-full shadow hover:bg-neutral-700 hover:shadow-md transition duration-200"
          >
            ▶ Unavailable in your country
          </a>
        )}
      </div>
      <div className='banner-ad'>Advertisement Placeholder</div>

      {parts.after && (
        <p
          className="max-w-full"
          dangerouslySetInnerHTML={{ __html: parts.after }}
        />
      )}
      <div className='affiliates'>
        <a>Potential Merchandise Affiliate Link</a>
        <a>Potential Event Ticket Affiliate Link</a>
        <a>Potential Estate Betting House Link</a>
      </div>
    </div>
  );
}
