import { useState } from 'react'
import './App.css'
import RegisterForm from './RegisterForm'
import SportSelect from './SportSelect'
import TeamSelect from './TeamSelect'
import MySports from './MySports'


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

  return (
    <div className='w-full'>
      {userInfo.name ?
        sport ? settingTeam ? <TeamSelect sport={sport} setSettingTeam={setSettingTeam} setTeams={setTeams} teams={teams} /> :
          <MySports teams={teams} setSettingTeam={setSettingTeam} setSport={setSport}/> :
          <SportSelect setSport={setSport} /> :
        <RegisterForm setInfo={setUserInfo} />

      }
    </div>
  )
}

export default App
