import { useEffect, useState } from 'react';
import GameRecap from './GameRecap'; // adjust path if needed

export default function GameSummaryPage({activeTeam}) {
  const [summary, setSummary] = useState('');
  const [youtubeId, setYoutubeId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameSummary = async () => {
      try {
        const res = await fetch(`https://sports-api-o71j.onrender.com/game-summary?team=${activeTeam}`);
        const data = await res.json();

        if (data?.summary) {
          setSummary(data.summary);

          // 🔍 Extract YouTube ID if link is known (optional)
          // e.g., if your server adds `videoUrl: "https://www.youtube.com/watch?v=XYZ"`
          if (data.videoUrl) {
            const match = data.videoUrl.match(/v=([a-zA-Z0-9_-]{11})/);
            if (match) setYoutubeId(match[1]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch summary:', err);
        setSummary('Failed to load game summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchGameSummary();
  }, []);

  if (loading) return <p>Loading game recap...</p>;

  return <GameRecap fullText={summary} youtubeId={youtubeId} />;
}