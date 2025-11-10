import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/language';
import teacherApiService from '../../services/teacherApiService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';
import './TeacherStyles.css';

const Students = () => {
  const { t, currentLanguage } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filterGrade, setFilterGrade] = useState('all');
  const [sortBy, setSortBy] = useState('progress');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await teacherApiService.getStudents();
      const studentList = response.students || response.data || [];
      const normalizedStudents = Array.isArray(studentList) ? studentList : [];
      setStudents(normalizedStudents);
      if (normalizedStudents.length > 0) {
        setSelectedStudent(normalizedStudents[0].id);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentUpdate = async (studentId, updateData) => {
    try {
      await teacherApiService.updateStudent(studentId, updateData);
      // Refresh students list
      fetchStudents();
    } catch (err) {
      console.error('Error updating student:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container students-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading Students...</h2>
          <p>Fetching student data...</p>
        </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container students-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Students</h2>
          <p>{error}</p>
          <button onClick={fetchStudents} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentStudent = students.find(student => student.id === selectedStudent);
  
  const filteredStudents = filterGrade === 'all' 
    ? students 
    : students.filter(student => student.grade === filterGrade);

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return (b.totalPoints || 0) - (a.totalPoints || 0);
      case 'name':
        return a.fullName.localeCompare(b.fullName);
      case 'lastActive':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const grades = ['all', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

  return (
    <div className="dashboard-container students-page">
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
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
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
                <div className="student-avatar">
                  {(student.fullName || student.name || '👤').charAt(0).toUpperCase()}
                </div>
                <div className="student-info">
                  <h4>{student.fullName || student.name || 'Unknown Student'}</h4>
                  <p>{student.grade || 'No Grade'} • {student.email || 'No Email'}</p>
                </div>
                <div className="student-progress">
                  <span className="progress-percentage">
                    {Math.round(((student.totalPoints || 0) / 1000) * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="student-stats">
                <div className="stat-item">
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Ibyo yatangije:' : 'Assignments:'}
                  </span>
                  <span className="stat-value">{student.completedAssignments || 0}/{student.totalAssignments || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Ibyubahiro:' : 'Badges:'}
                  </span>
                  <span className="stat-value">
                    {student.badgesEarned || 0} 
                    <Icon name="achievement" size={16} style={{ marginLeft: '4px' }} />
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Amatike:' : 'Points:'}
                  </span>
                  <span className="stat-value">
                    {student.totalPoints || 0} 
                    <Icon name="star" size={16} style={{ marginLeft: '4px' }} />
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Ikorwa ryanyuma:' : 'Last active:'}
                  </span>
                  <span className="stat-value">
                    {student.lastLoginAt ? new Date(student.lastLoginAt).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.round((student.totalPoints || 0) / 1000 * 100)}%` }}
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
                <div className="student-avatar-large">
                  {(currentStudent.fullName || currentStudent.name || '👤').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2>{currentStudent.fullName || currentStudent.name || 'Unknown Student'}</h2>
                  <p>{currentStudent.grade || 'No Grade'} • {currentStudent.email || 'No Email'}</p>
                  <p>
                    {currentLanguage === 'rw' ? 'Age:' : 'Age:'} {currentStudent.age || 'Unknown'}
                  </p>
                  <p>
                    {currentLanguage === 'rw' ? 'Registered:' : 'Registered:'} {currentStudent.createdAt ? new Date(currentStudent.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="student-overview">
                <div className="overview-stat">
                  <span className="stat-number">{Math.round((currentStudent.totalPoints || 0) / 1000 * 100)}%</span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Imikurire' : 'Progress'}
                  </span>
                </div>
                <div className="overview-stat">
                  <span className="stat-number">{currentStudent.badgesEarned || 0}</span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Ibyubahiro' : 'Badges'}
                  </span>
                </div>
                <div className="overview-stat">
                  <span className="stat-number">{currentStudent.totalPoints || 0}</span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Amatike' : 'Points'}
                  </span>
                </div>
              </div>
        </div>
        
            <div className="student-sections">
              <div className="student-info-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Amakuru y\'umunyeshuri' : 'Student Information'}
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">
                      {currentLanguage === 'rw' ? 'Email:' : 'Email:'}
                    </span>
                    <span className="info-value">{currentStudent.email || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      {currentLanguage === 'rw' ? 'Grade:' : 'Grade:'}
                    </span>
                    <span className="info-value">{currentStudent.grade || 'Not assigned'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      {currentLanguage === 'rw' ? 'Age:' : 'Age:'}
                    </span>
                    <span className="info-value">{currentStudent.age || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      {currentLanguage === 'rw' ? 'Joined:' : 'Joined:'}
                    </span>
                    <span className="info-value">
                      {currentStudent.createdAt ? new Date(currentStudent.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
        </div>
      </div>

              <div className="student-stats-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Imikurire' : 'Progress Statistics'}
                </h3>
      <div className="stats-grid">
        <div className="stat-card">
                    <div className="stat-icon">
                      <Icon name="star" size={24} />
                    </div>
          <div className="stat-content">
                      <h4>{currentStudent.totalPoints || 0}</h4>
                      <p>{currentLanguage === 'rw' ? 'Amatike' : 'Total Points'}</p>
          </div>
        </div>
        <div className="stat-card">
                    <div className="stat-icon">
                      <Icon name="achievement" size={24} />
                    </div>
          <div className="stat-content">
                      <h4>{currentStudent.badgesEarned || 0}</h4>
                      <p>{currentLanguage === 'rw' ? 'Ibyubahiro' : 'Badges Earned'}</p>
          </div>
        </div>
        <div className="stat-card">
                    <div className="stat-icon">
                      <Icon name="book" size={24} />
                    </div>
          <div className="stat-content">
                      <h4>{currentStudent.completedAssignments || 0}</h4>
                      <p>{currentLanguage === 'rw' ? 'Ibyo yatangije' : 'Completed Assignments'}</p>
          </div>
        </div>
        <div className="stat-card">
                    <div className="stat-icon">
                      <Icon name="calendar" size={24} />
                    </div>
          <div className="stat-content">
                      <h4>
                        {currentStudent.lastLoginAt ? 
                          Math.floor((new Date() - new Date(currentStudent.lastLoginAt)) / (1000 * 60 * 60 * 24)) : 
                          'N/A'
                        }
                      </h4>
                      <p>{currentLanguage === 'rw' ? 'Iminsi ishize' : 'Days Since Last Login'}</p>
                    </div>
          </div>
        </div>
      </div>

              <div className="student-actions-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Ibikorwa' : 'Actions'}
                </h3>
                <div className="action-buttons">
                  <button 
                    className="action-btn primary"
                    onClick={() => handleStudentUpdate(currentStudent.id, { grade: prompt('Enter new grade:', currentStudent.grade) })}
                  >
                    <Icon name="edit" size={16} />
                    {currentLanguage === 'rw' ? 'Guhindura Urwego' : 'Update Grade'}
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => window.open(`mailto:${currentStudent.email}`, '_blank')}
                    disabled={!currentStudent.email}
                  >
                    <Icon name="mail" size={16} />
                    {currentLanguage === 'rw' ? 'Kohereza Email' : 'Send Email'}
                  </button>
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
                <h3>{students.length}</h3>
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
                <h3>{students.filter(s => s.lastLoginAt && new Date(s.lastLoginAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Bakora muri iki cyumweru' : 'Active This Week'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="analytics" size={24} />
                      </div>
              <div className="stat-content">
                <h3>
                  {students.length > 0 ? 
                    Math.round(students.reduce((sum, s) => sum + (s.totalPoints || 0), 0) / students.length / 10) : 
                    0
                  }%
                </h3>
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
                <h3>
                  {students.length > 0 ? 
                    students.reduce((max, s) => (s.totalPoints || 0) > (max.totalPoints || 0) ? s : max).fullName?.split(' ')[0] || 'N/A' : 
                    'N/A'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' ? 'Uwatsinze' : 'Top Performer'}
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
