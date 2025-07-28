import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import RegisterForm from './RegisterForm';
import SportSelect from './SportSelect';
import TeamSelect from './TeamSelect';
import MySports from './MySports';
import GameSummaryPage from './GameSummaryPage';
import TeamInfo from './TeamInfo';
import useGetLastGameRecap from './useGetLastGameRecap';
import { AppProvider, useAppContext } from './AppContext';


// Utility to safely load from localStorage



function AppWrapper() {
  return (
    <AppProvider>
      <Router>
        <App />
      </Router>
    </AppProvider>
  );
}



function App() {

  const {teams, lastGameRecaps, setLastGameRecaps } = useAppContext();

  const navigate = useNavigate();


  useEffect(() => {
    const saved = localStorage.getItem('userInfo');
    if (saved && saved !== 'null' && saved !== 'undefined' && JSON.parse(saved).name) {
      navigate('/myteams');
    }
  }, []);


  useGetLastGameRecap(teams, lastGameRecaps, setLastGameRecaps);

  return (
    <div className="w-[1280px] relative">

      <Routes>

        <Route path="/" element={
          <RegisterForm title='Register' />
        } />


        <Route path="/myteams" element={
          <MySports/>
        } />


        <Route path="/myteams/sports" element={
          <SportSelect/>
        } />


        <Route path="/myteams/teams" element={
          <TeamSelect/>
        } />

        <Route path="/myteams/team/:teamId" element={
          <TeamInfo/>
        } />


        <Route path="/myteams/team/:teamId/summary" element={
          <GameSummaryPage/>
        } />

        <Route path="*" element={<Navigate to="/myteams" />} />

      </Routes>
    </div>
  );
}

export default AppWrapper;
