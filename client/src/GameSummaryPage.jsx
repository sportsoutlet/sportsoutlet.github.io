import { useEffect, useState } from 'react';
import GameRecap from './GameRecap'; // adjust path if needed
import './game-summary-page.css';
import BackButton from './BackButton';



function extractTaggedSections(str) {
  const regex = /%=(.*?)=%/g;
  const matches = [];
  let cleaned = str;

  let match;
  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1]); // only the inside content
  }

  // Optionally, remove the tags from the original string
  cleaned = cleaned.replace(regex, '').trim();

  return { matches, cleaned };
}


export default function GameSummaryPage({ activeTeam, name, setActiveTeam }) {
    const [summary, setSummary] = useState('');
    const [youtubeId, setYoutubeId] = useState();
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const fetchGameSummary = async () => {
            try {
                const res = await fetch(`https://sports-api-o71j.onrender.com/game-summary?team=${encodeURIComponent(activeTeam.replace(/\s+/g, '_'))}`);
                const data = await res.json();

                if (data?.summary) {
                    const result = extractTaggedSections(data.summary);
                    setTitle(result.matches[0] || 'Game Recap');
                    setSummary(result.cleaned || 'No summary available.');
                    console.log(data.summary);

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

    return (
        <div className='summary-wrapper mt-12'>
            <div className='summary'>
                <BackButton className='absolute top-1 left-4 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition-colors max-w-fit' whenClicked={() => setActiveTeam()}/>
                <h1>{title ? title: activeTeam + ' Recap'}</h1>
                {loading ? <div className='flex items-center'><svg
                    className="animate-spin h-6 w-6 mr-3 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
                    <p className="text-md text-white opacity-75">Loading recap...</p>
                </div> :
                    <GameRecap text={summary} youtubeId={youtubeId} name={name} />
                }
            </div>
        </div>);
}