import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/managerAPI';

// Simple Chart Components
const BarChart = ({ data, height = 200 }) => {
  if (!data || data.length === 0) return <div>No data available</div>;
  
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div style={{ height, display: 'flex', alignItems: 'end', gap: '8px', padding: '20px 0' }}>
      {data.map((item, index) => (
        <div key={index} style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            height: `${(item.value / maxValue) * 140}px`,
            background: `linear-gradient(135deg, #667eea ${index * 10}%, #764ba2 ${90 + index * 2}%)`,
            width: '100%',
            borderRadius: '4px 4px 0 0',
            minHeight: '20px',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              position: 'absolute',
              top: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '12px',
              fontWeight: '600',
              color: '#4a5568'
            }}>
              {item.value}
            </div>
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: '#718096', 
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ data, size = 160 }) => {
  if (!data || data.length === 0) return <div>No data available</div>;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ];

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const radius = 60;
          const strokeWidth = 20;
          const normalizedRadius = radius - strokeWidth * 0.5;
          const circumference = normalizedRadius * 2 * Math.PI;
          const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
          const rotation = currentAngle;
          
          currentAngle += angle;
          
          return (
            <circle
              key={index}
              stroke={`url(#gradient${index})`}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              style={{
                transformOrigin: '50% 50%',
                transform: `rotate(${rotation}deg)`,
              }}
              r={normalizedRadius}
              cx={size / 2}
              cy={size / 2}
            />
          );
        })}
        <defs>
          {colors.map((color, index) => (
            <linearGradient key={index} id={`gradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          ))}
        </defs>
      </svg>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>{total}</div>
        <div style={{ fontSize: '12px', color: '#718096' }}>Total</div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: colors[index % colors.length]
            }}></div>
            <span style={{ color: '#4a5568', fontWeight: '500' }}>{item.label}</span>
            <span style={{ color: '#718096', marginLeft: 'auto' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data, height = 200 }) => {
  if (!data || data.length === 0) return <div>No data available</div>;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 300;
    const y = height - 40 - ((item.value - minValue) / range) * (height - 80);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ position: 'relative' }}>
      <svg width="300" height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          points={points}
          style={{ filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))' }}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 300;
          const y = height - 40 - ((item.value - minValue) / range) * (height - 80);
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="url(#lineGradient)"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))' }}
              />
              <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#718096"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Dashboard = ({ currentUser }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      // Mock data for demo
      setStats({
        overview: {
          total_subjects: 8,
          total_assistants: 12,
          total_students: 45,
          total_sessions: 156,
          monthly_growth: 15.5,
          attendance_rate: 89.2
        },
        subject_distribution: [
          { label: 'Math', value: 15 },
          { label: 'English', value: 12 },
          { label: 'Programming', value: 10 },
          { label: 'Physics', value: 8 }
        ],
        weekly_sessions: [
          { label: 'Mon', value: 23 },
          { label: 'Tue', value: 19 },
          { label: 'Wed', value: 27 },
          { label: 'Thu', value: 21 },
          { label: 'Fri', value: 25 },
          { label: 'Sat', value: 18 },
          { label: 'Sun', value: 15 }
        ],
        monthly_trends: [
          { label: 'Jan', value: 120 },
          { label: 'Feb', value: 135 },
          { label: 'Mar', value: 145 },
          { label: 'Apr', value: 156 },
          { label: 'May', value: 142 },
          { label: 'Jun', value: 159 }
        ],
        top_assistants: [
          { name: 'Ali Karimov', sessions: 45, rating: 4.8, subject: 'Mathematics' },
          { name: 'Malika Tosheva', sessions: 42, rating: 4.9, subject: 'English' },
          { name: 'Bekzod Umarov', sessions: 38, rating: 4.7, subject: 'Programming' }
        ],
        recent_activities: [
          { time: '2 hours ago', action: 'New student registered', user: 'Sardor Rahimov' },
          { time: '4 hours ago', action: 'Session completed', user: 'Mathematics - Grade 10' },
          { time: '6 hours ago', action: 'Assistant joined', user: 'Nodira Kholmatova' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#2d3748', 
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Welcome back, {currentUser?.fullname}! 👋
        </h1>
        <p style={{ color: '#718096', fontSize: '16px' }}>
          Here's what's happening in your learning center today
        </p>
      </div>

      {error && <div className="alert alert-warning">{error} (Showing demo data)</div>}

      {/* Main Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats?.overview?.total_subjects || 0}</div>
          <div className="stat-label">Active Subjects</div>
          <div className="stat-change positive">
            <span>↗</span> +2 this month
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.overview?.total_assistants || 0}</div>
          <div className="stat-label">Assistants</div>
          <div className="stat-change positive">
            <span>↗</span> +3 this month
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.overview?.total_students || 0}</div>
          <div className="stat-label">Students</div>
          <div className="stat-change positive">
            <span>↗</span> +{stats?.overview?.monthly_growth || 0}% growth
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.overview?.total_sessions || 0}</div>
          <div className="stat-label">Total Sessions</div>
          <div className="stat-change positive">
            <span>↗</span> {stats?.overview?.attendance_rate || 0}% attendance
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Subject Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Subject Distribution</div>
            <div className="chart-subtitle">Students enrolled by subject</div>
          </div>
          <DonutChart data={stats?.subject_distribution || []} />
        </div>

        {/* Weekly Sessions */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Weekly Sessions</div>
            <div className="chart-subtitle">Sessions this week</div>
          </div>
          <BarChart data={stats?.weekly_sessions || []} />
        </div>

        {/* Monthly Trends */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Monthly Trends</div>
            <div className="chart-subtitle">Session growth over time</div>
          </div>
          <LineChart data={stats?.monthly_trends || []} />
        </div>

        {/* Top Assistants */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Top Performing Assistants</div>
            <div className="chart-subtitle">This month's leaders</div>
          </div>
          <div style={{ space: '16px' }}>
            {(stats?.top_assistants || []).map((assistant, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: index < stats.top_assistants.length - 1 ? '1px solid #e2e8f0' : 'none'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#2d3748' }}>{assistant.name}</div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>{assistant.subject}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', color: '#667eea' }}>{assistant.sessions} sessions</div>
                  <div style={{ fontSize: '12px', color: '#38a169' }}>⭐ {assistant.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Activities</h3>
          <span style={{ fontSize: '14px', color: '#718096' }}>Last 24 hours</span>
        </div>
        <div>
          {(stats?.recent_activities || []).map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 0',
              borderBottom: index < stats.recent_activities.length - 1 ? '1px solid #e2e8f0' : 'none'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px'
              }}>
                {activity.action.includes('student') ? '👨‍🎓' : 
                 activity.action.includes('Session') ? '📚' : '👨‍🏫'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', color: '#2d3748' }}>{activity.action}</div>
                <div style={{ fontSize: '14px', color: '#718096' }}>{activity.user}</div>
              </div>
              <div style={{ fontSize: '12px', color: '#a0aec0' }}>{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;