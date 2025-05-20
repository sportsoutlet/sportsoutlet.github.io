import { useEffect, useState } from 'react';
import './App.css';
import RegisterForm from './RegisterForm';
import SportSelect from './SportSelect';
import TeamSelect from './TeamSelect';
import MySports from './MySports';
import GameSummaryPage from './GameSummaryPage';

// Utility to safely load from localStorage
const safeLoad = (key, fallback) => {
  const raw = localStorage.getItem(key);
  if (!raw || raw === 'null' || raw === 'undefined') return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return raw; // for string-only values like 'sport'
  }
};

function App() {
  const [userInfo, setUserInfo] = useState(() =>
    safeLoad('userInfo', { name: '', age: '', gender: '', country: '' })
  );

  const [sport, setSport] = useState(() =>
    safeLoad('sport', '')
  );

  const [teams, setTeams] = useState(() =>
    safeLoad('teams', [])
  );

  const [settingTeam, setSettingTeam] = useState(() =>
    safeLoad('settingTeam', true)
  );

  const [activeTeam, setActiveTeam] = useState(() =>
    safeLoad('activeTeam', '')
  );

  // Save to localStorage safely
  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    if (sport) localStorage.setItem('sport', sport);
    else localStorage.removeItem('sport');
  }, [sport]);

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('settingTeam', JSON.stringify(settingTeam));
  }, [settingTeam]);

  useEffect(() => {
    if (activeTeam) localStorage.setItem('activeTeam', activeTeam);
    else localStorage.removeItem('activeTeam');
  }, [activeTeam]);


  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'BUTTON') {
        e.target.blur();
      }
    };
    document.addEventListener('touchend', handler);

    return () => {
      document.removeEventListener('touchend', handler);
    };
  }, []);

  return (
    <div className="w-[1280px] relative">
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
              userInfo={userInfo}
              setUserInfo={setUserInfo}
            />
          )
        ) : (
          <SportSelect setSport={setSport} />
        )
      ) : (
        <RegisterForm setInfo={setUserInfo} info={userInfo} title='Register' />
      )}
    </div>
  );
}

export default App;
