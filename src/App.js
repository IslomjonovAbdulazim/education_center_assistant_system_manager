import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Assistants from './pages/Assistants';
import Students from './pages/Students';
import Sessions from './pages/Sessions';
import Reports from './pages/Reports';
import './styles/globals.css';

const Sidebar = ({ onLogout, currentUser }) => {
  const location = useLocation();

  const getActiveClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">📚</div>
          <h2>Manager Panel</h2>
        </div>
        <div className="manager-info">
          <div className="manager-avatar">
            {currentUser?.photo_url ? (
              <img src={currentUser.photo_url} alt="Manager" />
            ) : (
              <div className="avatar-placeholder">
                {currentUser?.fullname?.charAt(0) || 'M'}
              </div>
            )}
          </div>
          <div className="manager-details">
            <div className="manager-name">{currentUser?.fullname}</div>
            <div className="manager-role">Learning Center Manager</div>
          </div>
        </div>
      </div>
      
      <ul className="nav-menu">
        <li><a href="/dashboard" className={getActiveClass('/dashboard')}>
          <span className="nav-icon">📊</span> Dashboard
        </a></li>
        <li><a href="/subjects" className={getActiveClass('/subjects')}>
          <span className="nav-icon">📖</span> Subjects
        </a></li>
        <li><a href="/assistants" className={getActiveClass('/assistants')}>
          <span className="nav-icon">👨‍🏫</span> Assistants
        </a></li>
        <li><a href="/students" className={getActiveClass('/students')}>
          <span className="nav-icon">👨‍🎓</span> Students
        </a></li>
        <li><a href="/sessions" className={getActiveClass('/sessions')}>
          <span className="nav-icon">📅</span> Sessions
        </a></li>
        <li><a href="/reports" className={getActiveClass('/reports')}>
          <span className="nav-icon">📈</span> Reports
        </a></li>
        <li><button onClick={onLogout} className="logout-btn">
          <span className="nav-icon">🚪</span> Logout
        </button></li>
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
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading Manager Dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <Router>
      <div className="manager-layout">
        <Sidebar onLogout={logout} currentUser={currentUser} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/subjects" element={<Subjects currentUser={currentUser} />} />
            <Route path="/assistants" element={<Assistants currentUser={currentUser} />} />
            <Route path="/students" element={<Students currentUser={currentUser} />} />
            <Route path="/sessions" element={<Sessions currentUser={currentUser} />} />
            <Route path="/reports" element={<Reports currentUser={currentUser} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;