import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import { getAssignmentsData } from '../../services/teacherMockDataService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const Assignments = () => {
  const { t, currentLanguage } = useTranslation();
  const data = getAssignmentsData();
  const [selectedAssignment, setSelectedAssignment] = useState(data.assignments[0].id);
  const [filterStatus, setFilterStatus] = useState('all');

  const currentAssignment = data.assignments.find(assign => assign.id === selectedAssignment);
  
  const filteredAssignments = filterStatus === 'all' 
    ? data.assignments 
    : data.assignments.filter(assign => assign.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'upcoming': return '#FF9800';
      case 'completed': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getDueDateStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', text: 'Overdue', color: '#F44336' };
    if (diffDays === 0) return { status: 'due-today', text: 'Due Today', color: '#FF9800' };
    if (diffDays <= 3) return { status: 'due-soon', text: 'Due Soon', color: '#FF9800' };
    return { status: 'upcoming', text: 'Upcoming', color: '#4CAF50' };
  };

  return (
    <div className="dashboard-container">
    <div className="page-container">
      <div className="page-header">
          <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Ibyo Biteganyijwe' 
                : 'Assignments'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Genzura ibyo biteganyijwe n\'ibyatangijwe'
                : 'Manage assignments and track submissions'
              }
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>
              {currentLanguage === 'rw' ? 'Hitamo Imiterere:' : 'Filter by Status:'}
            </label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">
                {currentLanguage === 'rw' ? 'Byose' : 'All Status'}
              </option>
              <option value="active">
                {currentLanguage === 'rw' ? 'Bikora' : 'Active'}
              </option>
              <option value="upcoming">
                {currentLanguage === 'rw' ? 'Bitegereje' : 'Upcoming'}
              </option>
              <option value="completed">
                {currentLanguage === 'rw' ? 'Byarangije' : 'Completed'}
              </option>
            </select>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="assignments-grid">
          {filteredAssignments.map((assignment) => {
            const dueStatus = getDueDateStatus(assignment.dueDate);
            return (
              <div 
                key={assignment.id} 
                className={`assignment-card ${selectedAssignment === assignment.id ? 'selected' : ''}`}
                onClick={() => setSelectedAssignment(assignment.id)}
              >
                <div className="assignment-header">
                  <div className="assignment-title">
                    <h4>{assignment.title}</h4>
                    <p>{assignment.class}</p>
                  </div>
                  <div className="assignment-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(assignment.status) }}
                    >
                      {assignment.status}
                    </span>
                    <span 
                      className="due-status"
                      style={{ color: dueStatus.color }}
                    >
                      {dueStatus.text}
                    </span>
                  </div>
                </div>
                
                <div className="assignment-meta">
                  <div className="meta-item">
                    <span className="meta-label">
                      {currentLanguage === 'rw' ? 'Igihe cyo gusubira:' : 'Due Date:'}
                    </span>
                    <span className="meta-value">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">
                      {currentLanguage === 'rw' ? 'Abanyeshuri:' : 'Students:'}
                    </span>
                    <span className="meta-value">{assignment.submitted}/{assignment.totalStudents}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">
                      {currentLanguage === 'rw' ? 'Yatangijwe:' : 'Graded:'}
                    </span>
                    <span className="meta-value">{assignment.graded}/{assignment.submitted}</span>
                  </div>
                  {assignment.averageScore > 0 && (
                    <div className="meta-item">
                      <span className="meta-label">
                        {currentLanguage === 'rw' ? 'Incamake ryose:' : 'Average Score:'}
                      </span>
                      <span className="meta-value">{assignment.averageScore}%</span>
                    </div>
                  )}
                </div>

                <div className="assignment-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(assignment.submitted / assignment.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {assignment.submitted}/{assignment.totalStudents} {currentLanguage === 'rw' ? 'yatangije' : 'submitted'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Assignment Details */}
        {currentAssignment && (
          <div className="assignment-details">
            <div className="assignment-detail-header">
              <div className="assignment-info">
                <h2>{currentAssignment.title}</h2>
                <p>{currentAssignment.class}</p>
                <div className="assignment-meta-detail">
                  <span>
                    <Icon name="calendar" size={16} style={{ marginRight: '4px' }} />
                    {new Date(currentAssignment.dueDate).toLocaleDateString()}
                  </span>
                  <span>
                    <Icon name="users" size={16} style={{ marginRight: '4px' }} />
                    {currentAssignment.totalStudents} {currentLanguage === 'rw' ? 'abanyeshuri' : 'students'}
                  </span>
                  <span>
                    <Icon name="check" size={16} style={{ marginRight: '4px' }} />
                    {currentAssignment.submitted} {currentLanguage === 'rw' ? 'yatangije' : 'submitted'}
                  </span>
                </div>
              </div>
              <div className="assignment-actions">
                <button className="action-btn primary">
                  {currentLanguage === 'rw' ? 'Guhindura' : 'Edit'}
                </button>
                <button className="action-btn secondary">
                  {currentLanguage === 'rw' ? 'Gusohora' : 'Publish'}
                </button>
                <button className="action-btn danger">
                  {currentLanguage === 'rw' ? 'Gusiba' : 'Delete'}
                </button>
              </div>
            </div>

            <div className="assignment-sections">
              <div className="description-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Ibisobanuro' : 'Description'}
                </h3>
                <p>{currentAssignment.description}</p>
              </div>

              <div className="instructions-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Amabwiriza' : 'Instructions'}
                </h3>
                <ol>
                  {currentAssignment.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>

              <div className="submissions-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Ibyatangijwe' : 'Submissions'}
                </h3>
                <div className="submissions-list">
                  {currentAssignment.submissions.map((submission, index) => (
                    <div key={index} className="submission-item">
                      <div className="submission-header">
                        <span className="student-name">{submission.studentName}</span>
                        <span className="submission-date">{submission.submittedDate}</span>
                      </div>
                      <div className="submission-status">
                        <span 
                          className={`status-badge ${submission.status}`}
                          style={{ 
                            backgroundColor: submission.status === 'graded' ? '#4CAF50' : '#FF9800' 
                          }}
                        >
                          {submission.status}
                        </span>
                        {submission.score && (
                          <span className="submission-score">{submission.score}%</span>
                        )}
                      </div>
                      {submission.feedback && (
                        <div className="submission-feedback">
                          <p>{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
                <Icon name="assignment" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.totalAssignments}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ibyo Biteganyijwe Byose' : 'Total Assignments'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="check" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.activeAssignments}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Bikora' : 'Active'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="calendar" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.upcomingAssignments}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Bitegereje' : 'Upcoming'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="analytics" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.totalSubmissions}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ibyatangijwe Byose' : 'Total Submissions'}
                </p>
              </div>
            </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
