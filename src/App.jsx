import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Assistants from './pages/Assistants';
import Sessions from './pages/Sessions';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import './styles/globals.css';

const Sidebar = ({ onLogout, currentUser }) => {
  const location = useLocation();

  const getActiveClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>Manager Panel</h2>
        <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '10px' }}>
          {currentUser?.fullname}
        </p>
      </div>
      <ul className="nav-menu">
        <li><a href="/dashboard" className={getActiveClass('/dashboard')}>Dashboard</a></li>
        <li><a href="/students" className={getActiveClass('/students')}>Students</a></li>
        <li><a href="/assistants" className={getActiveClass('/assistants')}>Assistants</a></li>
        <li><a href="/sessions" className={getActiveClass('/sessions')}>Sessions</a></li>
        <li><a href="/reports" className={getActiveClass('/reports')}>Reports</a></li>
        <li><a href="/profile" className={getActiveClass('/profile')}>Profile</a></li>
        <li><button onClick={onLogout} className="logout-btn">Logout</button></li>
      </ul>
    </nav>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('manager_token');
    const userData = localStorage.getItem('manager_user');
    
    if (token && userData) {
      setCurrentUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('manager_token', token);
    localStorage.setItem('manager_user', JSON.stringify(userData));
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('manager_token');
      localStorage.removeItem('manager_user');
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <Router>
      <div className="admin-layout">
        <Sidebar onLogout={logout} currentUser={currentUser} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/assistants" element={<Assistants />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;