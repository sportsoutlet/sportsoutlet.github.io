import './my-sports.css'
import { Plus } from 'lucide-react';


function MySports({teams, setSettingTeam, setSport, setActiveTeam}){

    function handleClick(){
        setSettingTeam(true);
        setSport();
    }

 return(
    <div className='my-sports-wrapper'>
        <h1 className='pt-5'>Your Teams:</h1>
        <div className='my-sports py-3'>
            <button className='flex items-center justify-center' onClick={handleClick}><Plus/></button>
            {teams.map((team) => (
                <button key={team.team} onClick={() => setActiveTeam(team.team)}>
                    <span className='main text-lg font-bold'>{team.team}</span>
                    <span className='sub text-sm mt-1 font-thick'>{team.sport}</span>
                    </button>
            ))}
        </div>
    </div>
 )
}

export default MySports;