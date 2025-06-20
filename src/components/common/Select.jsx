import React from 'react';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [],
  placeholder = "Select an option",
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
        <select
          name={name}
          className={`form-select ${error ? 'error' : ''}`}
          value={value}
          onChange={onChange}
          required={required}
          style={icon ? { paddingLeft: '44px' } : {}}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <div style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', fontWeight: '500' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Select;