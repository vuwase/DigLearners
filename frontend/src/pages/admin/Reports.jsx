import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/language';
import Icon from '../../components/icons/Icon';
import adminApiService from '../../services/adminApiService';
import './AdminPages.css';

const Reports = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState({
    userReports: [],
    systemReports: [],
    scheduledReports: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('user');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getReports();
      // The API returns data in a different structure, map it properly
      if (response.success && response.data) {
        // Transform API response to match component expectations
        setReports({
          userReports: [], // API doesn't return userReports array yet
          systemReports: [], // API doesn't return systemReports array yet
          scheduledReports: [] // API doesn't return scheduledReports array yet
        });
      } else {
        // Set fallback data
        setReports({
          userReports: [],
          systemReports: [],
          scheduledReports: []
        });
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message);
      // Set fallback data
      setReports({
        userReports: [],
        systemReports: [],
        scheduledReports: []
      });
    } finally {
      setLoading(false);
    }
  };

  const reportTabs = [
    { id: 'user', label: 'User Reports', icon: 'users' },
    { id: 'system', label: 'System Reports', icon: 'analytics' },
    { id: 'scheduled', label: 'Scheduled Reports', icon: 'calendar' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'check';
      case 'generating': return 'clock';
      case 'failed': return 'close';
      default: return 'help';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'generating': return '#FF9800';
      case 'failed': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const formatFileSize = (size) => {
    if (size === 'N/A') return 'N/A';
    return size;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading Reports...</h2>
          <p>Fetching report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Reports</h2>
          <p>{error}</p>
          <button onClick={fetchReports} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>Generate and manage system reports</p>
      </div>

      {/* Report Tabs */}
      <div className="reports-tabs">
        {reportTabs.map(tab => (
          <button
            key={tab.id}
            className={`report-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon name={tab.icon} size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* User Reports */}
      {activeTab === 'user' && (
        <div className="reports-section">
          <div className="section-header">
            <h3>User Activity Reports</h3>
            <button className="btn-primary">
              <Icon name="plus" size={16} />
              Generate New Report
            </button>
          </div>
          
          <div className="reports-grid">
            {(reports.userReports || []).map(report => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div className="report-title">{report.title}</div>
                  <div className="report-actions">
                    <button className="btn-icon" title="Download">
                      <Icon name="download" size={16} />
                    </button>
                    <button className="btn-icon" title="View">
                      <Icon name="eye" size={16} />
                    </button>
                    <button className="btn-icon" title="More">
                      <Icon name="more" size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="report-meta">
                  <div className="meta-item">
                    <Icon name="calendar" size={16} />
                    <span>Generated: {new Date(report.generatedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <Icon name="clock" size={16} />
                    <span>Period: {report.period}</span>
                  </div>
                  <div className="meta-item">
                    <Icon name="file" size={16} />
                    <span>Size: {formatFileSize(report.fileSize)}</span>
                  </div>
                </div>
                
                <div className="report-status">
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(report.status) }}
                  >
                    <Icon name={getStatusIcon(report.status)} size={12} />
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Reports */}
      {activeTab === 'system' && (
        <div className="reports-section">
          <div className="section-header">
            <h3>System Performance Reports</h3>
            <button className="btn-primary">
              <Icon name="plus" size={16} />
              Generate New Report
            </button>
          </div>
          
          <div className="reports-grid">
            {(reports.systemReports || []).map(report => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div className="report-title">{report.title}</div>
                  <div className="report-actions">
                    <button className="btn-icon" title="Download">
                      <Icon name="download" size={16} />
                    </button>
                    <button className="btn-icon" title="View">
                      <Icon name="eye" size={16} />
                    </button>
                    <button className="btn-icon" title="More">
                      <Icon name="more" size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="report-meta">
                  <div className="meta-item">
                    <Icon name="calendar" size={16} />
                    <span>Generated: {new Date(report.generatedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <Icon name="clock" size={16} />
                    <span>Period: {report.period}</span>
                  </div>
                  <div className="meta-item">
                    <Icon name="file" size={16} />
                    <span>Size: {formatFileSize(report.fileSize)}</span>
                  </div>
                </div>
                
                <div className="report-status">
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(report.status) }}
                  >
                    <Icon name={getStatusIcon(report.status)} size={12} />
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Reports */}
      {activeTab === 'scheduled' && (
        <div className="reports-section">
          <div className="section-header">
            <h3>Scheduled Reports</h3>
            <button className="btn-primary">
              <Icon name="plus" size={16} />
              Create New Schedule
            </button>
          </div>
          
          <div className="scheduled-reports">
            {(reports.scheduledReports || []).map(report => (
              <div key={report.id} className="scheduled-report-card">
                <div className="scheduled-header">
                  <div className="scheduled-title">{report.title}</div>
                  <div className="scheduled-actions">
                    <button className="btn-icon" title="Edit">
                      <Icon name="edit" size={16} />
                    </button>
                    <button className="btn-icon" title="Delete">
                      <Icon name="delete" size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="scheduled-details">
                  <div className="detail-row">
                    <Icon name="clock" size={16} />
                    <span>Frequency: {report.frequency}</span>
                  </div>
                  <div className="detail-row">
                    <Icon name="calendar" size={16} />
                    <span>Next Run: {new Date(report.nextRun).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <Icon name="users" size={16} />
                    <span>Recipients: {report.recipients.length} email(s)</span>
                  </div>
                </div>
                
                <div className="scheduled-status">
                  <span className={`status-badge ${report.status}`}>
                    <Icon name={report.status === 'active' ? 'check' : 'pause'} size={12} />
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn">
            <Icon name="download" size={24} />
            <span>Export All Data</span>
          </button>
          
          <button className="action-btn">
            <Icon name="analytics" size={24} />
            <span>Generate Analytics</span>
          </button>
          
          <button className="action-btn">
            <Icon name="users" size={24} />
            <span>User Activity Report</span>
          </button>
          
          <button className="action-btn">
            <Icon name="book" size={24} />
            <span>Content Performance</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
