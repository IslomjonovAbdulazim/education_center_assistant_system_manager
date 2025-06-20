import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { validatePhone } from '../types';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    phone: '+998',
    password: '',
    learning_center_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      onLogin();
    }
  }, [onLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!validatePhone(formData.phone)) {
        throw new Error('Phone number must be in format +998XXXXXXXXX');
      }

      if (!formData.password) {
        throw new Error('Password is required');
      }

      if (!formData.learning_center_id) {
        throw new Error('Learning Center ID is required');
      }

      // Attempt login
      const { token, user } = await authService.login(
        formData.phone,
        formData.password,
        parseInt(formData.learning_center_id)
      );

      // Success - call parent callback
      onLogin(token, user);

    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Manager Login</h1>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+998901234567"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Learning Center ID</label>
            <input
              type="number"
              name="learning_center_id"
              className="form-input"
              value={formData.learning_center_id}
              onChange={handleChange}
              placeholder="Enter learning center ID"
              required
            />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Contact your administrator if you don't know your center ID
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ marginRight: '8px' }}></div>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <strong>Demo Credentials:</strong><br />
          Phone: +998901234567<br />
          Password: demo123<br />
          Center ID: 1
        </div>
      </div>
    </div>
  );
};

export default Login;