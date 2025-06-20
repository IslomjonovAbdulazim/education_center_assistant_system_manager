import React from 'react';
import { authService } from '../services/auth';
import { getInitials } from '../types';

const Layout = ({ children, activeTab, onTabChange }) => {
  const currentUser = authService.getCurrentUser();
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      window.location.href = '/login';
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'assistants', label: 'Assistants' },
    { id: 'students', label: 'Students' },
    { id: 'subjects', label: 'Subjects' }
  ];

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1>Manager Dashboard</h1>
          <div className="user-info">
            <div className="user-avatar">
              {currentUser ? getInitials(currentUser.fullname) : 'M'}
            </div>
            <span>{currentUser?.fullname || 'Manager'}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Navigation Tabs */}
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;