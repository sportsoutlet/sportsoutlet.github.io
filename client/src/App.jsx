import { useEffect, useState } from 'react';
import './App.css';
import RegisterForm from './RegisterForm';
import SportSelect from './SportSelect';
import TeamSelect from './TeamSelect';
import MySports from './MySports';
import GameSummaryPage from './GameSummaryPage';

function App() {
  // Load initial state from localStorage or default
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : { name: '', age: '', gender: '', country: '' };
  });

  const [sport, setSport] = useState(() => {
    return localStorage.getItem('sport') || '';
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('teams');
    return saved ? JSON.parse(saved) : [];
  });

  const [settingTeam, setSettingTeam] = useState(() => {
    const saved = localStorage.getItem('settingTeam');
    return saved === 'false' ? false : true;
  });

  const [activeTeam, setActiveTeam] = useState(() => {
    return localStorage.getItem('activeTeam') || '';
  });

  // Sync each piece of state to localStorage on change
  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    localStorage.setItem('sport', sport);
  }, [sport]);

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('settingTeam', settingTeam);
  }, [settingTeam]);

  useEffect(() => {
    localStorage.setItem('activeTeam', activeTeam);
  }, [activeTeam]);

  return (
    <div className="w-[1280px]">
      {userInfo.name ? (
        sport ? (
          settingTeam ? (
            <TeamSelect
              sport={sport}
              setSettingTeam={setSettingTeam}
              setTeams={setTeams}
              teams={teams}
              setSport={setSport}
            />
          ) : activeTeam ? (
            <GameSummaryPage
              activeTeam={activeTeam}
              name={userInfo.name}
              setActiveTeam={setActiveTeam}
            />
          ) : (
            <MySports
              teams={teams}
              setSettingTeam={setSettingTeam}
              setSport={setSport}
              setActiveTeam={setActiveTeam}
              setTeams={setTeams}
            />
          )
        ) : (
          <SportSelect setSport={setSport} />
        )
      ) : (
        <RegisterForm setInfo={setUserInfo} />
      )}
    </div>
  );
}

export default App;
