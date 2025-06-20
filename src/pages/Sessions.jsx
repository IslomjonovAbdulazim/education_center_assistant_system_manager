import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import Card from '../components/common/Card';

const Sessions = ({ currentUser }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    subject: 'all',
    assistant: 'all',
    date_range: 'week'
  });

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getSessions(filters);
      setSessions(response.data);
    } catch (err) {
      setError('Failed to fetch sessions');
      // Mock data
      setSessions([
        {
          id: 1,
          student_name: 'Sardor Rahimov',
          assistant_name: 'Ali Karimov',
          subject: 'Mathematics',
          date: '2024-06-20',
          time: '14:00',
          status: 'completed',
          attendance: 'present',
          rating: 4.8,
          duration: 60
        },
        {
          id: 2,
          student_name: 'Nodira Kholmatova',
          assistant_name: 'Malika Tosheva',
          subject: 'English',
          date: '2024-06-20',
          time: '15:00',
          status: 'booked',
          attendance: null,
          rating: null,
          duration: 60
        },
        {
          id: 3,
          student_name: 'Bekzod Umarov',
          assistant_name: 'Ali Karimov',
          subject: 'Programming',
          date: '2024-06-19',
          time: '16:00',
          status: 'completed',
          attendance: 'present',
          rating: 4.9,
          duration: 90
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#38a169';
      case 'booked': return '#4facfe';
      case 'cancelled': return '#e53e3e';
      default: return '#718096';
    }
  };

  const columns = [
    {
      key: 'student_name',
      title: 'Student',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {value.charAt(0)}
          </div>
          <span style={{ fontWeight: '500' }}>{value}</span>
        </div>
      )
    },
    {
      key: 'assistant_name',
      title: 'Assistant',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {value.charAt(0)}
          </div>
          <span style={{ fontWeight: '500' }}>{value}</span>
        </div>
      )
    },
    {
      key: 'subject',
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
      key: 'date',
      title: 'Date & Time',
      render: (value, item) => (
        <div>
          <div style={{ fontWeight: '500', fontSize: '14px' }}>
            {new Date(value).toLocaleDateString()}
          </div>
          <div style={{ fontSize: '12px', color: '#718096' }}>
            {item.time} ({item.duration}min)
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value, item) => (
        <div>
          <span style={{
            color: getStatusColor(value),
            fontWeight: '500',
            fontSize: '12px',
            textTransform: 'capitalize'
          }}>
            {value === 'completed' ? '✅ Completed' :
             value === 'booked' ? '📅 Booked' :
             value === 'cancelled' ? '❌ Cancelled' : value}
          </span>
          {item.attendance && (
            <div style={{ fontSize: '10px', color: '#718096', marginTop: '2px' }}>
              {item.attendance === 'present' ? '👤 Present' : '❌ Absent'}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'rating',
      title: 'Rating',
      render: (value) => (
        value ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>⭐</span>
            <span style={{ fontWeight: '500' }}>{value}</span>
          </div>
        ) : (
          <span style={{ color: '#a0aec0', fontSize: '12px' }}>No rating</span>
        )
      )
    }
  ];

  const stats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'completed').length,
    upcoming: sessions.filter(s => s.status === 'booked').length,
    attendance_rate: sessions.length > 0 ? 
      Math.round((sessions.filter(s => s.attendance === 'present').length / sessions.filter(s => s.attendance).length) * 100) || 0 : 0
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
          📅 Sessions Overview
        </h1>
        <p style={{ color: '#718096', fontSize: '16px' }}>
          Monitor all sessions in your learning center
        </p>
      </div>

      {error && <div className="alert alert-warning">{error} (Showing demo data)</div>}

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.upcoming}</div>
          <div className="stat-label">Upcoming</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.attendance_rate}%</div>
          <div className="stat-label">Attendance Rate</div>
        </div>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          alignItems: 'end'
        }}>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={[
              { value: 'all', label: 'All Sessions' },
              { value: 'completed', label: 'Completed' },
              { value: 'booked', label: 'Upcoming' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
            icon="📊"
          />
          <Select
            label="Subject"
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            options={[
              { value: 'all', label: 'All Subjects' },
              { value: 'mathematics', label: 'Mathematics' },
              { value: 'english', label: 'English' },
              { value: 'programming', label: 'Programming' }
            ]}
            icon="📚"
          />
          <Select
            label="Time Range"
            value={filters.date_range}
            onChange={(e) => handleFilterChange('date_range', e.target.value)}
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'all', label: 'All Time' }
            ]}
            icon="📅"
          />
          <Button
            variant="secondary"
            onClick={() => setFilters({ status: 'all', subject: 'all', assistant: 'all', date_range: 'week' })}
            icon="🔄"
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Sessions Table */}
      <Card>
        <Table
          columns={columns}
          data={sessions}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default Sessions;