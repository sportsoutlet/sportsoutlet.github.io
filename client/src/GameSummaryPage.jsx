import { useEffect, useState } from 'react';
import GameRecap from './GameRecap'; // adjust path if needed
import './game-summary-page.css';
import BackButton from './BackButton';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppContext } from './AppContext';





export default function GameSummaryPage() {

    const { activeTeam, setDisplaySummary, userInfo, lastGameRecaps } = useAppContext();

    if (!activeTeam || !lastGameRecaps) return <Navigate to="/myteams" />;


    const name = userInfo.name || 'User';
    const recap = lastGameRecaps.find(recap => recap.teamName === activeTeam.teamBack) || 'failed to load recap';


    const navigate = useNavigate();

    const [summary, setSummary] = useState('');
    const [youtubeId, setYoutubeId] = useState();
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [summaryStatus, setSummaryStatus] = useState(false);

    useEffect(() => {

        setTitle(recap.summaryTitle || 'Game Recap');
        setSummary(recap.summary || 'No summary available.');
        setSummaryStatus(true);

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
                <BackButton className='absolute top-1 left-4 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition-colors max-w-fit' whenClicked={() => { setDisplaySummary(false); navigate(`/myteams/team/${activeTeam.teamBack.toLowerCase().replace(/\s+/g, '-')}`) }} />
                <h1>{title ? title : activeTeam.team + ' Recap'}</h1>
                {loading ? <div className='flex items-center'>
                    <p className="text-md text-white opacity-75">Loading recap...</p>
                </div> :
                    <GameRecap text={summary} youtubeId={youtubeId} name={name} summaryStatus={summaryStatus} />
                }
            </div>
        </div>);
}