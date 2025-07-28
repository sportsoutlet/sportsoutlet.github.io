import htmlTruncate from 'html-truncate';
import BackButton from "./BackButton";
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppContext } from './AppContext';






function TeamInfo() { 

    const { setDisplaySummary, setActiveTeam, activeTeam, userInfo, lastGameRecaps } = useAppContext();
      if (!activeTeam || !lastGameRecaps) return <Navigate to="/myteams" />;

    const name = userInfo.name || 'User';
    const recap = lastGameRecaps.find(recap => recap.teamName === activeTeam.teamBack) || 'failed to load recap';

    const navigate = useNavigate();

    return (
        <div className="mt-15 mx-10">
            <BackButton className='absolute top-1 left-4 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition-colors max-w-fit' whenClicked={() => {setActiveTeam(); navigate('/myteams')}}/>
            <h1>{activeTeam.team + ' Latest News'}</h1>
        <button onClick={() => {setDisplaySummary(true); navigate(`/myteams/team/${activeTeam.teamBack.toLowerCase().replace(/\s+/g, '-')}/summary`);}}><div className="team-info p-4"><h2 className="text-left text-2xl mb-4">{recap.summaryTitle}</h2><p className="text-left" dangerouslySetInnerHTML={{ __html: htmlTruncate(recap.summary.replace('%user%', name), 250) }}></p></div></button>
        <button onClick={() => {setDisplaySummary(true); navigate(`/myteams/team/${activeTeam.teamBack.toLowerCase().replace(/\s+/g, '-')}/summary`);}}><div className="team-info p-4"><h2 className="text-left text-2xl mb-4">Star Player:</h2><p className="text-left">This is spacer content meant to emulate a recap. This is spacer content meant to emulate a recap. This is spacer content meant to emulate a recap. This is spacer content meant to emulate a re... </p></div></button>
        <button onClick={() => {setDisplaySummary(true); navigate(`/myteams/team/${activeTeam.teamBack.toLowerCase().replace(/\s+/g, '-')}/summary`);}}><div className="team-info p-4"><h2 className="text-left text-2xl mb-4">Top 5 helmets to try in 2025:</h2><p className="text-left">This is spacer content meant to emulate a recap. This is spacer content meant to emulate a recap. This is spacer content meant to emulate a recap. This is spacer content meant to emulate a re... </p></div></button>
        </div>
    )
}

export default TeamInfo;