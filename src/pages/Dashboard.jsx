import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import StatsCard from '../components/StatsCard';
import { 
  MonthlyTrendsChart, 
  SubjectPopularityChart, 
  PeakHoursChart, 
  TopAssistantsList 
} from '../components/Charts';
import { Users, GraduationCap, BookOpen, Star } from 'lucide-react';
import { createStats } from '../types';
import { t } from '../types/translations';

const Dashboard = () => {
  const [stats, setStats] = useState(createStats());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await managerAPI.getStats();
      setStats(createStats(response.data));
    } catch (err) {
      setError('Statistikalarni yuklashda xatolik yuz berdi');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Bosh sahifa yuklanmoqda...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="alert alert-error" style={{ display: 'inline-block' }}>
          {error}
        </div>
        <div style={{ marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={fetchStats}>
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Overview */}
      <div className="stats-grid">
        <StatsCard
          title={t('totalAssistants')}
          value={stats.overview.total_assistants}
          variant="primary"
          icon={<Users size={24} />}
        />
        <StatsCard
          title={t('totalStudents')}
          value={stats.overview.total_students}
          variant="success"
          icon={<GraduationCap size={24} />}
        />
        <StatsCard
          title={t('totalSessions')}
          value={stats.overview.total_sessions}
          variant="warning"
          icon={<BookOpen size={24} />}
        />
        <StatsCard
          title={t('averageRating')}
          value={stats.overview.avg_rating.toFixed(1)}
          variant="info"
          icon={<Star size={24} />}
        />
      </div>

      {/* Additional Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <StatsCard
          title={t('sessionsThisMonth')}
          value={stats.overview.sessions_this_month}
          variant="primary"
        />
        <StatsCard
          title={t('totalSubjects')}
          value={stats.overview.total_subjects}
          variant="success"
        />
        <StatsCard
          title={t('attendanceRate')}
          value={`${stats.overview.attendance_rate}%`}
          variant="info"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="card-title" style={{ marginBottom: '20px' }}>
            {t('monthlyTrends')}
          </h3>
          {stats.monthly_trends.length > 0 ? (
            <MonthlyTrendsChart data={stats.monthly_trends} />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6b7280' 
            }}>
              {t('noDataAvailable')}
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3 className="card-title" style={{ marginBottom: '20px' }}>
            {t('subjectPopularity')}
          </h3>
          {stats.subject_popularity.length > 0 ? (
            <SubjectPopularityChart data={stats.subject_popularity} />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6b7280' 
            }}>
              {t('noDataAvailable')}
            </div>
          )}
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="card-title" style={{ marginBottom: '20px' }}>
            {t('peakHours')}
          </h3>
          {stats.peak_hours.length > 0 ? (
            <PeakHoursChart data={stats.peak_hours} />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6b7280' 
            }}>
              {t('noDataAvailable')}
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3 className="card-title" style={{ marginBottom: '20px' }}>
            {t('topAssistants')}
          </h3>
          <TopAssistantsList data={stats.top_assistants} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('quickActions')}</h3>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          <button 
            className="btn btn-primary"
            style={{ 
              padding: '16px 20px', 
              textAlign: 'left',
              border: '1px solid #e5e7eb',
              background: 'white',
              color: '#374151'
            }}
          >
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>
              {t('manageAssistants')}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Yordamchi hisoblarini qo'shish, tahrirlash yoki o'chirish
            </div>
          </button>

          <button 
            className="btn btn-primary"
            style={{ 
              padding: '16px 20px', 
              textAlign: 'left',
              border: '1px solid #e5e7eb',
              background: 'white',
              color: '#374171'
            }}
          >
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>
              {t('manageStudents')}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Talaba hisoblarini qo'shish, tahrirlash yoki o'chirish
            </div>
          </button>

          <button 
            className="btn btn-primary"
            style={{ 
              padding: '16px 20px', 
              textAlign: 'left',
              border: '1px solid #e5e7eb',
              background: 'white',
              color: '#374151'
            }}
          >
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>
              {t('manageSubjects')}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Fanlarni qo'shish, tahrirlash yoki o'chirish
            </div>
          </button>

          <button 
            className="btn btn-primary"
            style={{ 
              padding: '16px 20px', 
              textAlign: 'left',
              border: '1px solid #e5e7eb',
              background: 'white',
              color: '#374151'
            }}
          >
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>
              {t('viewReports')}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Batafsil hisobotlar yaratish
            </div>
          </button>
        </div>
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={fetchStats}
          disabled={loading}
        >
          {loading ? t('refreshing') : t('refreshData')}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;