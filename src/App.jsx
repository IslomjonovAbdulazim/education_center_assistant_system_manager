import React, { useState, useEffect } from 'react';
import { authService } from './services/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assistants from './pages/Assistants';
import Students from './pages/Students';
import Subjects from './pages/Subjects';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check if user is already authenticated
    const isAuth = authService.isAuthenticated();
    setIsAuthenticated(isAuth);
    setLoading(false);
  }, []);

  const handleLogin = (token, user) => {
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Render main application
  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={handleTabChange}
      onLogout={handleLogout}
    >
      <div className="tab-content active">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'assistants' && <Assistants />}
        {activeTab === 'students' && <Students />}
        {activeTab === 'subjects' && <Subjects />}
      </div>
    </Layout>
  );
}

export default App;