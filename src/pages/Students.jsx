import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import { Plus } from 'lucide-react';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import Modal, { ConfirmModal, UserDetailModal, ChangePasswordModal } from '../components/Modal';
import { t } from '../types/translations';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Selected user for operations
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSessions, setUserSessions] = useState([]);
  
  // Form loading states
  const [formLoading, setFormLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [studentsRes, subjectsRes] = await Promise.all([
        managerAPI.getUsers('student'),
        managerAPI.getSubjects()
      ]);
      
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      setError('Talabalarni yuklashda xatolik yuz berdi');
      console.error('Error fetching students:', err);
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

  // Create student
  const handleCreate = async (formData) => {
    try {
      setFormLoading(true);
      const studentData = { ...formData, role: 'student' };
      await managerAPI.createUser(studentData);
      await fetchData();
      setShowCreateModal(false);
      showSuccessMessage(t('studentCreated'));
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Talaba yaratishda xatolik');
    } finally {
      setFormLoading(false);
    }
  };

  // Update student
  const handleUpdate = async (formData) => {
    try {
      setFormLoading(true);
      await managerAPI.updateUser(selectedUser.id, formData);
      await fetchData();
      setShowEditModal(false);
      setSelectedUser(null);
      showSuccessMessage(t('studentUpdated'));
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Talaba yangilashda xatolik');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete student
  const handleDelete = async () => {
    try {
      await managerAPI.deleteUser(selectedUser.id);
      await fetchData();
      setSelectedUser(null);
      showSuccessMessage(t('studentDeleted'));
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Talaba o\'chirishda xatolik');
    }
  };

  // Change password
  const handleChangePassword = async (newPassword) => {
    try {
      await managerAPI.changeUserPassword(selectedUser.id, { new_password: newPassword });
      setShowPasswordModal(false);
      setSelectedUser(null);
      showSuccessMessage('Parol muvaffaqiyatli o\'zgartirildi!');
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Parol o\'zgartirishda xatolik');
    }
  };

  // View student details
  const handleView = async (user) => {
    try {
      setSelectedUser(user);
      setDetailLoading(true);
      setShowDetailModal(true);
      
      const response = await managerAPI.getUserDetail(user.id);
      setSelectedUser(response.data);
      setUserSessions(response.data.sessions || []);
    } catch (err) {
      showErrorMessage('Foydalanuvchi ma\'lumotlarini yuklashda xatolik');
    } finally {
      setDetailLoading(false);
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setShowDeleteModal(false);
    setShowPasswordModal(false);
    setSelectedUser(null);
    setUserSessions([]);
  };

  return (
    <div>
      {/* Header */}
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <h2 className="card-title">{t('studentsManagement')}</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} style={{ marginRight: '8px' }} />
          {t('addNewStudent')}
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

      {/* Students Table */}
      <div className="card">
        <UserTable
          users={students}
          loading={loading}
          onView={handleView}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onChangePassword={openPasswordModal}
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeAllModals}
        title={t('createNewStudent')}
      >
        <UserForm
          user={{ role: 'student' }}
          subjects={subjects}
          onSubmit={handleCreate}
          onCancel={closeAllModals}
          loading={formLoading}
          mode="create"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeAllModals}
        title={t('editStudent')}
      >
        <UserForm
          user={selectedUser}
          subjects={subjects}
          onSubmit={handleUpdate}
          onCancel={closeAllModals}
          loading={formLoading}
          mode="edit"
        />
      </Modal>

      {/* Detail Modal */}
      <UserDetailModal
        isOpen={showDetailModal}
        onClose={closeAllModals}
        user={selectedUser}
        sessions={userSessions}
        loading={detailLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={closeAllModals}
        onConfirm={handleDelete}
        title={t('deleteStudent')}
        message={`Rostdan ham ${selectedUser?.fullname}ni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`}
        confirmText="O'chirish"
        type="danger"
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={closeAllModals}
        onSubmit={handleChangePassword}
        user={selectedUser}
        loading={formLoading}
      />
    </div>
  );
};

export default Students;