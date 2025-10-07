import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import { getStudentsData } from '../../services/teacherMockDataService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const Students = () => {
  const { t, currentLanguage } = useTranslation();
  const data = getStudentsData();
  const [selectedStudent, setSelectedStudent] = useState(data.students[0].id);
  const [filterGrade, setFilterGrade] = useState('all');
  const [sortBy, setSortBy] = useState('progress');

  const currentStudent = data.students.find(student => student.id === selectedStudent);
  
  const filteredStudents = filterGrade === 'all' 
    ? data.students 
    : data.students.filter(student => student.grade === filterGrade);

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return b.progress - a.progress;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'lastActive':
        return new Date(b.lastActive) - new Date(a.lastActive);
      default:
        return 0;
    }
  });

  const grades = ['all', 'Class A', 'Class B', 'Class C'];

  return (
    <div className="dashboard-container">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Abanyeshuri' 
                : 'Students'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Genzura abanyeshuri bose n\'imikurire yabo'
                : 'Manage all students and track their progress'
              }
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="filters-section">
          <div className="filter-group">
            <label>
              {currentLanguage === 'rw' ? 'Hitamo Urwego:' : 'Filter by Grade:'}
            </label>
            <select 
              value={filterGrade} 
              onChange={(e) => setFilterGrade(e.target.value)}
              className="filter-select"
            >
              <option value="all">
                {currentLanguage === 'rw' ? 'Byose' : 'All Grades'}
              </option>
              <option value="Class A">Class A</option>
              <option value="Class B">Class B</option>
              <option value="Class C">Class C</option>
            </select>
          </div>
          <div className="filter-group">
            <label>
              {currentLanguage === 'rw' ? 'Gutondekanya:' : 'Sort by:'}
            </label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="progress">
                {currentLanguage === 'rw' ? 'Imikurire' : 'Progress'}
              </option>
              <option value="name">
                {currentLanguage === 'rw' ? 'Amazina' : 'Name'}
              </option>
              <option value="lastActive">
                {currentLanguage === 'rw' ? 'Ikorwa ryanyuma' : 'Last Active'}
              </option>
            </select>
          </div>
        </div>

        {/* Students Grid */}
        <div className="students-grid">
          {sortedStudents.map((student) => (
            <div 
              key={student.id} 
              className={`student-card ${selectedStudent === student.id ? 'selected' : ''}`}
              onClick={() => setSelectedStudent(student.id)}
            >
              <div className="student-header">
                <div className="student-avatar">{student.avatar}</div>
                <div className="student-info">
                  <h4>{student.name}</h4>
                  <p>{student.grade} • {student.class}</p>
                </div>
                <div className="student-progress">
                  <span className="progress-percentage">{student.progress}%</span>
                </div>
              </div>
              
              <div className="student-stats">
                <div className="stat-item">
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Ibyo yatangije:' : 'Assignments:'}
                  </span>
                  <span className="stat-value">{student.completed}/{student.assignments}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Ibyubahiro:' : 'Badges:'}
                  </span>
                  <span className="stat-value">
                    {student.badges} 
                    <Icon name="achievement" size={16} style={{ marginLeft: '4px' }} />
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Amatike:' : 'Points:'}
                  </span>
                  <span className="stat-value">
                    {student.points} 
                    <Icon name="star" size={16} style={{ marginLeft: '4px' }} />
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Ikorwa ryanyuma:' : 'Last active:'}
                  </span>
                  <span className="stat-value">{student.lastActive}</span>
                </div>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${student.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Student Details */}
        {currentStudent && (
          <div className="student-details">
            <div className="student-detail-header">
              <div className="student-info">
                <div className="student-avatar-large">{currentStudent.avatar}</div>
                <div>
                  <h2>{currentStudent.name}</h2>
                  <p>{currentStudent.grade} • {currentStudent.class}</p>
                  <p>
                    {currentLanguage === 'rw' ? 'Umubyeyi:' : 'Parent:'} {currentStudent.parent}
                  </p>
                  <p>
                    {currentLanguage === 'rw' ? 'Telefone:' : 'Contact:'} {currentStudent.parentContact}
                  </p>
                </div>
              </div>
              <div className="student-overview">
                <div className="overview-stat">
                  <span className="stat-number">{currentStudent.progress}%</span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Imikurire' : 'Progress'}
                  </span>
                </div>
                <div className="overview-stat">
                  <span className="stat-number">{currentStudent.badges}</span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Ibyubahiro' : 'Badges'}
                  </span>
                </div>
                <div className="overview-stat">
                  <span className="stat-number">{currentStudent.points}</span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Amatike' : 'Points'}
                  </span>
                </div>
              </div>
            </div>

            <div className="student-sections">
              <div className="strengths-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Ubushobozi' : 'Strengths'}
                </h3>
                <ul>
                  {currentStudent.strengths.map((strength, index) => (
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
                  {currentStudent.areasForImprovement.map((area, index) => (
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
                  {currentStudent.recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        <Icon 
                          name={activity.type === 'lesson_completed' ? 'check' : 'achievement'} 
                          size={20} 
                        />
                      </div>
                      <div className="activity-content">
                        <p>{activity.title}</p>
                        <span className="activity-date">{activity.date}</span>
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

        {/* Summary Stats */}
        <div className="summary-stats">
          <h3>
            {currentLanguage === 'rw' ? 'Incamake' : 'Summary'}
          </h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="users" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.totalStudents}</h3>
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
                <h3>{data.summary.activeStudents}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Bakora' : 'Active Students'}
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
                <Icon name="star" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.topPerformer}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Wakora neza cyane' : 'Top Performer'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;