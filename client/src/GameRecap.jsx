import { useEffect, useState } from 'react';

export default function GameRecap({ fullText, youtubeId, delay = 50 }) {
  const [firstHalfText, setFirstHalfText] = useState('');
  const [secondHalfText, setSecondHalfText] = useState('');
  const [index, setIndex] = useState(0);
  const [currentWords, setCurrentWords] = useState([]);
  const [splitIndex, setSplitIndex] = useState(null);
  const [phase, setPhase] = useState('first'); // 'first' → 'video' → 'second'

  useEffect(() => {
    let words;
    if (fullText.includes('%gamehighlight%') && youtubeId) {
      const [before, after] = fullText.split('%gamehighlight%');
      const beforeWords = before.trim().split(' ');
      const afterWords = after.trim().split(' ');
      setCurrentWords([...beforeWords, '%VIDEO%', ...afterWords]);
      setSplitIndex(beforeWords.length); // video goes here
    } else {
      words = fullText.split(' ');
      setCurrentWords(words);
    }

    setFirstHalfText('');
    setSecondHalfText('');
    setIndex(0);
    setPhase('first');
  }, [fullText, youtubeId]);

  useEffect(() => {
    if (index >= currentWords.length) return;

    const interval = setInterval(() => {
      const nextWord = currentWords[index];

      if (nextWord === '%VIDEO%') {
        setPhase('video');
        setIndex(i => i + 1);
        return;
      }

      if (phase === 'first') {
        setFirstHalfText(prev => (prev ? `${prev} ${nextWord}` : nextWord));
        if (index + 1 === splitIndex) setPhase('video'); // prep for video
      } else if (phase === 'second') {
        setSecondHalfText(prev => (prev ? `${prev} ${nextWord}` : nextWord));
      }

      setIndex(i => i + 1);
    }, delay);

    return () => clearInterval(interval);
  }, [index, currentWords, phase, splitIndex]);

  return (
    <div className="space-y-4">
      <div dangerouslySetInnerHTML={{ __html: firstHalfText }} />

      {phase === 'video' && youtubeId && (
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

      {phase !== 'first' && (
        <div dangerouslySetInnerHTML={{ __html: secondHalfText }} />
      )}
    </div>
  );
}