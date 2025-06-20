import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  return (
    <div className="card" style={{ 
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
      border: '1px solid rgba(102, 126, 234, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#2d3748',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📚 {subject.name}
          </h3>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#667eea', fontSize: '16px' }}>👨‍🏫</span>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>
                {subject.assistants_count || 0} Assistants
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#38a169', fontSize: '16px' }}>👨‍🎓</span>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>
                {subject.students_count || 0} Students
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ed8936', fontSize: '16px' }}>📅</span>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>
                {subject.sessions_count || 0} Sessions
              </span>
            </div>
          </div>
          {subject.description && (
            <p style={{ 
              color: '#718096', 
              fontSize: '14px',
              marginBottom: '16px',
              lineHeight: '1.5'
            }}>
              {subject.description}
            </p>
          )}
          <div style={{ fontSize: '12px', color: '#a0aec0' }}>
            Created {new Date(subject.created_at).toLocaleDateString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => onEdit(subject)}
            icon="✏️"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => onDelete(subject.id)}
            icon="🗑️"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const CreateSubjectModal = ({ isOpen, onClose, onSuccess, editingSubject }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingSubject) {
      setFormData({
        name: editingSubject.name || '',
        description: editingSubject.description || ''
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [editingSubject, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingSubject) {
        await managerAPI.updateSubject(editingSubject.id, formData);
      } else {
        await managerAPI.createSubject(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save subject');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingSubject ? '✏️ Edit Subject' : '➕ Create New Subject'}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          
          <Input
            label="Subject Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Advanced Mathematics, English Literature"
            required
            icon="📚"
          />

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the subject..."
              rows="4"
              style={{ resize: 'vertical', minHeight: '100px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              style={{ flex: 1 }}
            >
              {editingSubject ? 'Update Subject' : 'Create Subject'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Subjects = ({ currentUser }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getSubjects();
      setSubjects(response.data);
    } catch (err) {
      setError('Failed to fetch subjects');
      // Mock data for demo
      setSubjects([
        {
          id: 1,
          name: 'Advanced Mathematics',
          description: 'Comprehensive mathematics course covering algebra, calculus, and geometry',
          assistants_count: 3,
          students_count: 15,
          sessions_count: 45,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'English Literature',
          description: 'English language and literature studies for all levels',
          assistants_count: 2,
          students_count: 12,
          sessions_count: 38,
          created_at: '2024-02-01T10:00:00Z'
        },
        {
          id: 3,
          name: 'Programming Fundamentals',
          description: 'Introduction to programming concepts and software development',
          assistants_count: 4,
          students_count: 20,
          sessions_count: 52,
          created_at: '2024-01-20T10:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreate = () => {
    setEditingSubject(null);
    setShowModal(true);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setShowModal(true);
  };

  const handleDelete = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
      return;
    }

    try {
      await managerAPI.deleteSubject(subjectId);
      fetchSubjects();
    } catch (err) {
      setError('Failed to delete subject');
    }
  };

  const handleSuccess = () => {
    fetchSubjects();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        <div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#2d3748',
            marginBottom: '8px'
          }}>
            📚 Subjects Management
          </h1>
          <p style={{ color: '#718096', fontSize: '16px' }}>
            Manage subjects offered in your learning center
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          icon="➕"
        >
          Add New Subject
        </Button>
      </div>

      {error && <div className="alert alert-warning">{error} (Showing demo data)</div>}

      {/* Stats Overview */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-number">{subjects.length}</div>
          <div className="stat-label">Total Subjects</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {subjects.reduce((sum, s) => sum + (s.assistants_count || 0), 0)}
          </div>
          <div className="stat-label">Total Assistants</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {subjects.reduce((sum, s) => sum + (s.students_count || 0), 0)}
          </div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {subjects.reduce((sum, s) => sum + (s.sessions_count || 0), 0)}
          </div>
          <div className="stat-label">Total Sessions</div>
        </div>
      </div>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📚</div>
          <h3 style={{ color: '#4a5568', marginBottom: '12px' }}>No subjects yet</h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>
            Create your first subject to start organizing your learning center
          </p>
          <Button variant="primary" onClick={handleCreate} icon="➕">
            Create First Subject
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CreateSubjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
        editingSubject={editingSubject}
      />
    </div>
  );
};

export default Subjects;