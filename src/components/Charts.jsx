import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Monthly Trends Chart
export const MonthlyTrendsChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Sessions',
        data: data.map(item => item.sessions),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

// Subject Popularity Chart
export const SubjectPopularityChart = ({ data }) => {
  const colors = [
    '#667eea',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#06b6d4',
    '#8b5cf6',
    '#f97316',
    '#84cc16'
  ];

  const chartData = {
    labels: data.map(item => item.subject),
    datasets: [
      {
        data: data.map(item => item.sessions),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

// Peak Hours Chart
export const PeakHoursChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.hour),
    datasets: [
      {
        label: 'Sessions',
        data: data.map(item => item.sessions),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: '#667eea',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

// Top Assistants List
export const TopAssistantsList = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#6b7280' 
      }}>
        No data available
      </div>
    );
  }

  return (
    <div style={{ height: '300px', overflowY: 'auto' }}>
      {data.map((assistant, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: index === 0 ? '#f8fafc' : 'transparent'
          }}
        >
          <div>
            <div style={{ fontWeight: '500', color: '#1e293b' }}>
              {assistant.name}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {assistant.sessions} sessions
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#667eea' 
            }}>
              {assistant.rating}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#f59e0b' 
            }}>
              {'★'.repeat(Math.floor(assistant.rating))}
              {'☆'.repeat(5 - Math.floor(assistant.rating))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Default export with all charts
const Charts = {
  MonthlyTrendsChart,
  SubjectPopularityChart,
  PeakHoursChart,
  TopAssistantsList
};

export default Charts;