import { useEffect, useState } from 'react';
import './game-summary-page.css';

export default function GameRecap({ text, youtubeId, name, delay = 50 }) {
  const [htmlBefore, setHtmlBefore] = useState('');
  const [htmlAfter, setHtmlAfter] = useState('');
  const [index, setIndex] = useState(0);
  const [allTokens, setAllTokens] = useState([]);
  const [videoReached, setVideoReached] = useState(false);

  // HTML-aware tokenizer
  const tokenizeHTMLString = (html) => {
  return html
    .replace('%user%', name)
    .replace('%gamehighlight%', '%VIDEO%')
    .split(/(%VIDEO%|<[^>]+>|\s+)/) // keep spaces
    .filter(token => token !== null && token !== undefined);
};

  useEffect(() => {
    const tokens = tokenizeHTMLString(text);
    setAllTokens(tokens);
    setHtmlBefore('');
    setHtmlAfter('');
    setIndex(0);
    setVideoReached(false);
  }, [text, youtubeId, name]);

  useEffect(() => {
    if (index >= allTokens.length) return;

    const timeout = setTimeout(() => {
      const token = allTokens[index];

      if (token === '%VIDEO%') {
        setVideoReached(true);
        setIndex(prev => prev + 1); // skip rendering this token
        return;
      }

      if (!videoReached) {
        setHtmlBefore(prev => prev + token);
      } else {
        setHtmlAfter(prev => prev + token);
      }

      setIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timeout);
  }, [index, allTokens, delay, videoReached]);

  return (
    <div className="max-w-full space-y-4 text-left response-wrapper">
      {htmlBefore && (
        <p
          className="max-w-full"
          dangerouslySetInnerHTML={{ __html: htmlBefore }}
        />
      )}

      {videoReached && youtubeId && (
        <div className="my-4">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            className="max-w-full my-7 mx-auto"
            title="Game Highlight"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
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
