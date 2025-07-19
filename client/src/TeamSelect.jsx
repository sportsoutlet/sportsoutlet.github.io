import { sports } from './sports.js'
import './team-select.css'
import BackButton from './BackButton.jsx'

function TeamSelect({ sport, setTeams, setSettingTeam, teams, setSport }) {

    function handleClick(team) {
        setTeams((prev) => [
            ...prev,
            {
                sport: sports.find((s) => s.back === sport)?.front,
                team: team.front,  // ✅ use back internally
                teamBack: team.back, // ✅ store back for consistency
            }
        ]);
        setSettingTeam(false);
    }

    return (
        <div className='team-select-wrapper'>
            <h1>Select your Team</h1>
            <div className='team-select'>
                {sports.find((s) => s.back === sport)?.teams
                    .filter((teamObj) => !teams.some(t => t.teamBack === teamObj.back)) // ✅ compare with back
                    .map((teamObj) => (
                        <button key={teamObj.back} onClick={(e) => {
                            e.currentTarget.blur();
                            handleClick(teamObj); // ✅ pass team object
                        }}>
                            {teamObj.front}  {/* ✅ display front */}
                        </button>
                    ))}
            </div>
            <BackButton
                className='absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition-colors max-w-fit'
                whenClicked={() => setSport()}
            />
        </div>
    );
}

export default TeamSelect;