import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return { maxWidth: '400px' };
      case 'large':
        return { maxWidth: '800px' };
      default:
        return { maxWidth: '600px' };
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        style={getSizeClass()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

// Specific modal types
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // 'danger', 'warning', 'info'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
          {message}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-secondary"
          onClick={onClose}
        >
          {cancelText}
        </button>
        <button
          className={`btn btn-${type}`}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export const UserDetailModal = ({ 
  isOpen, 
  onClose, 
  user, 
  sessions = [],
  loading = false 
}) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="large">
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading user details...
        </div>
      ) : (
        <div>
          {/* User Info */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px',
            marginBottom: '30px',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>
            <div>
              <strong>Full Name:</strong> {user.fullname}
            </div>
            <div>
              <strong>Phone:</strong> {user.phone}
            </div>
            <div>
              <strong>Role:</strong> {user.role}
            </div>
            <div>
              <strong>Subject:</strong> {user.subject_field || 'N/A'}
            </div>
            <div>
              <strong>Average Rating:</strong> {user.avg_rating || 0}/5
            </div>
            <div>
              <strong>Total Sessions:</strong> {user.total_sessions || 0}
            </div>
          </div>

          {/* Sessions */}
          <div>
            <h4 style={{ marginBottom: '16px', color: '#1e293b' }}>
              Recent Sessions ({sessions.length})
            </h4>
            {sessions.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#6b7280',
                background: '#f8fafc',
                borderRadius: '8px'
              }}>
                No sessions found
              </div>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {sessions.map((session, index) => (
                  <div
                    key={session.id || index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '500' }}>
                        {session.related_user_name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {session.datetime}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: session.attendance === 'present' ? '#dcfce7' : 
                                       session.attendance === 'absent' ? '#fef2f2' : '#f1f5f9',
                        color: session.attendance === 'present' ? '#166534' : 
                               session.attendance === 'absent' ? '#dc2626' : '#64748b'
                      }}>
                        {session.attendance}
                      </div>
                      {session.rating && (
                        <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px' }}>
                          {'★'.repeat(Math.floor(session.rating))}
                          {'☆'.repeat(5 - Math.floor(session.rating))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export const ChangePasswordModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user,
  loading = false 
}) => {
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onSubmit(newPassword);
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password" size="small">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Change password for: <strong>{user?.fullname}</strong>
          </p>
          
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="Confirm new password"
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default Modal;