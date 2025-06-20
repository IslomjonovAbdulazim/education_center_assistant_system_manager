import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import { Plus, Edit, Trash2, BookOpen, Users, GraduationCap } from 'lucide-react';
import Modal, { ConfirmModal } from '../components/Modal';

const SubjectForm = ({ subject = null, onSubmit, onCancel, loading = false }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (subject) {
      setName(subject.name || '');
    }
  }, [subject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }

    if (name.trim().length < 2) {
      setError('Subject name must be at least 2 characters');
      return;
    }

    onSubmit({ name: name.trim() });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          Subject Name <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Enter subject name"
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ marginRight: '8px' }}></div>
              {subject ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            subject ? 'Update Subject' : 'Create Subject'
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start' 
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#1e293b'
              }}>
                {subject.name}
              </h3>
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                marginTop: '2px'
              }}>
                Created: {subject.created_at}
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 12px',
              background: '#f0f9ff',
              borderRadius: '6px',
              border: '1px solid #e0f2fe'
            }}>
              <Users size={16} style={{ color: '#0ea5e9' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#0c4a6e' }}>
                  {subject.assistant_count}
                </div>
                <div style={{ fontSize: '12px', color: '#075985' }}>
                  Assistants
                </div>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 12px',
              background: '#f0fdf4',
              borderRadius: '6px',
              border: '1px solid #dcfce7'
            }}>
              <GraduationCap size={16} style={{ color: '#22c55e' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#14532d' }}>
                  {subject.student_count}
                </div>
                <div style={{ fontSize: '12px', color: '#166534' }}>
                  Students
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
          <button
            className="btn btn-primary btn-small"
            onClick={() => onEdit(subject)}
            title="Edit Subject"
          >
            <Edit size={14} />
          </button>
          <button
            className="btn btn-danger btn-small"
            onClick={() => onDelete(subject)}
            title="Delete Subject"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected subject for operations
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  // Form loading state
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await managerAPI.getSubjects();
      setSubjects(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch subjects');
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 5000);
  };

  const showErrorMessage = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  // Create subject
  const handleCreate = async (formData) => {
    try {
      setFormLoading(true);
      await managerAPI.createSubject(formData);
      await fetchSubjects();
      setShowCreateModal(false);
      showSuccessMessage('Subject created successfully!');
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Failed to create subject');
    } finally {
      setFormLoading(false);
    }
  };

  // Update subject
  const handleUpdate = async (formData) => {
    try {
      setFormLoading(true);
      await managerAPI.updateSubject(selectedSubject.id, formData);
      await fetchSubjects();
      setShowEditModal(false);
      setSelectedSubject(null);
      showSuccessMessage('Subject updated successfully!');
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Failed to update subject');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete subject
  const handleDelete = async () => {
    try {
      await managerAPI.deleteSubject(selectedSubject.id);
      await fetchSubjects();
      setSelectedSubject(null);
      showSuccessMessage('Subject deleted successfully!');
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Failed to delete subject');
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setSelectedSubject(null);
    setShowCreateModal(true);
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject);
    setShowEditModal(true);
  };

  const openDeleteModal = (subject) => {
    setSelectedSubject(subject);
    setShowDeleteModal(true);
  };

  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedSubject(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading subjects...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <h2 className="card-title">Subjects Management</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} style={{ marginRight: '8px' }} />
          Add New Subject
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          {success}
        </div>
      )}

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="card">
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: '#6b7280' 
          }}>
            <BookOpen size={48} style={{ 
              margin: '0 auto 16px', 
              color: '#d1d5db' 
            }} />
            <h3 style={{ 
              margin: '0 0 8px', 
              color: '#374151',
              fontSize: '18px',
              fontWeight: '500'
            }}>
              No subjects found
            </h3>
            <p style={{ margin: '0 0 24px' }}>
              Get started by creating your first subject.
            </p>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <Plus size={16} style={{ marginRight: '8px' }} />
              Create First Subject
            </button>
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
          gap: '20px' 
        }}>
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeAllModals}
        title="Create New Subject"
        size="small"
      >
        <SubjectForm
          onSubmit={handleCreate}
          onCancel={closeAllModals}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeAllModals}
        title="Edit Subject"
        size="small"
      >
        <SubjectForm
          subject={selectedSubject}
          onSubmit={handleUpdate}
          onCancel={closeAllModals}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={closeAllModals}
        onConfirm={handleDelete}
        title="Delete Subject"
        message={
          selectedSubject?.assistant_count > 0 || selectedSubject?.student_count > 0
            ? `Cannot delete "${selectedSubject?.name}" because it has ${selectedSubject?.assistant_count} assistants and ${selectedSubject?.student_count} students assigned to it. Please reassign them first.`
            : `Are you sure you want to delete "${selectedSubject?.name}"? This action cannot be undone.`
        }
        confirmText="Delete"
        type="danger"
      />

      {/* Stats Summary */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h3 className="card-title" style={{ marginBottom: '20px' }}>
          Subjects Summary
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '20px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#667eea',
              marginBottom: '4px'
            }}>
              {subjects.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Total Subjects
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#10b981',
              marginBottom: '4px'
            }}>
              {subjects.reduce((sum, s) => sum + s.assistant_count, 0)}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Total Assistants
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#f59e0b',
              marginBottom: '4px'
            }}>
              {subjects.reduce((sum, s) => sum + s.student_count, 0)}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Total Students
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;