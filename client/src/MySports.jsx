import './my-sports.css'

function MySports({teams, setSettingTeam, setSport}){

    function handleClick(){
        setSettingTeam(true);
        setSport();
    }

 return(
    <div className='my-sports-wrapper'>
        <h1>Your Teams:</h1>
        <div className='my-sports'>
            <button onClick={handleClick}>+</button>
            {teams.map((team) => (
                <button key={team.team}>
                    <span className='main'>{team.team}</span>
                    <span className='sub'>{team.sport}</span>
                    </button>
            ))}
        </div>
    </div>
 )
}

export default MySports;