import React, { useState, useEffect } from 'react';
import { validatePhone, validateFullname, validatePassword } from '../types';
import { t } from '../types/translations';

const UserForm = ({ 
  user = null, 
  subjects = [], 
  onSubmit, 
  onCancel, 
  loading = false,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '+998',
    password: '',
    role: 'assistant',
    subject_field: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        fullname: user.fullname || '',
        phone: user.phone || '+998',
        password: '',
        role: user.role || 'assistant',
        subject_field: user.subject_field || ''
      });
    }
  }, [user, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateFullname(formData.fullname)) {
      newErrors.fullname = t('nameValidation');
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = t('phoneValidation');
    }

    if (mode === 'create' && !validatePassword(formData.password)) {
      newErrors.password = t('passwordValidation');
    }

    if (!formData.role) {
      newErrors.role = 'Rol kiritish majburiy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = { ...formData };
    
    if (mode === 'edit' && !submitData.password) {
      delete submitData.password;
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Full Name */}
      <div className="form-group">
        <label className="form-label">
          To'liq ism <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="text"
          name="fullname"
          className={`form-input ${errors.fullname ? 'error' : ''}`}
          value={formData.fullname}
          onChange={handleChange}
          placeholder="To'liq ismni kiriting"
          required
        />
        {errors.fullname && (
          <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
            {errors.fullname}
          </div>
        )}
      </div>

      {/* Phone */}
      <div className="form-group">
        <label className="form-label">
          Telefon raqam <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="tel"
          name="phone"
          className={`form-input ${errors.phone ? 'error' : ''}`}
          value={formData.phone}
          onChange={handleChange}
          placeholder="+998901234567"
          required
        />
        {errors.phone && (
          <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
            {errors.phone}
          </div>
        )}
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="form-label">
          Parol {mode === 'create' && <span style={{ color: 'red' }}>*</span>}
          {mode === 'edit' && <span style={{ color: '#6b7280', fontSize: '12px' }}>(bo'sh qoldiring, hozirgi parolni saqlash uchun)</span>}
        </label>
        <input
          type="password"
          name="password"
          className={`form-input ${errors.password ? 'error' : ''}`}
          value={formData.password}
          onChange={handleChange}
          placeholder={mode === 'create' ? "Parolni kiriting" : "Yangi parolni kiriting"}
          required={mode === 'create'}
        />
        {errors.password && (
          <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
            {errors.password}
          </div>
        )}
      </div>

      {/* Role */}
      <div className="form-group">
        <label className="form-label">
          Rol <span style={{ color: 'red' }}>*</span>
        </label>
        <select
          name="role"
          className={`form-select ${errors.role ? 'error' : ''}`}
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="assistant">Yordamchi</option>
          <option value="student">Talaba</option>
        </select>
        {errors.role && (
          <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
            {errors.role}
          </div>
        )}
      </div>

      {/* Subject Field */}
      <div className="form-group">
        <label className="form-label">Fan sohasi</label>
        {subjects.length > 0 ? (
          <select
            name="subject_field"
            className="form-select"
            value={formData.subject_field}
            onChange={handleChange}
          >
            <option value="">Fanni tanlang</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="subject_field"
            className="form-input"
            value={formData.subject_field}
            onChange={handleChange}
            placeholder="Fan sohasini kiriting"
          />
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ marginRight: '8px' }}></div>
              {mode === 'create' ? t('creating') : t('updating')}
            </>
          ) : (
            mode === 'create' ? 'Foydalanuvchi yaratish' : 'Foydalanuvchini yangilash'
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
};

export default UserForm;