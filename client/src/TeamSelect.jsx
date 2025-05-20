import { sports } from './sports.js'
import './team-select.css'

function TeamSelect({ sport, setTeams, setSettingTeam, teams }) {

    function handleClick(team) {
        setTeams((prev) => [...prev, { sport: sports.find((s) => s.back === sport)?.front, team: team }]);
        setSettingTeam(false);
    }

    return (
        <div className='team-select-wrapper'>
            <h1>Select your Team</h1>
            <div className='team-select'>
                {sports.find((s) => s.back === sport)?.teams
                    .filter((teamName) => !teams.some(t => t.team === teamName)) // ✅
                    .map((teamName) => (
                        <button key={teamName} onClick={() => handleClick(teamName)}>
                            {teamName}
                        </button>
                    ))}
            </div>
        </div>
    )
}

export default TeamSelect;