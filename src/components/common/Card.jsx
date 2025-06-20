import React from 'react';

const Card = ({ 
  title, 
  children, 
  headerAction,
  className = '',
  gradient = false,
  ...props 
}) => {
  const cardStyle = gradient ? {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    border: '1px solid rgba(102, 126, 234, 0.1)'
  } : {};

  return (
    <div className={`card ${className}`} style={cardStyle} {...props}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;