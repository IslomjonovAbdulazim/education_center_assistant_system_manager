import React, { useState } from 'react';
import { Eye, Edit, Trash2, Key } from 'lucide-react';
import { generateStars, getInitials } from '../types';
import { t } from '../types/translations';

const UserTable = ({ 
  users, 
  onView, 
  onEdit, 
  onDelete, 
  onChangePassword,
  loading = false,
  userType = 'assistant' // 'assistant' or 'student'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    (user.subject_field && user.subject_field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleLabel = () => {
    return userType === 'assistant' ? 'Yordamchi' : 'Talaba';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Foydalanuvchilar yuklanmoqda...
      </div>
    );
  }

  return (
    <div>
      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Foydalanuvchilarni qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Foydalanuvchi</th>
              <th>Telefon</th>
              <th>Fan</th>
              <th>Baho</th>
              <th>Darslar</th>
              <th>Yaratilgan</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  {searchTerm ? 'Qidirishga mos foydalanuvchilar topilmadi.' : 'Foydalanuvchilar topilmadi.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar" style={{ 
                        width: '36px', 
                        height: '36px', 
                        fontSize: '14px',
                        background: user.photo_url ? 'transparent' : '#e5e7eb',
                        color: '#6b7280'
                      }}>
                        {user.photo_url ? (
                          <img 
                            src={user.photo_url} 
                            alt={user.fullname}
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          getInitials(user.fullname)
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500' }}>{user.fullname}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {getRoleLabel()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{user.phone}</td>
                  <td>{user.subject_field || 'Belgilanmagan'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="rating-stars">
                        {generateStars(user.avg_rating || 0)}
                      </div>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        ({user.avg_rating || 0})
                      </span>
                    </div>
                  </td>
                  <td>{user.total_sessions || 0}</td>
                  <td>{user.created_at || 'Noma\'lum'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => onView(user)}
                        title="Tafsilotlarni ko'rish"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => onEdit(user)}
                        title="Foydalanuvchini tahrirlash"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-warning btn-small"
                        onClick={() => onChangePassword(user)}
                        title="Parolni o'zgartirish"
                        style={{ background: '#f59e0b' }}
                      >
                        <Key size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => onDelete(user)}
                        title="Foydalanuvchini o'chirish"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results Info */}
      <div style={{ 
        marginTop: '16px', 
        fontSize: '14px', 
        color: '#6b7280',
        textAlign: 'center'
      }}>
        {filteredUsers.length} dan {users.length} foydalanuvchi ko'rsatilmoqda
      </div>
    </div>
  );
};

export default UserTable;