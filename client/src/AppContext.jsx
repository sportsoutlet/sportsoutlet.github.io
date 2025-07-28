// context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {

  const [userInfo, setUserInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('userInfo')) || { name: '', age: '', gender: '', country: '' };
    } catch {
      return { name: '', age: '', gender: '', country: '' };
    }
  });

  const [sport, setSport] = useState(() => localStorage.getItem('sport') || '');

  const [teams, setTeams] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('teams')) || [];
    } catch {
      return [];
    }
  });

  const [settingTeam, setSettingTeam] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('settingTeam')) ?? true;
    } catch {
      return true;
    }
  });

  const [activeTeam, setActiveTeam] = useState(null);

  const [displaySummary, setDisplaySummary] = useState(false);

  const [lastGameRecaps, setLastGameRecaps] = useState([]);

  
  // Persist to localStorage when needed
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
    localStorage.setItem('settingTeam', JSON.stringify(settingTeam));
  }, [settingTeam]);

  const value = {
    userInfo,
    setUserInfo,
    sport,
    setSport,
    teams,
    setTeams,
    settingTeam,
    setSettingTeam,
    activeTeam,
    setActiveTeam,
    displaySummary,
    setDisplaySummary,
    lastGameRecaps,
    setLastGameRecaps,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}