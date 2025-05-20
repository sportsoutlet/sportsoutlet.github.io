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
    <div className='w-[1280px]'>
      {userInfo.name ?
        sport ? settingTeam ? <TeamSelect sport={sport} setSettingTeam={setSettingTeam} setTeams={setTeams} teams={teams} setSport={setSport} /> :
          activeTeam ? <GameSummaryPage activeTeam={activeTeam} name={userInfo.name} setActiveTeam={setActiveTeam} /> :
            <MySports teams={teams} setSettingTeam={setSettingTeam} setSport={setSport} setActiveTeam={setActiveTeam} setTeams={setTeams} /> :
          <SportSelect setSport={setSport} /> :
        <RegisterForm setInfo={setUserInfo} />

      }
    </div>
  )
}

export default App
