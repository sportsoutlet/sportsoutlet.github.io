import { useEffect, useState } from 'react';

export default function GameRecap({ fullText, youtubeId, delay = 50 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentWords, setCurrentWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [shouldShowVideo, setShouldShowVideo] = useState(false);
  const [videoInserted, setVideoInserted] = useState(false);

  // Check if %gamehighlight% exists in the text
  const hasPlaceholder = fullText.includes('%gamehighlight%');

  // Preprocess text
  useEffect(() => {
    let parts;
    if (hasPlaceholder && youtubeId) {
      parts = fullText.split('%gamehighlight%');
      const words = [
        ...parts[0].split(' '),
        '%VIDEO%',
        ...parts[1].split(' ')
      ];
      setCurrentWords(words);
    } else {
      setCurrentWords(fullText.split(' ')); // no highlight, just display
    }

    setDisplayedText('');
    setIndex(0);
    setShouldShowVideo(false);
    setVideoInserted(false);
  }, [fullText, youtubeId]);

  useEffect(() => {
    if (index >= currentWords.length) return;

    const interval = setInterval(() => {
      const nextWord = currentWords[index];

      if (nextWord === '%VIDEO%') {
        setShouldShowVideo(true);
        setVideoInserted(true);
        setIndex(i => i + 1); // skip the video tag
        return;
      }

      setDisplayedText(prev => (prev ? prev + ' ' + nextWord : nextWord));
      setIndex(i => i + 1);
    }, delay);

    return () => clearInterval(interval);
  }, [index, currentWords]);

  return (
    <div className="space-y-4">
      <p>{displayedText}</p>

      {shouldShowVideo && youtubeId && (
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="Game Highlight"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}