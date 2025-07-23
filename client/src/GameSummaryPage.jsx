import { useEffect, useState } from 'react';
import GameRecap from './GameRecap'; // adjust path if needed
import './game-summary-page.css';
import BackButton from './BackButton';




export default function GameSummaryPage({ activeTeam, name, setDisplaySummary, recap }) {
    const [summary, setSummary] = useState('');
    const [youtubeId, setYoutubeId] = useState();
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [summaryStatus, setSummaryStatus] = useState(false);

    useEffect(() => {

        setTitle(recap.summaryTitle || 'Game Recap');
        setSummary(recap.summary || 'No summary available.');
        setSummaryStatus(true);
        console.log(recap.summary);

        // 🔍 Extract YouTube ID if link is known (optional)
        // e.g., if your server adds `videoUrl: "https://www.youtube.com/watch?v=XYZ"`
        if (recap.videoUrl) {
            const match = recap.videoUrl.match(/v=([a-zA-Z0-9_-]{11})/);
            if (match) setYoutubeId(match[1]);
        }

        setLoading(false);

    }, []);

    return (
        <div className='summary-wrapper mt-12'>
            <div className='summary'>
                <BackButton className='absolute top-1 left-4 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition-colors max-w-fit' whenClicked={() => setDisplaySummary(false)} />
                <h1>{title ? title : activeTeam.team + ' Recap'}</h1>
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
                    <GameRecap text={summary} youtubeId={youtubeId} name={name} summaryStatus={summaryStatus} />
                }
            </div>
        </div>);
}