import React, { useState } from 'react';
import { Eye, Edit, Trash2, Key } from 'lucide-react';
import { generateStars, getInitials } from '../types';

const UserTable = ({ 
  users, 
  onView, 
  onEdit, 
  onDelete, 
  onChangePassword,
  loading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    (user.subject_field && user.subject_field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading users...
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
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Rating</th>
              <th>Sessions</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
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
                          {user.role === 'assistant' ? 'Assistant' : 'Student'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{user.phone}</td>
                  <td>{user.subject_field || 'N/A'}</td>
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
                  <td>{user.created_at || 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => onView(user)}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => onEdit(user)}
                        title="Edit User"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-warning btn-small"
                        onClick={() => onChangePassword(user)}
                        title="Change Password"
                        style={{ background: '#f59e0b' }}
                      >
                        <Key size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => onDelete(user)}
                        title="Delete User"
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
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
};

export default UserTable;