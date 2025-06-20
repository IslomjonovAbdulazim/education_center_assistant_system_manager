import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import { Plus } from 'lucide-react';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import Modal, { ConfirmModal, UserDetailModal, ChangePasswordModal } from '../components/Modal';
import { createUser } from '../types';

const Assistants = () => {
  const [assistants, setAssistants] = useState([]);
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
      
      const [assistantsRes, subjectsRes] = await Promise.all([
        managerAPI.getUsers('assistant'),
        managerAPI.getSubjects()
      ]);
      
      setAssistants(assistantsRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch assistants');
      console.error('Error fetching assistants:', err);
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

  // Create assistant
  const handleCreate = async (formData) => {
    try {
      setFormLoading(true);
      await managerAPI.createUser(formData);
      await fetchData();
      setShowCreateModal(false);
      showSuccessMessage('Assistant created successfully!');
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Failed to create assistant');
    } finally {
      setFormLoading(false);
    }
  };

  // Update assistant
  const handleUpdate = async (formData) => {
    try {
      setFormLoading(true);
      await managerAPI.updateUser(selectedUser.id, formData);
      await fetchData();
      setShowEditModal(false);
      setSelectedUser(null);
      showSuccessMessage('Assistant updated successfully!');
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Failed to update assistant');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete assistant
  const handleDelete = async () => {
    try {
      await managerAPI.deleteUser(selectedUser.id);
      await fetchData();
      setSelectedUser(null);
      showSuccessMessage('Assistant deleted successfully!');
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Failed to delete assistant');
    }
  };

  // Change password
  const handleChangePassword = async (newPassword) => {
    try {
      await managerAPI.changeUserPassword(selectedUser.id, { new_password: newPassword });
      setShowPasswordModal(false);
      setSelectedUser(null);
      showSuccessMessage('Password changed successfully!');
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Failed to change password');
    }
  };

  // View assistant details
  const handleView = async (user) => {
    try {
      setSelectedUser(user);
      setDetailLoading(true);
      setShowDetailModal(true);
      
      const response = await managerAPI.getUserDetail(user.id);
      setSelectedUser(response.data);
      setUserSessions(response.data.sessions || []);
    } catch (err) {
      showErrorMessage('Failed to fetch user details');
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
        <h2 className="card-title">Assistants Management</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} style={{ marginRight: '8px' }} />
          Add New Assistant
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

      {/* Assistants Table */}
      <div className="card">
        <UserTable
          users={assistants}
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
        title="Create New Assistant"
      >
        <UserForm
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
        title="Edit Assistant"
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
        title="Delete Assistant"
        message={`Are you sure you want to delete ${selectedUser?.fullname}? This action cannot be undone.`}
        confirmText="Delete"
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

export default Assistants;