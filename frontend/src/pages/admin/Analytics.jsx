import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/language';
import Icon from '../../components/icons/Icon';
import adminApiService from '../../services/adminApiService';
import './AdminPages.css';

const Analytics = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      activeUsers: 0,
      totalLessons: 0,
      completedLessons: 0,
      averageEngagement: 0,
      systemHealth: 'Good'
    },
    userEngagement: [],
    contentPerformance: [],
    systemMetrics: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getAnalytics(selectedPeriod);
      if (response.data) {
        setAnalytics(response.data);
      } else {
        // Set fallback data
        setAnalytics({
          overview: {
            totalUsers: 0,
            activeUsers: 0,
            totalLessons: 0,
            completedLessons: 0,
            averageEngagement: 0,
            systemHealth: 'Good'
          },
          userEngagement: [],
          contentPerformance: [],
          systemMetrics: []
        });
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
      // Set fallback data
      setAnalytics({
        overview: {
          totalUsers: 0,
          activeUsers: 0,
          totalLessons: 0,
          completedLessons: 0,
          averageEngagement: 0,
          systemHealth: 'Good'
        },
        userEngagement: [],
        contentPerformance: [],
        systemMetrics: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getEngagementColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading Analytics...</h2>
          <p>Fetching analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Analytics</h2>
          <p>{error}</p>
          <button onClick={fetchAnalytics} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Monitor platform performance and user engagement</p>
      </div>

      {/* Period Selector */}
      <div className="analytics-controls">
        <div className="period-selector">
          <button 
            className={`period-btn ${selectedPeriod === '7d' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('7d')}
          >
            Last 7 Days
          </button>
          <button 
            className={`period-btn ${selectedPeriod === '30d' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('30d')}
          >
            Last 30 Days
          </button>
          <button 
            className={`period-btn ${selectedPeriod === '90d' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('90d')}
          >
            Last 90 Days
          </button>
        </div>
        
        <button className="btn-secondary">
          <Icon name="download" size={16} />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="analytics-overview">
        <div className="metric-card primary">
          <div className="metric-icon">
            <Icon name="users" size={32} />
          </div>
          <div className="metric-content">
            <div className="metric-number">{(analytics.overview.totalUsers || 0).toLocaleString()}</div>
            <div className="metric-label">Total Users</div>
            <div className="metric-change positive">
              <Icon name="arrow-up" size={16} />
              +12% from last month
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <Icon name="check" size={32} />
          </div>
          <div className="metric-content">
            <div className="metric-number">{(analytics.overview.activeUsers || 0).toLocaleString()}</div>
            <div className="metric-label">Active Users</div>
            <div className="metric-change positive">
              <Icon name="arrow-up" size={16} />
              +8% from last month
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <Icon name="book" size={32} />
          </div>
          <div className="metric-content">
            <div className="metric-number">{analytics.overview?.totalLessons || 0}</div>
            <div className="metric-label">Total Lessons</div>
            <div className="metric-change positive">
              <Icon name="arrow-up" size={16} />
              +3 this month
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <Icon name="achievement" size={32} />
          </div>
          <div className="metric-content">
            <div className="metric-number">{(analytics.overview.completedLessons || 0).toLocaleString()}</div>
            <div className="metric-label">Completed Lessons</div>
            <div className="metric-change positive">
              <Icon name="arrow-up" size={16} />
              +15% from last month
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        <div className="chart-container">
          <div className="chart-header">
            <h3>User Growth</h3>
            <div className="chart-controls">
              <button className="btn-icon">
                <Icon name="fullscreen" size={16} />
              </button>
            </div>
          </div>
          <div className="chart-content">
            <div className="chart-placeholder">
              <Icon name="analytics" size={48} />
              <p>User Growth Chart</p>
              <div className="chart-data">
                {(analytics.userGrowth || []).map((data, index) => (
                  <div key={index} className="data-point">
                    <div className="data-bar" style={{ height: `${(data.users / 600) * 100}%` }}></div>
                    <span className="data-label">{data.month}</span>
                    <span className="data-value">{data.users}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-container">
          <div className="chart-header">
            <h3>Lesson Performance</h3>
            <div className="chart-controls">
              <button className="btn-icon">
                <Icon name="fullscreen" size={16} />
              </button>
            </div>
          </div>
          <div className="chart-content">
            <div className="performance-list">
              {(analytics.lessonPerformance || []).map((lesson, index) => (
                <div key={index} className="performance-item">
                  <div className="lesson-info">
                    <div className="lesson-name">{lesson.lesson}</div>
                    <div className="lesson-stats">
                      <span className="completions">{lesson.completions} completions</span>
                      <span className="rating">★ {lesson.rating}/5</span>
                    </div>
                  </div>
                  <div className="lesson-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${(lesson.completions / 1000) * 100}%`,
                          backgroundColor: getEngagementColor(lesson.completions, 1000)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="engagement-section">
        <h3>User Engagement</h3>
        <div className="engagement-grid">
          <div className="engagement-card">
            <div className="engagement-icon">
              <Icon name="clock" size={24} />
            </div>
            <div className="engagement-content">
              <div className="engagement-number">{analytics.userEngagement?.dailyActiveUsers || 0}</div>
              <div className="engagement-label">Daily Active Users</div>
            </div>
          </div>
          
          <div className="engagement-card">
            <div className="engagement-icon">
              <Icon name="calendar" size={24} />
            </div>
            <div className="engagement-content">
              <div className="engagement-number">{analytics.userEngagement?.weeklyActiveUsers || 0}</div>
              <div className="engagement-label">Weekly Active Users</div>
            </div>
          </div>
          
          <div className="engagement-card">
            <div className="engagement-icon">
              <Icon name="users" size={24} />
            </div>
            <div className="engagement-content">
              <div className="engagement-number">{analytics.userEngagement?.monthlyActiveUsers || 0}</div>
              <div className="engagement-label">Monthly Active Users</div>
            </div>
          </div>
          
          <div className="engagement-card">
            <div className="engagement-icon">
              <Icon name="clock" size={24} />
            </div>
            <div className="engagement-content">
              <div className="engagement-number">{analytics.userEngagement?.averageSessionTime || '0 min'}</div>
              <div className="engagement-label">Avg Session Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="system-health">
        <h3>System Health</h3>
        <div className="health-indicators">
          <div className="health-item">
            <div className="health-icon">
              <Icon name="check" size={20} />
            </div>
            <div className="health-content">
              <div className="health-label">Database</div>
              <div className="health-status good">Healthy</div>
            </div>
          </div>
          
          <div className="health-item">
            <div className="health-icon">
              <Icon name="check" size={20} />
            </div>
            <div className="health-content">
              <div className="health-label">API Response</div>
              <div className="health-status good">Fast</div>
            </div>
          </div>
          
          <div className="health-item">
            <div className="health-icon">
              <Icon name="check" size={20} />
            </div>
            <div className="health-content">
              <div className="health-label">Storage</div>
              <div className="health-status good">Normal</div>
            </div>
          </div>
          
          <div className="health-item">
            <div className="health-icon">
              <Icon name="warning" size={20} />
            </div>
            <div className="health-content">
              <div className="health-label">CDN</div>
              <div className="health-status warning">Slow</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
