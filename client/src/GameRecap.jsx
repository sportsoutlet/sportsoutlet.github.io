import { useEffect, useState } from 'react';
import './game-summary-page.css';

export default function GameRecap({ text, youtubeId, name, delay = 50 }) {
  const [htmlBefore, setHtmlBefore] = useState('');
  const [htmlAfter, setHtmlAfter] = useState('');
  const [index, setIndex] = useState(0);
  const [allWords, setAllWords] = useState([]);
  const [videoReached, setVideoReached] = useState(false);

  useEffect(() => {
    let words = [];

    if (text.includes('%gamehighlight%') && youtubeId) {
      const [before, after] = text.split('%gamehighlight%');
      words = [
        ...before.replace('%user%', name).trim().split(/\s+/),
        '%VIDEO%',
        ...after.trim().split(/\s+/),
      ];
    } else {
      words = text.trim().split(/\s+/);
    }

    setAllWords(words);
    setHtmlBefore('');
    setHtmlAfter('');
    setIndex(0);
    setVideoReached(false);
  }, [text, youtubeId]);

  useEffect(() => {
    if (index >= allWords.length) return;

    const timeout = setTimeout(() => {
      const word = allWords[index];
      if (word === '%VIDEO%') {
        setVideoReached(true);
      } else {
        const cleaned = word + ' ';
        if (!videoReached) {
          setHtmlBefore((prev) => prev + cleaned);
        } else {
          setHtmlAfter((prev) => prev + cleaned);
        }
      }
      setIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timeout);
  }, [index, allWords, delay, videoReached]);

  return (
    <div className="max-w-full space-y-4 text-left response-wrapper">
      <p
        className="max-w-full"
        dangerouslySetInnerHTML={{ __html: htmlBefore }}
      />
      {videoReached && youtubeId && (
        <div className="my-4">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            className='max-w-full'
            title="Game Highlight"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {htmlAfter && (
        <p
          className="max-w-full"
          dangerouslySetInnerHTML={{ __html: htmlAfter }}
        />
      )}
    </div>
  );
}