import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import { getReportsData } from '../../services/parentMockDataService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const Reports = () => {
  const { t, currentLanguage } = useTranslation();
  const data = getReportsData();
  const [selectedChild, setSelectedChild] = useState(data.children[0].id);
  const [selectedReport, setSelectedReport] = useState(null);

  const currentChild = data.children.find(child => child.id === selectedChild);

  const getGradeColor = (grade) => {
    if (grade.includes('A+')) return '#4CAF50';
    if (grade.includes('A')) return '#8BC34A';
    if (grade.includes('B+')) return '#FFC107';
    if (grade.includes('B')) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="dashboard-container">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Raporo' 
                : 'Reports'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Reba raporo z\'imikurire y\'abana banyu'
                : 'View detailed progress reports for your children'
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
                <span className="child-name">{child.name}</span>
                <span className="child-reports-count">{child.reports.length} {currentLanguage === 'rw' ? 'raporo' : 'reports'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Child Reports */}
        {currentChild && (
          <div className="reports-section">
            <div className="reports-header">
              <h3>
                {currentLanguage === 'rw' ? 'Raporo za' : 'Reports for'} {currentChild.name}
              </h3>
              <div className="reports-stats">
                <span>{currentChild.reports.length} {currentLanguage === 'rw' ? 'raporo' : 'reports'}</span>
              </div>
            </div>

            <div className="reports-list">
              {currentChild.reports.map((report) => (
                <div 
                  key={report.id} 
                  className={`report-item ${selectedReport === report.id ? 'selected' : ''}`}
                  onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                >
                  <div className="report-header">
                    <div className="report-title">
                      <h4>{report.title}</h4>
                      <span className="report-period">{report.period}</span>
                    </div>
                    <div className="report-meta">
                      <span className="report-date">{report.date}</span>
                      {report.overallGrade && (
                        <span 
                          className="report-grade"
                          style={{ color: getGradeColor(report.overallGrade) }}
                        >
                          {report.overallGrade}
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedReport === report.id && (
                    <div className="report-details">
                      {report.subjects && (
                        <div className="subjects-section">
                          <h5>
                            {currentLanguage === 'rw' ? 'Ibyiciro' : 'Subjects'}
                          </h5>
                          <div className="subjects-grid">
                            {report.subjects.map((subject, index) => (
                              <div key={index} className="subject-item">
                                <div className="subject-name">{subject.name}</div>
                                <div className="subject-grade" style={{ color: getGradeColor(subject.grade) }}>
                                  {subject.grade}
                                </div>
                                <div className="subject-progress">
                                  <div className="progress-bar">
                                    <div 
                                      className="progress-fill" 
                                      style={{ width: `${subject.progress}%` }}
                                    ></div>
                                  </div>
                                  <span>{subject.progress}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {report.strengths && (
                        <div className="strengths-section">
                          <h5>
                            {currentLanguage === 'rw' ? 'Ubushobozi' : 'Strengths'}
                          </h5>
                          <ul>
                            {report.strengths.map((strength, index) => (
                              <li key={index}>
                                <Icon name="check" size={16} style={{ marginRight: '8px' }} />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {report.recommendations && (
                        <div className="recommendations-section">
                          <h5>
                            {currentLanguage === 'rw' ? 'Inama' : 'Recommendations'}
                          </h5>
                          <ul>
                            {report.recommendations.map((rec, index) => (
                              <li key={index}>
                                <Icon name="progress" size={16} style={{ marginRight: '8px' }} />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {report.lessonsCompleted && (
                        <div className="activity-section">
                          <h5>
                            {currentLanguage === 'rw' ? 'Ikorwa' : 'Activity'}
                          </h5>
                          <div className="activity-stats">
                            <div className="activity-stat">
                              <span className="stat-label">
                                {currentLanguage === 'rw' ? 'Amahugurwa yarangije:' : 'Lessons completed:'}
                              </span>
                              <span className="stat-value">{report.lessonsCompleted}</span>
                            </div>
                            <div className="activity-stat">
                              <span className="stat-label">
                                {currentLanguage === 'rw' ? 'Igihe cyakoresheje:' : 'Time spent:'}
                              </span>
                              <span className="stat-value">{report.timeSpent}</span>
                            </div>
                            <div className="activity-stat">
                              <span className="stat-label">
                                {currentLanguage === 'rw' ? 'Ibyubahiro byabonye:' : 'Badges earned:'}
                              </span>
                              <span className="stat-value">{report.badgesEarned}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
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
                <h3>{data.summary.totalReports}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Raporo Byose' : 'Total Reports'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="new" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.recentReports}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ryihariye' : 'Recent Reports'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="star" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.averageGrade}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Incamake y\'Icyiciro' : 'Average Grade'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="progress" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.mostImproved}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Wakura cyane' : 'Most Improved'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
