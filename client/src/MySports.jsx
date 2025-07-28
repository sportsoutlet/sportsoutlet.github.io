import './my-sports.css'
import { Plus, X } from 'lucide-react';
import EditProfile from './EditProfile';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './AppContext';




function MySports() {

    const { teams, setSettingTeam, setSport, setActiveTeam, setTeams, userInfo, setUserInfo } = useAppContext();

    const navigate = useNavigate();

    function handleClick() {
        setSettingTeam(true);
        setSport();
        navigate(`/myteams/sports`);


    }

    function handleRemove(index) {
        setTeams(prev => prev.filter((_, i) => i !== index));
    }

    return (
        <div className='my-sports-wrapper'>
            <h1 className='pt-10'>Your Teams:</h1>
            <EditProfile userInfo={userInfo} setUserInfo={setUserInfo} />
            <div className='my-sports py-3'>
                <button className='flex items-center justify-center' onClick={(e) => {e.currentTarget.blur(); handleClick()}}><Plus /></button>
                {teams.map((team, index) => (
                    <button key={team.teamBack} onClick={(e) => {e.currentTarget.blur(); setActiveTeam(team); navigate(`/myteams/team/${team.teamBack}`);}}>
                        <span className='main text-lg font-bold pb-2'>{team.team}</span>
                        <span className='sub text-sm font-thick absolute left-3 top-3'>{team.sport}</span>
                        <span className='text-sm font-thin absolute bottom-2 opacity-80'>Click here for more information</span>
                        <span
                        className='remove-item'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(index);
                            }}
                            aria-label="Remove team"
                        >
                            <X size={18} />
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default MySports;