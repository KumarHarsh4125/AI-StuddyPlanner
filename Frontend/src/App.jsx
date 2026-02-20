import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import studyApi from './api/studyApi';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlanGenerator from './pages/PlanGenerator';
import PlanDetail from './pages/PlanDetail';
import './index.css';

function App() {
  const [userId, setUserId] = useState(null);

  // Initialize user session on mount
  useEffect(() => {
    const initUser = async () => {
      try {
        const storedId = localStorage.getItem('study_planner_user_id');
        if (storedId) {
          setUserId(parseInt(storedId));
        } else {
          const response = await studyApi.createUser();
          setUserId(response.data.user_id);
          localStorage.setItem('study_planner_user_id', response.data.user_id);
        }
      } catch (err) {
        console.error("Failed to initialize session", err);
      }
    };
    initUser();
  }, []);

  const handleSwitchUser = () => {
    const newId = prompt("Enter a User ID to load their dashboard:");
    if (newId && !isNaN(newId)) {
      localStorage.setItem('study_planner_user_id', newId);
      setUserId(parseInt(newId));
      window.location.reload(); // Refresh to clear states
    }
  };

  if (!userId) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar userId={userId} onSwitchUser={handleSwitchUser} />
        <Routes>
          <Route path="/" element={<Home userId={userId} />} />
          <Route path="/generate" element={<PlanGenerator userId={userId} />} />
          <Route path="/plan/:goalId" element={<PlanDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
