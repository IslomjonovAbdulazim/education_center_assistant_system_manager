import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    phone: '+998901234567',
    password: 'password',
    learning_center_id: '1'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({
        phone: formData.phone,
        password: formData.password,
        learning_center_id: parseInt(formData.learning_center_id)
      });
      
      if (response.data.user_info.role !== 'manager') {
        setError('Access denied. Manager access required.');
        return;
      }
      
      onLogin(response.data.token, response.data.user_info);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <h1>Manager Portal</h1>
          
          {error && <div className="alert alert-error">{error}</div>}

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
              placeholder="1, 2, 3..."
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '20px' }}
          >
            {loading ? (
              <>
                <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                Logging in...
              </>
            ) : (
              'Login to Dashboard'
            )}
          </button>

          <div style={{ marginTop: '20px', fontSize: '12px', color: '#718096', textAlign: 'center' }}>
            <p><strong>Demo Manager Account:</strong></p>
            <p>Phone: +998901234567</p>
            <p>Password: password</p>
            <p>Center ID: 1</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;