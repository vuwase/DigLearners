import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Manage the entire DigLearners platform</p>
          </div>
        </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="users" size={24} />
          </div>
          <div className="stat-content">
            <h3>245</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="student" size={24} />
          </div>
          <div className="stat-content">
            <h3>180</h3>
            <p>Active Learners</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="teacher" size={24} />
          </div>
          <div className="stat-content">
            <h3>15</h3>
            <p>Teachers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="book" size={24} />
          </div>
          <div className="stat-content">
            <h3>42</h3>
            <p>Total Lessons</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <Link to="/dashboard/users" className="dashboard-card">
          <div className="card-icon">
            <Icon name="users" size={32} />
          </div>
          <div className="card-content">
            <h3>User Management</h3>
            <p>Manage all users, roles, and permissions</p>
            <div className="card-stats">
              <span>245 total users</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/content" className="dashboard-card">
          <div className="card-icon">
            <Icon name="book" size={32} />
          </div>
          <div className="card-content">
            <h3>Content Management</h3>
            <p>Create and manage educational content</p>
            <div className="card-stats">
              <span>42 lessons available</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/analytics" className="dashboard-card">
          <div className="card-icon">
            <Icon name="analytics" size={32} />
          </div>
          <div className="card-content">
            <h3>Analytics</h3>
            <p>Platform-wide analytics and insights</p>
            <div className="card-stats">
              <span>View detailed reports</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/settings" className="dashboard-card">
          <div className="card-icon">
            <Icon name="settings" size={32} />
          </div>
          <div className="card-content">
            <h3>System Settings</h3>
            <p>Configure platform settings and preferences</p>
            <div className="card-stats">
              <span>Manage configurations</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/reports" className="dashboard-card">
          <div className="card-icon">
            <Icon name="report" size={32} />
          </div>
          <div className="card-content">
            <h3>Reports</h3>
            <p>Generate and view system reports</p>
            <div className="card-stats">
              <span>5 new reports</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/security" className="dashboard-card">
          <div className="card-icon">🔒</div>
          <div className="card-content">
            <h3>Security</h3>
            <p>Monitor security and access logs</p>
            <div className="card-stats">
              <span>System secure</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
      </div>

      <div className="content-section">
        <h2>Platform Overview</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3>User Statistics</h3>
            <div className="stat-list">
              <div className="stat-row">
                <span className="stat-label">Learners:</span>
                <span className="stat-value">180 (73%)</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Teachers:</span>
                <span className="stat-value">15 (6%)</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Parents:</span>
                <span className="stat-value">45 (18%)</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Admins:</span>
                <span className="stat-value">5 (2%)</span>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <h3>Platform Activity</h3>
            <div className="stat-list">
              <div className="stat-row">
                <span className="stat-label">Active Today:</span>
                <span className="stat-value">142 users</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Lessons Completed:</span>
                <span className="stat-value">1,248</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Badges Awarded:</span>
                <span className="stat-value">856</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Avg Session Time:</span>
                <span className="stat-value">28 minutes</span>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <h3>System Health</h3>
            <div className="stat-list">
              <div className="stat-row">
                <span className="stat-label">Server Status:</span>
                <span className="stat-value status-good">
                  <Icon name="check" size={16} style={{ marginRight: '4px' }} />
                  Online
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Database:</span>
                <span className="stat-value status-good">
                  <Icon name="check" size={16} style={{ marginRight: '4px' }} />
                  Healthy
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Storage Used:</span>
                <span className="stat-value">45% (4.5GB/10GB)</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Last Backup:</span>
                <span className="stat-value">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent System Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <Icon name="users" size={20} />
            </div>
            <div className="activity-content">
              <p><strong>New user registered:</strong> Teacher John Smith</p>
              <span className="activity-time">30 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <Icon name="book" size={20} />
            </div>
            <div className="activity-content">
              <p><strong>Content created:</strong> New lesson "Digital Citizenship"</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <Icon name="settings" size={20} />
            </div>
            <div className="activity-content">
              <p><strong>Settings updated:</strong> Email notifications enabled</p>
              <span className="activity-time">4 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <Icon name="analytics" size={20} />
            </div>
            <div className="activity-content">
              <p><strong>Report generated:</strong> Monthly platform analytics</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;

