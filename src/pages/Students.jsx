import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';

const StudentModal = ({ isOpen, onClose, onSuccess, editingStudent, subjects }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    password: '',
    subject_field: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        fullname: editingStudent.fullname || '',
        phone: editingStudent.phone || '',
        password: '',
        subject_field: editingStudent.subject_field || ''
      });
    } else {
      setFormData({ fullname: '', phone: '', password: '', subject_field: '' });
    }
  }, [editingStudent, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = { ...formData, role: 'student' };
      if (editingStudent) {
        if (!formData.password) delete submitData.password;
        await managerAPI.updateUser(editingStudent.id, submitData);
      } else {
        await managerAPI.createUser(submitData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const subjectOptions = subjects.map(s => ({ value: s.name, label: s.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStudent ? '✏️ Edit Student' : '👨‍🎓 Add New Student'}
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
          label={editingStudent ? "New Password (leave empty to keep current)" : "Password"}
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter password"
          required={!editingStudent}
          icon="🔒"
        />

        <Select
          label="Subject of Interest"
          name="subject_field"
          value={formData.subject_field}
          onChange={(e) => setFormData({ ...formData, subject_field: e.target.value })}
          options={subjectOptions}
          placeholder="Select subject to learn"
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
            {editingStudent ? 'Update Student' : 'Add Student'}
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

const Students = ({ currentUser }) => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, subjectsRes] = await Promise.all([
        managerAPI.getUsers('student'),
        managerAPI.getSubjects()
      ]);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      // Mock data
      setStudents([
        {
          id: 1,
          fullname: 'Sardor Rahimov',
          phone: '+998901234569',
          subject_field: 'Mathematics',
          photo_url: null,
          active_status: 'Active',
          sessions_count: 12,
          attendance_rate: 95,
          progress: 'Excellent'
        },
        {
          id: 2,
          fullname: 'Nodira Kholmatova',
          phone: '+998901234570',
          subject_field: 'English',
          photo_url: null,
          active_status: 'Active',
          sessions_count: 8,
          attendance_rate: 87,
          progress: 'Good'
        },
        {
          id: 3,
          fullname: 'Bekzod Umarov',
          phone: '+998901234571',
          subject_field: 'Programming',
          photo_url: null,
          active_status: 'Active',
          sessions_count: 15,
          attendance_rate: 92,
          progress: 'Very Good'
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
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await managerAPI.deleteUser(studentId);
      fetchData();
    } catch (err) {
      setError('Failed to delete student');
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
              alt="Student"
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
          background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
          color: '#4facfe',
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
          <div style={{ fontSize: '10px', color: '#718096' }}>attended</div>
        </div>
      )
    },
    {
      key: 'attendance_rate',
      title: 'Attendance',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '40px',
            height: '6px',
            background: '#e2e8f0',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${value || 0}%`,
              height: '100%',
              background: value >= 90 ? '#38a169' : value >= 75 ? '#ed8936' : '#e53e3e',
              borderRadius: '3px'
            }}></div>
          </div>
          <span style={{ fontSize: '12px', fontWeight: '500' }}>{value || 0}%</span>
        </div>
      )
    },
    {
      key: 'progress',
      title: 'Progress',
      render: (value) => {
        const colors = {
          'Excellent': '#38a169',
          'Very Good': '#4facfe',
          'Good': '#ed8936',
          'Average': '#ecc94b',
          'Poor': '#e53e3e'
        };
        return (
          <span style={{
            color: colors[value] || '#718096',
            fontWeight: '500',
            fontSize: '12px'
          }}>
            {value === 'Excellent' ? '🌟 Excellent' :
             value === 'Very Good' ? '⭐ Very Good' :
             value === 'Good' ? '👍 Good' :
             value === 'Average' ? '👌 Average' : '📈 Improving'}
          </span>
        )
      }
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
            👨‍🎓 Students Management
          </h1>
          <p style={{ color: '#718096', fontSize: '16px' }}>
            Manage students enrolled in your learning center
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate} icon="➕">
          Add New Student
        </Button>
      </div>

      {error && <div className="alert alert-warning">{error} (Showing demo data)</div>}

      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-number">{students.length}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {students.reduce((sum, s) => sum + (s.sessions_count || 0), 0)}
          </div>
          <div className="stat-label">Total Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {students.length > 0 ? 
              Math.round(students.reduce((sum, s) => sum + (s.attendance_rate || 0), 0) / students.length) : 
              0
            }%
          </div>
          <div className="stat-label">Avg Attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {students.filter(s => s.active_status === 'Active').length}
          </div>
          <div className="stat-label">Active Students</div>
        </div>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <StudentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchData}
        editingStudent={editingStudent}
        subjects={subjects}
      />
    </div>
  );
};

export default Students;