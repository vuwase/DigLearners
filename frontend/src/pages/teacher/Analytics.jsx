import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import { getAnalyticsData } from '../../services/teacherMockDataService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const Analytics = () => {
  const { t, currentLanguage } = useTranslation();
  const data = getAnalyticsData();
  const [selectedView, setSelectedView] = useState('overview');

  const views = [
    { key: 'overview', label: currentLanguage === 'rw' ? 'Incamake' : 'Overview' },
    { key: 'students', label: currentLanguage === 'rw' ? 'Abanyeshuri' : 'Students' },
    { key: 'classes', label: currentLanguage === 'rw' ? 'Amashuri' : 'Classes' },
    { key: 'performance', label: currentLanguage === 'rw' ? 'Imikurire' : 'Performance' }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Icyegeranyo' 
                : 'Analytics'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Reba icyegeranyo cy\'imikurire n\'ibikorwa'
                : 'View detailed analytics and performance metrics'
              }
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="analytics-tabs">
          {views.map((view) => (
            <button
              key={view.key}
              className={`analytics-tab ${selectedView === view.key ? 'active' : ''}`}
              onClick={() => setSelectedView(view.key)}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedView === 'overview' && (
          <div className="overview-section">
            <div className="overview-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="users" size={24} />
                </div>
                <div className="stat-content">
                  <h3>{data.overview.totalStudents}</h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Abanyeshuri Byose' : 'Total Students'}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="check" size={24} />
                </div>
                <div className="stat-content">
                  <h3>{data.overview.activeStudents}</h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Bakora' : 'Active Students'}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="book" size={24} />
                </div>
                <div className="stat-content">
                  <h3>{data.overview.totalLessons}</h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Amasomo Byose' : 'Total Lessons'}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="clock" size={24} />
                </div>
                <div className="stat-content">
                  <h3>{data.overview.totalHours}</h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Igihe Byose' : 'Total Hours'}
                  </p>
                </div>
              </div>
            </div>

            <div className="weekly-activity">
              <h3>
                {currentLanguage === 'rw' ? 'Ikorwa ry\'Icyumweru' : 'Weekly Activity'}
              </h3>
              <div className="activity-chart">
                {data.weeklyActivity.map((week, index) => (
                  <div key={index} className="week-bar">
                    <div className="week-info">
                      <span className="week-label">{week.week}</span>
                      <span className="week-lessons">{week.lessons} {currentLanguage === 'rw' ? 'amasomo' : 'lessons'}</span>
                      <span className="week-students">{week.students} {currentLanguage === 'rw' ? 'abanyeshuri' : 'students'}</span>
                      <span className="week-hours">{week.hours} {currentLanguage === 'rw' ? 'amasaha' : 'hours'}</span>
                    </div>
                    <div className="week-progress-bar">
                      <div 
                        className="week-progress-fill" 
                        style={{ width: `${(week.lessons / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {selectedView === 'students' && (
          <div className="students-section">
            <h3>
              {currentLanguage === 'rw' ? 'Imikurire y\'Abanyeshuri' : 'Student Progress'}
            </h3>
            <div className="students-progress-list">
              {data.studentProgress.map((student, index) => (
                <div key={index} className="student-progress-item">
                  <div className="student-info">
                    <div className="student-avatar">
                      <Icon name="users" size={24} />
                    </div>
                    <div>
                      <h4>{student.name}</h4>
                      <p>
                        {currentLanguage === 'rw' ? 'Amasomo yarangije:' : 'Lessons completed:'} {student.lessonsCompleted}
                      </p>
                    </div>
                  </div>
                  <div className="student-progress">
                    <div className="progress-circle">
                      <span>{student.progress}%</span>
                    </div>
                  </div>
                  <div className="student-stats">
                    <div className="stat-item">
                      <span className="stat-label">
                        {currentLanguage === 'rw' ? 'Igihe:' : 'Time:'}
                      </span>
                      <span className="stat-value">{student.timeSpent}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">
                        {currentLanguage === 'rw' ? 'Ikorwa ryanyuma:' : 'Last active:'}
                      </span>
                      <span className="stat-value">{student.lastActive}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classes Tab */}
        {selectedView === 'classes' && (
          <div className="classes-section">
            <h3>
              {currentLanguage === 'rw' ? 'Imikurire y\'Amashuri' : 'Class Performance'}
            </h3>
            <div className="classes-performance-grid">
              {data.classPerformance.map((classPerf, index) => (
                <div key={index} className="class-performance-card">
                  <div className="class-header">
                    <h4>{classPerf.className}</h4>
                    <div className="class-progress">
                      <span>{classPerf.averageProgress}%</span>
                    </div>
                  </div>
                  <div className="class-stats">
                    <div className="stat-item">
                      <span className="stat-label">
                        {currentLanguage === 'rw' ? 'Abanyeshuri:' : 'Students:'}
                      </span>
                      <span className="stat-value">{classPerf.activeStudents}/{classPerf.totalStudents}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">
                        {currentLanguage === 'rw' ? 'Amasomo yarangije:' : 'Lessons completed:'}
                      </span>
                      <span className="stat-value">{classPerf.lessonsCompleted}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">
                        {currentLanguage === 'rw' ? 'Incamake ryose:' : 'Average score:'}
                      </span>
                      <span className="stat-value">{classPerf.averageScore}%</span>
                    </div>
                  </div>
                  <div className="class-progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${classPerf.averageProgress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {selectedView === 'performance' && (
          <div className="performance-section">
            <div className="top-performers">
              <h3>
                {currentLanguage === 'rw' ? 'Abakora Neza' : 'Top Performers'}
              </h3>
              <div className="performers-list">
                {data.topPerformers.map((performer, index) => (
                  <div key={index} className="performer-item">
                    <div className="performer-rank">
                      <span className="rank-number">#{index + 1}</span>
                    </div>
                    <div className="performer-info">
                      <h4>{performer.name}</h4>
                      <p>{performer.class}</p>
                    </div>
                    <div className="performer-stats">
                      <div className="stat-item">
                        <span className="stat-label">
                          {currentLanguage === 'rw' ? 'Imikurire:' : 'Progress:'}
                        </span>
                        <span className="stat-value">{performer.progress}%</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">
                          {currentLanguage === 'rw' ? 'Ibyubahiro:' : 'Badges:'}
                        </span>
                        <span className="stat-value">{performer.badges}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">
                          {currentLanguage === 'rw' ? 'Amatike:' : 'Points:'}
                        </span>
                        <span className="stat-value">{performer.points}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="needs-attention">
              <h3>
                {currentLanguage === 'rw' ? 'Bakeneye Ubufasha' : 'Needs Attention'}
              </h3>
              <div className="attention-list">
                {data.needsAttention.map((student, index) => (
                  <div key={index} className="attention-item">
                    <div className="attention-info">
                      <h4>{student.name}</h4>
                      <p>{student.class}</p>
                      <span className="attention-issue">{student.issue}</span>
                    </div>
                    <div className="attention-stats">
                      <div className="stat-item">
                        <span className="stat-label">
                          {currentLanguage === 'rw' ? 'Imikurire:' : 'Progress:'}
                        </span>
                        <span className="stat-value">{student.progress}%</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">
                          {currentLanguage === 'rw' ? 'Ikorwa ryanyuma:' : 'Last active:'}
                        </span>
                        <span className="stat-value">{student.lastActive}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                <Icon name="analytics" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.overview.averageProgress}%</h3>
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
                <h3>{data.overview.completedLessons}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Amasomo Yarangije' : 'Completed Lessons'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="clock" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.overview.totalHours}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Igihe Byose' : 'Total Hours'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="users" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.overview.activeStudents}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Abanyeshuri Bakora' : 'Active Students'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;