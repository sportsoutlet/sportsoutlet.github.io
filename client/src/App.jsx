import { useState } from 'react'
import './App.css'
import RegisterForm from './RegisterForm'
import SportSelect from './SportSelect'
import TeamSelect from './TeamSelect'
import MySports from './MySports'
import GameSummaryPage from './GameSummaryPage'


function App() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    age: "",
    gender: "",
    country: "",
  });

  const [sport, setSport] = useState();
  const [teams, setTeams] = useState([]);
  const [settingTeam, setSettingTeam] = useState(true);
  const [activeTeam, setActiveTeam] = useState();

  return (
    <div className='w-full'>
      {userInfo.name ?
        sport ? settingTeam ? <TeamSelect sport={sport} setSettingTeam={setSettingTeam} setTeams={setTeams} teams={teams} /> :
          activeTeam ? <GameSummaryPage activeTeam={activeTeam} /> :
            <MySports teams={teams} setSettingTeam={setSettingTeam} setSport={setSport} setActiveTeam={setActiveTeam} /> :
          <SportSelect setSport={setSport} /> :
        <RegisterForm setInfo={setUserInfo} />

      }
    </div>
  )
}

export default App
