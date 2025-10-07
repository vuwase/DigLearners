import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import { getProgressReportsData } from '../../services/parentMockDataService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const ProgressReports = () => {
  const { t, currentLanguage } = useTranslation();
  const data = getProgressReportsData();
  const [selectedChild, setSelectedChild] = useState(data.children[0].id);
  const [viewMode, setViewMode] = useState('overview'); // overview, subjects, weekly

  const currentChild = data.children.find(child => child.id === selectedChild);

  const views = [
    { key: 'overview', label: currentLanguage === 'rw' ? 'Incamake' : 'Overview' },
    { key: 'subjects', label: currentLanguage === 'rw' ? 'Ibyiciro' : 'Subjects' },
    { key: 'weekly', label: currentLanguage === 'rw' ? 'Icyumweru' : 'Weekly' }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Raporo y\'Imikurire' 
                : 'Progress Reports'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Reba imikurire y\'umwanya y\'umwana wese'
                : 'Detailed learning progress for each child'
              }
            </p>
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
                  <span>{child.overallProgress}% {currentLanguage === 'rw' ? 'imikurire' : 'progress'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="view-controls">
          <div className="view-toggle">
            {views.map((view) => (
              <button
                key={view.key}
                className={`view-btn ${viewMode === view.key ? 'active' : ''}`}
                onClick={() => setViewMode(view.key)}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Child Progress */}
        {currentChild && (
          <div className="child-progress-detail">
            <div className="progress-header">
              <div className="child-info">
                <div className="child-avatar-large">{currentChild.avatar}</div>
                <div>
                  <h2>{currentChild.name}</h2>
                  <p>{currentChild.grade}</p>
                  <p>
                    {currentLanguage === 'rw' ? 'Imikurire Yose:' : 'Overall Progress:'} {currentChild.overallProgress}%
                  </p>
                </div>
              </div>
              <div className="overall-progress">
                <div className="progress-circle-large">
                  <span>{currentChild.overallProgress}%</span>
                </div>
                <p>
                  {currentLanguage === 'rw' ? 'Imikurire Yose' : 'Overall Progress'}
                </p>
              </div>
            </div>

            {/* Overview Tab */}
            {viewMode === 'overview' && (
              <div className="overview-section">
                <div className="overview-stats">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Icon name="book" size={24} />
                    </div>
                    <div className="stat-content">
                      <h3>
                        {currentChild.subjects.reduce((total, subject) => total + subject.lessonsCompleted, 0)}
                      </h3>
                      <p>
                        {currentLanguage === 'rw' ? 'Amahugurwa Yarangije' : 'Lessons Completed'}
                      </p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Icon name="clock" size={24} />
                    </div>
                    <div className="stat-content">
                      <h3>
                        {currentChild.weeklyProgress.reduce((total, week) => {
                          const time = week.time.split('h')[0];
                          return total + parseInt(time);
                        }, 0)}h
                      </h3>
                      <p>
                        {currentLanguage === 'rw' ? 'Igihe cy\'Kwiga' : 'Learning Time'}
                      </p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Icon name="analytics" size={24} />
                    </div>
                    <div className="stat-content">
                      <h3>
                        {Math.round(currentChild.subjects.reduce((total, subject) => total + subject.averageScore, 0) / currentChild.subjects.length)}%
                      </h3>
                      <p>
                        {currentLanguage === 'rw' ? 'Incamake Ryose' : 'Average Score'}
                      </p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Icon name="target" size={24} />
                    </div>
                    <div className="stat-content">
                      <h3>{currentChild.subjects.length}</h3>
                      <p>
                        {currentLanguage === 'rw' ? 'Ibyiciro' : 'Subjects'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="strengths-improvements">
                  <div className="strengths">
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
                  <div className="improvements">
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
                </div>
              </div>
            )}

            {/* Subjects Tab */}
            {viewMode === 'subjects' && (
              <div className="subjects-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Ibyiciro' : 'Subjects'}
                </h3>
                <div className="subjects-grid">
                  {currentChild.subjects.map((subject, index) => (
                    <div key={index} className="subject-card">
                      <div className="subject-header">
                        <h4>{subject.name}</h4>
                        <span className="subject-progress">{subject.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                      <div className="subject-stats">
                        <div className="stat-item">
                          <span className="stat-label">
                            {currentLanguage === 'rw' ? 'Amahugurwa:' : 'Lessons:'}
                          </span>
                          <span className="stat-value">
                            {subject.lessonsCompleted}/{subject.totalLessons} {currentLanguage === 'rw' ? 'yarangije' : 'completed'}
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">
                            {currentLanguage === 'rw' ? 'Incamake:' : 'Score:'}
                          </span>
                          <span className="stat-value">{subject.averageScore}%</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">
                            {currentLanguage === 'rw' ? 'Ikorwa ryanyuma:' : 'Last activity:'}
                          </span>
                          <span className="stat-value">{subject.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly Tab */}
            {viewMode === 'weekly' && (
              <div className="weekly-progress">
                <h3>
                  {currentLanguage === 'rw' ? 'Imikurire y\'Icyumweru' : 'Weekly Progress'}
                </h3>
                <div className="progress-chart">
                  {currentChild.weeklyProgress.map((week, index) => (
                    <div key={index} className="week-bar">
                      <div className="week-info">
                        <span className="week-label">{week.week}</span>
                        <span className="week-lessons">{week.lessons} {currentLanguage === 'rw' ? 'amahugurwa' : 'lessons'}</span>
                        <span className="week-time">{week.time}</span>
                      </div>
                      <div className="week-progress-bar">
                        <div 
                          className="week-progress-fill" 
                          style={{ width: `${(week.lessons / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="summary-stats">
          <h3>
            {currentLanguage === 'rw' ? 'Incamake' : 'Summary'}
          </h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="child" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.totalChildren}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Abana' : 'Total Children'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="analytics" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.averageProgress}%</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Imikurire Ryose' : 'Average Progress'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="book" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.totalLessonsCompleted}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Amahugurwa Yarangije' : 'Lessons Completed'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="clock" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.totalLearningTime}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Igihe cy\'Kwiga' : 'Learning Time'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressReports;
