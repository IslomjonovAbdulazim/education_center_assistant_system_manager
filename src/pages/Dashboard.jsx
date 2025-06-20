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
      setError(err.response?.data?.detail || 'Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading dashboard...
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
            Try Again
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
          title="Total Assistants"
          value={stats.overview.total_assistants}
          variant="primary"
          icon={<Users size={24} />}
        />
        <StatsCard
          title="Total Students"
          value={stats.overview.total_students}
          variant="success"
          icon={<GraduationCap size={24} />}
        />
        <StatsCard
          title="Total Sessions"
          value={stats.overview.total_sessions}
          variant="warning"
          icon={<BookOpen size={24} />}
        />
        <StatsCard
          title="Average Rating"
          value={stats.overview.avg_rating.toFixed(1)}
          variant="info"
          icon={<Star size={24} />}
        />
      </div>

      {/* Additional Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <StatsCard
          title="Sessions This Month"
          value={stats.overview.sessions_this_month}
          variant="primary"
        />
        <StatsCard
          title="Total Subjects"
          value={stats.overview.total_subjects}
          variant="success"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${stats.overview.attendance_rate}%`}
          variant="info"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="card-title" style={{ marginBottom: '20px' }}>
            Monthly Session Trends
          </h3>
          {stats.monthly_trends.length > 0 ? (
            <MonthlyTrendsChart data={stats.monthly_trends} />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6b7280' 
            }}>
              No trend data available
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3 className="card-title" style={{ marginBottom: '20px' }}>
            Subject Popularity
          </h3>
          {stats.subject_popularity.length > 0 ? (
            <SubjectPopularityChart data={stats.subject_popularity} />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6b7280' 
            }}>
              No subject data available
            </div>
          )}
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="card-title" style={{ marginBottom: '20px' }}>
            Peak Hours Analysis
          </h3>
          {stats.peak_hours.length > 0 ? (
            <PeakHoursChart data={stats.peak_hours} />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6b7280' 
            }}>
              No peak hours data available
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3 className="card-title" style={{ marginBottom: '20px' }}>
            Top Performing Assistants
          </h3>
          <TopAssistantsList data={stats.top_assistants} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
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
              Manage Assistants
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Add, edit, or remove assistant accounts
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
              Manage Students
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Add, edit, or remove student accounts
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
              Manage Subjects
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Add, edit, or remove subjects
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
              View Reports
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Generate detailed reports
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
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;