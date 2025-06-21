import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { validatePhone } from '../types';
import { t } from '../types/translations';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    phone: '+998',
    password: '',
    learning_center_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!validatePhone(formData.phone)) {
        throw new Error(t('phoneValidation'));
      }

      if (!formData.password) {
        throw new Error('Parol kiritish majburiy');
      }

      if (!formData.learning_center_id) {
        throw new Error('Ta\'lim markaz ID kiritish majburiy');
      }

      const { token, user } = await authService.login(
        formData.phone,
        formData.password,
        parseInt(formData.learning_center_id)
      );

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
        <h1>{t('loginTitle')}</h1>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('phoneLabel')}</label>
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
            <label className="form-label">{t('passwordLabel')}</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Parolingizni kiriting"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('centerIdLabel')}</label>
            <input
              type="number"
              name="learning_center_id"
              className="form-input"
              value={formData.learning_center_id}
              onChange={handleChange}
              placeholder="Ta'lim markaz ID kiriting"
              required
            />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Markaz ID bilmasangiz administrator bilan bog'laning
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
                {t('loggingIn')}
              </>
            ) : (
              t('loginButton')
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
          <strong>{t('demoCredentials')}</strong><br />
          {t('demoPhone')}<br />
          {t('demoPassword')}<br />
          {t('demoCenterId')}
        </div>
      </div>
    </div>
  );
};

export default Login;