import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  error,
  name,
  icon,
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: '#e53e3e' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#a0aec0',
            fontSize: '16px',
            zIndex: 1
          }}>
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          className={`form-input ${error ? 'error' : ''} ${icon ? 'with-icon' : ''}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={icon ? { paddingLeft: '44px' } : {}}
          {...props}
        />
      </div>
      {error && (
        <div style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', fontWeight: '500' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;