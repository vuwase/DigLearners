import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const TeacherDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Teacher Dashboard</h1>
            <p>Welcome back! Here's an overview of your teaching activities</p>
          </div>
        </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="school" size={24} />
          </div>
          <div className="stat-content">
            <h3>3</h3>
            <p>Active Classes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="student" size={24} />
          </div>
          <div className="stat-content">
            <h3>95</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="book" size={24} />
          </div>
          <div className="stat-content">
            <h3>24</h3>
            <p>Lessons Assigned</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="progress" size={24} />
          </div>
          <div className="stat-content">
            <h3>87%</h3>
            <p>Avg Progress</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <Link to="/dashboard/classes" className="dashboard-card">
          <div className="card-icon">
            <Icon name="school" size={32} />
          </div>
          <div className="card-content">
            <h3>My Classes</h3>
            <p>Manage your learning classes and assignments</p>
            <div className="card-stats">
              <span>3 classes • 95 students</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/students" className="dashboard-card">
          <div className="card-icon">
            <Icon name="student" size={32} />
          </div>
          <div className="card-content">
            <h3>Students</h3>
            <p>View student progress and performance</p>
            <div className="card-stats">
              <span>87% average progress</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/lessons" className="dashboard-card">
          <div className="card-icon">
            <Icon name="book" size={32} />
          </div>
          <div className="card-content">
            <h3>Lessons</h3>
            <p>Create and assign educational content</p>
            <div className="card-stats">
              <span>24 lessons assigned</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/assignments" className="dashboard-card">
          <div className="card-icon">
            <Icon name="assignment" size={32} />
          </div>
          <div className="card-content">
            <h3>Assignments</h3>
            <p>Track assignment completion and grades</p>
            <div className="card-stats">
              <span>15 pending reviews</span>
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
            <p>View detailed performance analytics</p>
            <div className="card-stats">
              <span>Weekly reports available</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/schedule" className="dashboard-card">
          <div className="card-icon">
            <Icon name="calendar" size={24} />
          </div>
          <div className="card-content">
            <h3>Schedule</h3>
            <p>Manage your teaching schedule and deadlines</p>
            <div className="card-stats">
              <span>5 upcoming deadlines</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <Icon name="book" size={20} />
            </div>
            <div className="activity-content">
              <p><strong>New lesson assigned:</strong> Introduction to Programming - Class B</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <Icon name="student" size={20} />
            </div>
            <div className="activity-content">
              <p><strong>Student completed:</strong> Alice Uwimana finished "Safe Internet Browsing"</p>
              <span className="activity-time">4 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <Icon name="achievement" size={20} />
            </div>
            <div className="activity-content">
              <p><strong>Badge earned:</strong> Jean Baptiste earned "Fast Learner" badge</p>
              <span className="activity-time">6 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <Icon name="analytics" size={20} />
            </div>
            <div className="activity-content">
              <p><strong>Weekly report generated</strong> for Class A</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TeacherDashboard;

