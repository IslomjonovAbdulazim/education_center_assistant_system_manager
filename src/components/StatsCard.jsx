import React from 'react';

const StatsCard = ({ title, value, variant = 'primary', icon }) => {
  return (
    <div className={`stat-card ${variant}`}>
      {icon && <div className="stat-icon">{icon}</div>}
      <span className="stat-number">{value}</span>
      <span className="stat-label">{title}</span>
    </div>
  );
};

export default StatsCard;