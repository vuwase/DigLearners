import React from 'react';
import { Link } from 'react-router-dom';

const LearnerDashboard = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1>My Learning Dashboard</h1>
          <p>Welcome back! Continue your digital learning journey</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>12</h3>
            <p>Lessons Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>5</h3>
            <p>Badges Earned</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>850</h3>
            <p>Total Points</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Level 3</h3>
            <p>Current Level</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <Link to="/dashboard/lessons" className="dashboard-card">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h3>My Lessons</h3>
            <p>Continue your learning activities</p>
            <div className="card-stats">
              <span>12 completed • 3 in progress</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/progress" className="dashboard-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>My Progress</h3>
            <p>Track your learning achievements</p>
            <div className="card-stats">
              <span>80% completion rate</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/badges" className="dashboard-card">
          <div className="card-icon">🏆</div>
          <div className="card-content">
            <h3>Badges</h3>
            <p>View all your earned badges</p>
            <div className="card-stats">
              <span>5 badges earned</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/assignments" className="dashboard-card">
          <div className="card-icon">📝</div>
          <div className="card-content">
            <h3>Assignments</h3>
            <p>Check your pending assignments</p>
            <div className="card-stats">
              <span>2 pending</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/leaderboard" className="dashboard-card">
          <div className="card-icon">🥇</div>
          <div className="card-content">
            <h3>Leaderboard</h3>
            <p>See where you rank among peers</p>
            <div className="card-stats">
              <span>Rank #8 in your class</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/achievements" className="dashboard-card">
          <div className="card-icon">⭐</div>
          <div className="card-content">
            <h3>Achievements</h3>
            <p>View all your accomplishments</p>
            <div className="card-stats">
              <span>850 total points</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p><strong>Lesson completed:</strong> Introduction to Programming</p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🏆</div>
            <div className="activity-content">
              <p><strong>Badge earned:</strong> Fast Learner badge</p>
              <span className="activity-time">3 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">⭐</div>
            <div className="activity-content">
              <p><strong>Points earned:</strong> 50 points from typing lesson</p>
              <span className="activity-time">5 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📚</div>
            <div className="activity-content">
              <p><strong>New lesson available:</strong> Safe Internet Browsing</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;

