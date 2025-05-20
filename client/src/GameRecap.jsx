import { useEffect, useRef, useState } from 'react';
import './game-summary-page.css';

export default function GameRecap({ text, youtubeId, name, delay = 50 }) {
  const [htmlBefore, setHtmlBefore] = useState('');
  const [htmlAfter, setHtmlAfter] = useState('');
  const [index, setIndex] = useState(0);
  const [allTokens, setAllTokens] = useState([]);
  const [videoReached, setVideoReached] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoErrorCode, setVideoErrorCode] = useState(null);

  const playerRef = useRef(null);
  const iframeContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const tokenizeHTMLString = (html) => {
    return html
      .replace('%user%', name)
      .replace('%gamehighlight%', '%VIDEO%')
      .split(/(%VIDEO%|<[^>]+>|\s+)/)
      .filter(token => token !== null && token !== undefined);
  };

  useEffect(() => {
    const tokens = tokenizeHTMLString(text);
    setAllTokens(tokens);
    setHtmlBefore('');
    setHtmlAfter('');
    setIndex(0);
    setVideoReached(false);
    setVideoFailed(false);
    setVideoErrorCode(null);
  }, [text, youtubeId, name]);

  useEffect(() => {
    if (index >= allTokens.length) return;

    const timeout = setTimeout(() => {
      const token = allTokens[index];

      if (token === '%VIDEO%') {
        setVideoReached(true);
        setIndex((prev) => prev + 1);
        return;
      }

      if (!videoReached) {
        setHtmlBefore((prev) => prev + token);
      } else {
        setHtmlAfter((prev) => prev + token);
      }

      setIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timeout);
  }, [index, allTokens, delay, videoReached]);

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

          window.onYouTubeIframeAPIReady = () => {
            resolve();
          };
        }
      });
    };

    loadYouTubeAPI().then(() => {
      if (!iframeContainerRef.current) return;

      playerRef.current = new window.YT.Player(iframeContainerRef.current, {
        videoId: youtubeId,
        width: '100%',
        playerVars: {
          rel: 0,
        },
        events: {
          onReady: () => {},
          onError: (event) => {
            setVideoErrorCode(event.data);
            setVideoFailed(true);
          },
        },
      });
    });

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [youtubeId]);

  // Detect manual scroll interruption
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const handleScroll = () => {
      const atBottom = root.scrollHeight - root.scrollTop - root.clientHeight < 50;
      setAutoScroll(atBottom);
    };

    root.addEventListener('scroll', handleScroll);
    return () => root.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll with text
  useEffect(() => {
    if (autoScroll && scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [htmlBefore, htmlAfter]);

  return (
    <div className="max-w-full space-y-4 text-left response-wrapper">
      {htmlBefore && (
        <p
          className="max-w-full"
          dangerouslySetInnerHTML={{ __html: htmlBefore }}
        />
      )}

      <div
        className="my-4 text-center"
        style={{ display: videoReached ? 'block' : 'none' }}
      >
        {!videoFailed ? (
          <div className="relative w-full pb-[56.25%] mx-auto my-7">
            <div className="video-container" ref={iframeContainerRef} />
          </div>
        ) : 
          <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 my-3 bg-red-600 !text-neutral-100 text-base font-medium rounded-full shadow hover:bg-red-700 hover:shadow-md transition duration-200"
          >
            ▶ Watch on YouTube
          </a>
        }
      </div>

      {htmlAfter && (
        <p
          className="max-w-full"
          dangerouslySetInnerHTML={{ __html: htmlAfter }}
        />
      )}

      <div ref={scrollAnchorRef} />
    </div>
  );
}
