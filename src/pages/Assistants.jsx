import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';

const AssistantModal = ({ isOpen, onClose, onSuccess, editingAssistant, subjects }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    password: '',
    subject_field: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingAssistant) {
      setFormData({
        fullname: editingAssistant.fullname || '',
        phone: editingAssistant.phone || '',
        password: '',
        subject_field: editingAssistant.subject_field || ''
      });
    } else {
      setFormData({ fullname: '', phone: '', password: '', subject_field: '' });
    }
  }, [editingAssistant, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = { ...formData, role: 'assistant' };
      if (editingAssistant) {
        // Don't send password if not changed
        if (!formData.password) delete submitData.password;
        await managerAPI.updateUser(editingAssistant.id, submitData);
      } else {
        await managerAPI.createUser(submitData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save assistant');
    } finally {
      setLoading(false);
    }
  };

  const subjectOptions = subjects.map(s => ({ value: s.name, label: s.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingAssistant ? '✏️ Edit Assistant' : '👨‍🏫 Add New Assistant'}
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        
        <Input
          label="Full Name"
          name="fullname"
          value={formData.fullname}
          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
          placeholder="Enter full name"
          required
          icon="👤"
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+998901234567"
          required
          icon="📞"
        />

        <Input
          label={editingAssistant ? "New Password (leave empty to keep current)" : "Password"}
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter password"
          required={!editingAssistant}
          icon="🔒"
        />

        <Select
          label="Subject"
          name="subject_field"
          value={formData.subject_field}
          onChange={(e) => setFormData({ ...formData, subject_field: e.target.value })}
          options={subjectOptions}
          placeholder="Select subject to teach"
          required
          icon="📚"
        />

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ flex: 1 }}
          >
            {editingAssistant ? 'Update Assistant' : 'Add Assistant'}
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
    </Modal>
  );
};

const Assistants = ({ currentUser }) => {
  const [assistants, setAssistants] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assistantsRes, subjectsRes] = await Promise.all([
        managerAPI.getUsers('assistant'),
        managerAPI.getSubjects()
      ]);
      setAssistants(assistantsRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      // Mock data
      setAssistants([
        {
          id: 1,
          fullname: 'Ali Karimov',
          phone: '+998901234567',
          subject_field: 'Mathematics',
          photo_url: null,
          active_status: 'Active',
          sessions_count: 45,
          rating: 4.8
        },
        {
          id: 2,
          fullname: 'Malika Tosheva',
          phone: '+998901234568',
          subject_field: 'English',
          photo_url: null,
          active_status: 'Active',
          sessions_count: 38,
          rating: 4.9
        }
      ]);
      setSubjects([
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'English' },
        { id: 3, name: 'Programming' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setEditingAssistant(null);
    setShowModal(true);
  };

  const handleEdit = (assistant) => {
    setEditingAssistant(assistant);
    setShowModal(true);
  };

  const handleDelete = async (assistantId) => {
    if (!window.confirm('Are you sure you want to delete this assistant?')) {
      return;
    }

    try {
      await managerAPI.deleteUser(assistantId);
      fetchData();
    } catch (err) {
      setError('Failed to delete assistant');
    }
  };

  const columns = [
    {
      key: 'fullname',
      title: 'Name',
      render: (value, item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {item.photo_url ? (
            <img
              src={item.photo_url}
              alt="Assistant"
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600'
            }}>
              {value.charAt(0)}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '500' }}>{value}</div>
            <div style={{ fontSize: '12px', color: '#718096' }}>{item.phone}</div>
          </div>
        </div>
      )
    },
    {
      key: 'subject_field',
      title: 'Subject',
      render: (value) => (
        <span style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          color: '#667eea',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          📚 {value}
        </span>
      )
    },
    {
      key: 'sessions_count',
      title: 'Sessions',
      render: (value) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '600', color: '#2d3748' }}>{value || 0}</div>
          <div style={{ fontSize: '10px', color: '#718096' }}>total</div>
        </div>
      )
    },
    {
      key: 'rating',
      title: 'Rating',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>⭐</span>
          <span style={{ fontWeight: '500' }}>{value || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'active_status',
      title: 'Status',
      render: (value) => (
        <span style={{
          color: value === 'Active' ? '#38a169' : '#e53e3e',
          fontWeight: '500',
          fontSize: '12px'
        }}>
          {value === 'Active' ? '🟢 Active' : '🔴 Inactive'}
        </span>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
            👨‍🏫 Assistants Management
          </h1>
          <p style={{ color: '#718096', fontSize: '16px' }}>
            Manage teaching assistants in your learning center
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate} icon="➕">
          Add New Assistant
        </Button>
      </div>

      {error && <div className="alert alert-warning">{error} (Showing demo data)</div>}

      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-number">{assistants.length}</div>
          <div className="stat-label">Total Assistants</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {assistants.reduce((sum, a) => sum + (a.sessions_count || 0), 0)}
          </div>
          <div className="stat-label">Total Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {assistants.length > 0 ? 
              (assistants.reduce((sum, a) => sum + (a.rating || 0), 0) / assistants.length).toFixed(1) : 
              '0.0'
            }
          </div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {assistants.filter(a => a.active_status === 'Active').length}
          </div>
          <div className="stat-label">Active Now</div>
        </div>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={assistants}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <AssistantModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchData}
        editingAssistant={editingAssistant}
        subjects={subjects}
      />
    </div>
  );
};

export default Assistants;