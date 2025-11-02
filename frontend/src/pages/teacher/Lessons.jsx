import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/language';
import teacherApiService from '../../services/teacherApiService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const Lessons = () => {
  const { t, currentLanguage } = useTranslation();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchLessons();
  }, [filterSubject, filterStatus]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await teacherApiService.getLessons({
        subject: filterSubject,
        status: filterStatus
      });
      setLessons(response.lessons);
      if (response.lessons.length > 0 && !selectedLesson) {
        setSelectedLesson(response.lessons[0].id);
      }
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentLesson = lessons.find(lesson => lesson.id === selectedLesson);

  const filteredLessons = lessons.filter(lesson => {
    const subjectMatch = filterSubject === 'all' || lesson.subject === filterSubject;
    const statusMatch = filterStatus === 'all' || lesson.status === filterStatus;
    return subjectMatch && statusMatch;
  });

  const subjects = ['all', 'Digital Literacy', 'Safe Browsing', 'Typing Skills', 'Block Coding'];
  const statuses = ['all', 'published', 'draft'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return '#4CAF50';
      case 'draft': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
      <div className="page-container">
          <div className="loading-screen">
            <div className="loading-spinner"></div>
          <p>Loading lessons...</p>
        </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="page-container">
          <div className="error-message">
            <h2>Error loading lessons</h2>
            <p>{error}</p>
            <button onClick={fetchLessons} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Amasomo' 
                : 'Lessons'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Genzura amasomo yose n\'ubwoba bwabyo'
                : 'Manage all lessons and their content'
              }
            </p>
        </div>
      </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <div className="quick-actions-header">
            <h3>
              {currentLanguage === 'rw' ? 'Ikorwa Ryihuse' : 'Quick Actions'}
            </h3>
            <p>
              {currentLanguage === 'rw' 
                ? 'Tangiza amasomo mashya cyangwa genzura amasomo yose'
                : 'Create new lessons or manage existing content'
              }
            </p>
          </div>
          <div className="quick-actions-buttons">
            <button className="quick-action-btn primary">
              <div className="action-icon">📚</div>
              <div className="action-content">
                <span className="action-title">
                  {currentLanguage === 'rw' ? 'Tangiza Isomo' : 'Create Lesson'}
                </span>
                <span className="action-subtitle">
                  {currentLanguage === 'rw' ? 'Tangiza isomo rishya' : 'Create new educational content'}
                </span>
              </div>
            </button>
            <button className="quick-action-btn secondary">
              <div className="action-icon">🎯</div>
              <div className="action-content">
                <span className="action-title">
                  {currentLanguage === 'rw' ? 'Gahunda' : 'Lesson Plan'}
                </span>
                <span className="action-subtitle">
                  {currentLanguage === 'rw' ? 'Gena gahunda y\'isomo' : 'Create structured lesson plans'}
                </span>
              </div>
            </button>
            <button className="quick-action-btn secondary">
              <div className="action-icon">📊</div>
              <div className="action-content">
                <span className="action-title">
                  {currentLanguage === 'rw' ? 'Raporo' : 'Analytics'}
                </span>
                <span className="action-subtitle">
                  {currentLanguage === 'rw' ? 'Reba imikurire y\'amasomo' : 'View lesson performance analytics'}
                </span>
        </div>
        </button>
          </div>
      </div>

        {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
            <label>
              {currentLanguage === 'rw' ? 'Hitamo Icyiciro:' : 'Filter by Subject:'}
            </label>
          <select 
              value={filterSubject} 
              onChange={(e) => setFilterSubject(e.target.value)}
            className="filter-select"
          >
              <option value="all">
                {currentLanguage === 'rw' ? 'Byose' : 'All Subjects'}
              </option>
              {subjects.slice(1).map(subject => (
                <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
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
              <option value="published">
                {currentLanguage === 'rw' ? 'Yasohowe' : 'Published'}
              </option>
              <option value="draft">
                {currentLanguage === 'rw' ? 'Ntibyasohowe' : 'Draft'}
              </option>
          </select>
        </div>
      </div>

        {/* Lessons Grid */}
        <div className="lessons-grid">
          {filteredLessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className={`lesson-card ${selectedLesson === lesson.id ? 'selected' : ''}`}
              onClick={() => setSelectedLesson(lesson.id)}
            >
              <div className="lesson-header">
                <div className="lesson-title">
                  <h4>{lesson.title}</h4>
                  <p>{lesson.subject} • {lesson.grade}</p>
                </div>
                <div className="lesson-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(lesson.status) }}
                  >
                    {lesson.status}
                  </span>
                </div>
              </div>
              
              <div className="lesson-meta">
                <div className="meta-item">
                  <span className="meta-label">
                    {currentLanguage === 'rw' ? 'Igihe:' : 'Duration:'}
                  </span>
                  <span className="meta-value">{lesson.duration}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">
                    {currentLanguage === 'rw' ? 'Urwego:' : 'Difficulty:'}
                  </span>
                  <span 
                    className="meta-value"
                    style={{ color: getDifficultyColor(lesson.difficulty) }}
                  >
                    {lesson.difficulty}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">
                    {currentLanguage === 'rw' ? 'Abanyeshuri:' : 'Students:'}
                  </span>
                  <span className="meta-value">{lesson.studentsCompleted}/{lesson.totalStudents}</span>
                </div>
                {lesson.averageScore > 0 && (
                  <div className="meta-item">
                    <span className="meta-label">
                      {currentLanguage === 'rw' ? 'Incamake:' : 'Average Score:'}
                    </span>
                    <span className="meta-value">{lesson.averageScore}%</span>
                </div>
                )}
                </div>

              <div className="lesson-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(lesson.studentsCompleted / lesson.totalStudents) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {lesson.studentsCompleted}/{lesson.totalStudents} {currentLanguage === 'rw' ? 'yarangije' : 'completed'}
                </span>
                </div>
            </div>
          ))}
              </div>
              
        {/* Selected Lesson Details */}
        {currentLesson && (
          <div className="lesson-details">
            <div className="lesson-detail-header">
              <div className="lesson-info">
                <h2>{currentLesson.title}</h2>
                <p>{currentLesson.subject} • {currentLesson.grade}</p>
                <div className="lesson-meta-detail">
                  <span>
                    <Icon name="clock" size={16} style={{ marginRight: '4px' }} />
                    {currentLesson.duration}
                  </span>
                  <span>
                    <Icon name="analytics" size={16} style={{ marginRight: '4px' }} />
                    {currentLesson.difficulty}
                  </span>
                  <span>
                    <Icon name="calendar" size={16} style={{ marginRight: '4px' }} />
                    {currentLesson.lastModified}
                  </span>
                </div>
              </div>
              <div className="lesson-actions">
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

            <div className="lesson-sections">
              <div className="objectives-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Intego' : 'Learning Objectives'}
                </h3>
                <ul>
                  {(currentLesson.objectives ? 
                    (typeof currentLesson.objectives === 'string' ? 
                      JSON.parse(currentLesson.objectives) : 
                      currentLesson.objectives) : 
                    []
                  ).map((objective, index) => (
                    <li key={index}>
                      <Icon name="target" size={16} style={{ marginRight: '8px' }} />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="resources-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Ibikoresho' : 'Resources'}
                </h3>
                <ul>
                  {(currentLesson.resources ? 
                    (typeof currentLesson.resources === 'string' ? 
                      JSON.parse(currentLesson.resources) : 
                      currentLesson.resources) : 
                    []
                  ).map((resource, index) => (
                    <li key={index}>
                      <Icon name="book" size={16} style={{ marginRight: '8px' }} />
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="performance-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Imikurire' : 'Performance'}
                </h3>
                <div className="performance-stats">
                  <div className="performance-stat">
                    <span className="stat-label">
                      {currentLanguage === 'rw' ? 'Abanyeshuri yarangije:' : 'Students completed:'}
                    </span>
                    <span className="stat-value">{currentLesson.studentsCompleted}/{currentLesson.totalStudents}</span>
                  </div>
                  <div className="performance-stat">
                    <span className="stat-label">
                      {currentLanguage === 'rw' ? 'Incamake ryose:' : 'Average score:'}
                    </span>
                    <span className="stat-value">{currentLesson.averageScore}%</span>
                  </div>
                  <div className="performance-stat">
                    <span className="stat-label">
                      {currentLanguage === 'rw' ? 'Igihe cyakoresheje:' : 'Time spent:'}
                    </span>
                    <span className="stat-value">{currentLesson.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subject Categories */}
        <div className="categories-section">
          <h3>
            {currentLanguage === 'rw' ? 'Ibyiciro' : 'Subject Categories'}
          </h3>
          <div className="categories-grid">
            {subjects.filter(subject => subject !== 'all').map((subject, index) => {
              const count = lessons.filter(lesson => lesson.subject === subject).length;
              const colors = ['#FF677D', '#F8B400', '#4CAF50', '#2196F3', '#9C27B0'];
              return (
                <div key={index} className="category-card">
                  <div className="category-header">
                    <h4>{subject}</h4>
                    <span className="category-count">{count} {currentLanguage === 'rw' ? 'amasomo' : 'lessons'}</span>
                  </div>
                  <div 
                    className="category-color" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <h3>
            {currentLanguage === 'rw' ? 'Incamake' : 'Summary'}
          </h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="book" size={24} />
              </div>
              <div className="stat-content">
                <h3>{lessons.length}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Amasomo Byose' : 'Total Lessons'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="check" size={24} />
              </div>
              <div className="stat-content">
                <h3>{lessons.filter(lesson => lesson.status === 'published').length}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Yasohowe' : 'Published'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="assignment" size={24} />
              </div>
              <div className="stat-content">
                <h3>{lessons.filter(lesson => lesson.status === 'draft').length}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ntibyasohowe' : 'Draft'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="analytics" size={24} />
              </div>
              <div className="stat-content">
                <h3>{Math.round(lessons.reduce((sum, lesson) => sum + (lesson.averageScore || 0), 0) / lessons.length) || 0}%</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Imikurire Ryose' : 'Average Completion'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
