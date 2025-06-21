import React from 'react';
import { authService } from '../services/auth';
import { getInitials } from '../types';
import { t } from '../types/translations';

const Layout = ({ children, activeTab, onTabChange }) => {
  const currentUser = authService.getCurrentUser();
  
  const handleLogout = () => {
    if (window.confirm('Rostdan ham chiqmoqchimisiz?')) {
      authService.logout();
      window.location.href = '/login';
    }
  };

  const tabs = [
    { id: 'dashboard', label: t('dashboard') },
    { id: 'assistants', label: t('assistants') },
    { id: 'students', label: t('students') },
    { id: 'subjects', label: t('subjects') }
  ];

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>{t('managerDashboard')}</h1>
          <div className="user-info">
            <div className="user-avatar">
              {currentUser ? getInitials(currentUser.fullname) : 'M'}
            </div>
            <span>{currentUser?.fullname || 'Menejer'}</span>
            <button className="logout-btn" onClick={handleLogout}>
              {t('logout')}
            </button>
          </div>
        </div>
      </div>

      <div className="container">
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
        {children}
      </div>
    </div>
  );
};

export default Layout;