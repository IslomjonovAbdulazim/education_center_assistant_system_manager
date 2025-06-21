import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import { Plus, Edit, Trash2, BookOpen, Users, GraduationCap, BarChart3 } from 'lucide-react';
import Modal, { ConfirmModal } from '../components/Modal';
import { t } from '../types/translations';

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
      setError('Fan nomi kiritish majburiy');
      return;
    }

    if (name.trim().length < 2) {
      setError('Fan nomi kamida 2 ta belgidan iborat bo\'lishi kerak');
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
          Fan nomi <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Fan nomini kiriting"
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
              {subject ? t('updating') : t('creating')}
            </>
          ) : (
            subject ? 'Fanni yangilash' : 'Fan yaratish'
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
                Yaratilgan: {subject.created_at}
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '12px',
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
                  Yordamchilar
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
                  Talabalar
                </div>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 12px',
              background: '#fef3e2',
              borderRadius: '6px',
              border: '1px solid #fed7aa'
            }}>
              <BarChart3 size={16} style={{ color: '#ea580c' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#9a3412' }}>
                  {subject.session_count || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#c2410c' }}>
                  Darslar
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
          <button
            className="btn btn-primary btn-small"
            onClick={() => onEdit(subject)}
            title="Fanni tahrirlash"
          >
            <Edit size={14} />
          </button>
          <button
            className="btn btn-danger btn-small"
            onClick={() => onDelete(subject)}
            title="Fanni o'chirish"
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
  const [subjectSessions, setSubjectSessions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch both subjects and stats in parallel
      const [subjectsRes, statsRes] = await Promise.all([
        managerAPI.getSubjects(),
        managerAPI.getStats()
      ]);
      
      // Create session count mapping from stats
      const sessionCounts = {};
      if (statsRes.data.subject_popularity) {
        statsRes.data.subject_popularity.forEach(item => {
          sessionCounts[item.subject] = item.sessions;
        });
      }
      
      // Add session counts to subjects
      const subjectsWithSessions = subjectsRes.data.map(subject => ({
        ...subject,
        session_count: sessionCounts[subject.name] || 0
      }));
      
      setSubjects(subjectsWithSessions);
      setSubjectSessions(sessionCounts);
    } catch (err) {
      setError('Fanlarni yuklashda xatolik yuz berdi');
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

  const handleCreate = async (formData) => {
    try {
      setFormLoading(true);
      await managerAPI.createSubject(formData);
      await fetchData();
      setShowCreateModal(false);
      showSuccessMessage(t('subjectCreated'));
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Fan yaratishda xatolik');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      setFormLoading(true);
      await managerAPI.updateSubject(selectedSubject.id, formData);
      await fetchData();
      setShowEditModal(false);
      setSelectedSubject(null);
      showSuccessMessage(t('subjectUpdated'));
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Fan yangilashda xatolik');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await managerAPI.deleteSubject(selectedSubject.id);
      await fetchData();
      setSelectedSubject(null);
      showSuccessMessage(t('subjectDeleted'));
    } catch (err) {
      showErrorMessage(err.response?.data?.detail || 'Fan o\'chirishda xatolik');
    }
  };

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
        Fanlar yuklanmoqda...
      </div>
    );
  }

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <h2 className="card-title">{t('subjectsManagement')}</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} style={{ marginRight: '8px' }} />
          {t('addNewSubject')}
        </button>
      </div>

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
              {t('noSubjectsFound')}
            </h3>
            <p style={{ margin: '0 0 24px' }}>
              Birinchi fanni yaratish bilan boshlang.
            </p>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <Plus size={16} style={{ marginRight: '8px' }} />
              {t('createFirstSubject')}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', 
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

      <Modal
        isOpen={showCreateModal}
        onClose={closeAllModals}
        title={t('createNewSubject')}
        size="small"
      >
        <SubjectForm
          onSubmit={handleCreate}
          onCancel={closeAllModals}
          loading={formLoading}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={closeAllModals}
        title={t('editSubject')}
        size="small"
      >
        <SubjectForm
          subject={selectedSubject}
          onSubmit={handleUpdate}
          onCancel={closeAllModals}
          loading={formLoading}
        />
      </Modal>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={closeAllModals}
        onConfirm={handleDelete}
        title={t('deleteSubject')}
        message={
          selectedSubject?.assistant_count > 0 || selectedSubject?.student_count > 0
            ? `"${selectedSubject?.name}" fanini o'chirib bo'lmaydi chunki unga ${selectedSubject?.assistant_count} yordamchi va ${selectedSubject?.student_count} talaba biriktirilgan. Avval ularni boshqa fanga o'tkazing.`
            : `Rostdan ham "${selectedSubject?.name}" fanini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`
        }
        confirmText="O'chirish"
        type="danger"
      />

      {/* Stats Summary */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h3 className="card-title" style={{ marginBottom: '20px' }}>
          {t('subjectsSummary')}
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
              Jami fanlar
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
              Jami yordamchilar
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
              Jami talabalar
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#ea580c',
              marginBottom: '4px'
            }}>
              {subjects.reduce((sum, s) => sum + (s.session_count || 0), 0)}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Jami darslar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;