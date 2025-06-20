import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'normal',
  disabled = false,
  onClick,
  className = '',
  icon,
  loading = false,
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'small' ? 'btn-small' : '';
  
  const classes = [baseClass, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>}
      {icon && !loading && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;