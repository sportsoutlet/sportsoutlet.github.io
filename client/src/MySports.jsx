import './my-sports.css'
import { Plus, X } from 'lucide-react';


function MySports({ teams, setSettingTeam, setSport, setActiveTeam, setTeams }) {

    function handleClick() {
        setSettingTeam(true);
        setSport();
    }

    function handleRemove(index) {
        setTeams(prev => prev.filter((_, i) => i !== index));
    }

    return (
        <div className='my-sports-wrapper'>
            <h1 className='pt-5'>Your Teams:</h1>
            <div className='my-sports py-3'>
                <button className='flex items-center justify-center' onClick={handleClick}><Plus /></button>
                {teams.map((team, index) => (
                    <button key={team.team} onClick={() => setActiveTeam(team.team)}>
                        <span className='main text-lg font-bold pb-2'>{team.team}</span>
                        <span className='sub text-sm absolute bottom-3 left-1/2 -translate-x-1/2 font-thick'>{team.sport}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(index);
                            }}
                            aria-label="Remove team"
                        >
                            <X size={18} />
                        </button>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default MySports;