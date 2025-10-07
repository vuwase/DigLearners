import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import { getChildrenOverviewData } from '../../services/parentMockDataService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const ChildrenOverview = () => {
  const { t, currentLanguage } = useTranslation();
  const data = getChildrenOverviewData();
  const [selectedChild, setSelectedChild] = useState(data.children[0].id);

  const currentChild = data.children.find(child => child.id === selectedChild);

  return (
    <div className="dashboard-container">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Abana Banyu' 
                : 'Children Overview'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Reba imikurire y\'abana banyu n\'ibikorwa byabo'
                : 'Monitor your children\'s progress and activities'
              }
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Icon name="child" size={24} />
            </div>
            <div className="stat-content">
              <h3>{data.overview.totalChildren}</h3>
              <p>
                {currentLanguage === 'rw' ? 'Abana' : 'Children'}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Icon name="book" size={24} />
            </div>
            <div className="stat-content">
              <h3>{data.overview.totalLessonsCompleted}</h3>
              <p>
                {currentLanguage === 'rw' ? 'Amahugurwa Yarangije' : 'Lessons Completed'}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Icon name="achievement" size={24} />
            </div>
            <div className="stat-content">
              <h3>{data.overview.totalBadges}</h3>
              <p>
                {currentLanguage === 'rw' ? 'Ibyubahiro' : 'Total Badges'}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Icon name="clock" size={24} />
            </div>
            <div className="stat-content">
              <h3>{data.overview.totalLearningTime}</h3>
              <p>
                {currentLanguage === 'rw' ? 'Igihe cy\'Kwiga' : 'Learning Time'}
              </p>
            </div>
          </div>
        </div>

        {/* Child Selector */}
        <div className="child-selector">
          <h3>
            {currentLanguage === 'rw' ? 'Hitamo Umwana' : 'Select Child'}
          </h3>
          <div className="child-tabs">
            {data.children.map((child) => (
              <button
                key={child.id}
                className={`child-tab ${selectedChild === child.id ? 'active' : ''}`}
                onClick={() => setSelectedChild(child.id)}
              >
                <span className="child-avatar">{child.avatar}</span>
                <div className="child-info">
                  <span className="child-name">{child.name}</span>
                  <span className="child-grade">{child.grade}</span>
                </div>
                <div className="child-stats">
                  <span>{child.progress}% {currentLanguage === 'rw' ? 'imikurire' : 'progress'}</span>
                  <span>{child.badges} {currentLanguage === 'rw' ? 'ibyubahiro' : 'badges'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Child Details */}
        {currentChild && (
          <div className="child-details">
            <div className="child-detail-header">
              <div className="child-info">
                <div className="child-avatar-large">{currentChild.avatar}</div>
                <div>
                  <h2>{currentChild.name}</h2>
                  <p>{currentChild.grade} • {currentChild.age} {currentLanguage === 'rw' ? 'imyaka' : 'years old'}</p>
                  <p>
                    {currentLanguage === 'rw' ? 'Ikorwa ryanyuma:' : 'Last active:'} {currentChild.lastActive}
                  </p>
                </div>
              </div>
              <div className="child-overview">
                <div className="overview-stat">
                  <span className="stat-number">{currentChild.progress}%</span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Imikurire' : 'Progress'}
                  </span>
                </div>
                <div className="overview-stat">
                  <span className="stat-number">{currentChild.badges}</span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Ibyubahiro' : 'Badges'}
                  </span>
                </div>
                <div className="overview-stat">
                  <span className="stat-number">{currentChild.points}</span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Amatike' : 'Points'}
                  </span>
                </div>
              </div>
            </div>

            <div className="child-sections">
              <div className="strengths-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Ubushobozi' : 'Strengths'}
                </h3>
                <ul>
                  {currentChild.strengths.map((strength, index) => (
                    <li key={index}>
                      <Icon name="check" size={16} style={{ marginRight: '8px' }} />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="improvements-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Aho Gukura' : 'Areas for Improvement'}
                </h3>
                <ul>
                  {currentChild.areasForImprovement.map((area, index) => (
                    <li key={index}>
                      <Icon name="progress" size={16} style={{ marginRight: '8px' }} />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="recent-activity-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Ikorwa Ryihariye' : 'Recent Activity'}
                </h3>
                <div className="activity-list">
                  {currentChild.recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        <Icon 
                          name={activity.type === 'lesson_completed' ? 'check' : 
                                activity.type === 'badge_earned' ? 'achievement' : 'book'} 
                          size={20} 
                        />
                      </div>
                      <div className="activity-content">
                        <p>{activity.title}</p>
                        <span className="activity-time">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {activity.points > 0 && (
                        <div className="activity-points">+{activity.points} pts</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Children Grid */}
        <div className="children-grid">
          <h3>
            {currentLanguage === 'rw' ? 'Abana Byose' : 'All Children'}
          </h3>
          <div className="dashboard-grid">
            {data.children.map((child) => (
              <div key={child.id} className="child-card">
                <div className="child-header">
                  <div className="child-avatar">{child.avatar}</div>
                  <div className="child-info">
                    <h3>{child.name}</h3>
                    <p>{child.grade} • {child.age} {currentLanguage === 'rw' ? 'imyaka' : 'years old'}</p>
                  </div>
                  <div className="child-progress">
                    <div className="progress-circle">
                      <span>{child.progress}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="child-stats">
                  <div className="stat-item">
                    <span className="stat-label">
                      {currentLanguage === 'rw' ? 'Amahugurwa:' : 'LESSONS:'}
                    </span>
                    <span className="stat-value">{child.completedLessons}/{child.totalLessons} {currentLanguage === 'rw' ? 'yarangije' : 'completed'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">
                      {currentLanguage === 'rw' ? 'Ibyubahiro:' : 'BADGES:'}
                    </span>
                    <span className="stat-value">
                      {child.badges} 
                      <Icon name="achievement" size={16} style={{ marginLeft: '4px' }} />
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">
                      {currentLanguage === 'rw' ? 'Amatike:' : 'POINTS:'}
                    </span>
                    <span className="stat-value">
                      {child.points} 
                      <Icon name="star" size={16} style={{ marginLeft: '4px' }} />
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">
                      {currentLanguage === 'rw' ? 'Imikurire:' : 'PROGRESS:'}
                    </span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${child.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="child-activity">
                  <h4>
                    {currentLanguage === 'rw' ? 'Ikorwa Ryihariye' : 'Recent Activity'}
                  </h4>
                  <div className="activity-list">
                    {child.recentActivity.slice(0, 2).map((activity) => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">
                          <Icon 
                            name={activity.type === 'lesson_completed' ? 'check' : 
                                  activity.type === 'badge_earned' ? 'achievement' : 'book'} 
                            size={16} 
                          />
                        </div>
                        <div className="activity-content">
                          <p>{activity.title}</p>
                          <span className="activity-time">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="recent-activity">
          <h2>
            {currentLanguage === 'rw' ? 'Ikorwa Ryihariye' : 'Recent Activity'}
          </h2>
          <div className="activity-list">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  <Icon 
                    name={activity.type === 'lesson_completed' ? 'check' : 
                          activity.type === 'badge_earned' ? 'achievement' : 'book'} 
                    size={20} 
                  />
                </div>
                <div className="activity-content">
                  <p>
                    <strong>{activity.childName}</strong> {activity.activity}
                  </p>
                  <span className="activity-time">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {activity.points > 0 && (
                  <div className="activity-points">
                    +{activity.points} pts
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildrenOverview;
