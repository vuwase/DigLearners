import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/language';
import teacherApiService from '../../services/teacherApiService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';
import './TeacherStyles.css';

const Schedule = () => {
  const { t, currentLanguage } = useTranslation();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // week, month
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      // For now, we'll create a mock schedule based on lessons and assignments
      const [lessonsResponse, assignmentsResponse] = await Promise.all([
        teacherApiService.getLessons().catch(() => ({ lessons: [] })),
        teacherApiService.getAssignments().catch(() => ({ assignments: [] }))
      ]);

      const lessons = lessonsResponse.lessons || [];
      const assignments = assignmentsResponse.assignments || [];

      // Create schedule items from lessons and assignments
      const scheduleItems = [
        ...lessons.map(lesson => ({
          id: `lesson-${lesson.id}`,
          title: lesson.title,
          type: 'lesson',
          date: lesson.createdAt,
          time: '09:00',
          status: 'scheduled',
          description: lesson.description,
          class: lesson.grade || 'All Classes',
          subject: lesson.subject || 'General',
          duration: `${lesson.estimatedDuration || 30} minutes`,
          classroom: 'Virtual Classroom',
          students: lesson.totalStudents || 0,
          objectives: lesson.objectives ? JSON.parse(lesson.objectives) : []
        })),
        ...assignments.map(assignment => ({
          id: `assignment-${assignment.id}`,
          title: assignment.title,
          type: 'assignment',
          date: assignment.dueDate || assignment.createdAt,
          time: '14:00',
          status: 'scheduled',
          description: assignment.description,
          class: assignment.grade || 'All Classes',
          subject: assignment.subject || 'General',
          duration: `${assignment.estimatedDuration || 30} minutes`,
          classroom: 'Virtual Classroom',
          students: assignment.totalStudents || 0,
          objectives: assignment.objectives ? JSON.parse(assignment.objectives) : []
        }))
      ];

      setSchedule(scheduleItems);
      if (scheduleItems.length > 0) {
        setSelectedSchedule(scheduleItems[0].id);
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentSchedule = schedule.find(sched => sched.id === selectedSchedule);

  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getScheduleByDate = (date) => {
    return schedule.filter(item => 
      new Date(item.date).toDateString() === new Date(date).toDateString()
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#4CAF50';
      case 'completed': return '#9E9E9E';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="page-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <h2>Loading Schedule...</h2>
            <p>Fetching your schedule...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="page-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Error Loading Schedule</h2>
            <p>{error}</p>
            <button onClick={fetchSchedule} className="retry-button">
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
        <div className="schedule-main">
          <div className="schedule-header">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Gahunda' 
                : 'Schedule'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Genzura gahunda y\'amasomo yose'
                : 'Manage your teaching schedule and lessons'
              }
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="view-controls">
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
                onClick={() => setViewMode('week')}
              >
                {currentLanguage === 'rw' ? 'Icyumweru' : 'Week'}
              </button>
              <button 
                className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => setViewMode('month')}
              >
                {currentLanguage === 'rw' ? 'Ukwezi' : 'Month'}
              </button>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="upcoming-schedule">
            <h3>
              {currentLanguage === 'rw' ? 'Gahunda Itegereje' : 'Upcoming Schedule'}
            </h3>
            <div className="schedule-list">
              {schedule.length > 0 ? (
                schedule.slice(0, 5).map((item) => (
                  <div key={item.id} className="schedule-item">
                    <div className="schedule-time">
                      <span className="time">{item.time}</span>
                      <span className="date">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="schedule-content">
                      <h4>{item.title}</h4>
                      <p>{item.class} • {item.type}</p>
                    </div>
                    <div className="schedule-type">
                      <span className="type-badge">
                        <Icon name={item.type === 'lesson' ? 'book' : 'assignment'} size={16} />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-schedule">
                  <p>No upcoming schedule items</p>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Grid */}
          {viewMode === 'week' && (
            <div className="weekly-schedule">
              <h3>
                {currentLanguage === 'rw' ? 'Gahunda y\'Icyumweru' : 'Weekly Schedule'}
              </h3>
              <div className="week-header">
                {getWeekDates().map((date, index) => (
                  <div key={index} className="day-header">
                    <span className="day-name">
                      {date.toLocaleDateString('en', { weekday: 'short' })}
                    </span>
                    <span className="day-number">{date.getDate()}</span>
                  </div>
                ))}
              </div>
              <div className="week-grid">
                {getWeekDates().map((date, index) => (
                  <div key={index} className="day-column">
                    {getScheduleByDate(date).map((item) => (
                      <div 
                        key={item.id} 
                        className={`schedule-card ${selectedSchedule === item.id ? 'selected' : ''}`}
                        onClick={() => setSelectedSchedule(item.id)}
                      >
                        <div className="card-time">{item.time}</div>
                        <div className="card-title">{item.title}</div>
                        <div className="card-class">{item.class}</div>
                        <div className="card-students">{item.students} {currentLanguage === 'rw' ? 'abanyeshuri' : 'students'}</div>
                        <div className={`card-status ${item.status}`}>
                          <Icon 
                            name={item.status === 'scheduled' ? 'calendar' : 'check'} 
                            size={16} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'month' && (
            <div className="monthly-schedule">
              <h3>
                {currentLanguage === 'rw' ? 'Gahunda y\'Ukwezi' : 'Monthly Schedule'}
              </h3>
              <div className="schedule-list">
                {schedule.map((item) => (
                  <div 
                    key={item.id} 
                    className={`schedule-item ${selectedSchedule === item.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSchedule(item.id)}
                  >
                    <div className="schedule-time">
                      <span className="time">{item.time}</span>
                      <span className="date">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="schedule-content">
                      <h4>{item.title}</h4>
                      <p>{item.class} • {item.duration} • {item.classroom}</p>
                    </div>
                    <div className="schedule-status">
                      <span 
                        className={`status-badge ${item.status}`}
                        style={{ backgroundColor: getStatusColor(item.status) }}
                      >
                        {item.status}
                      </span>
                      <span className="students-count">{item.students} {currentLanguage === 'rw' ? 'abanyeshuri' : 'students'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Schedule Details */}
          {currentSchedule && (
            <div className="schedule-details">
              <div className="schedule-detail-header">
                <div className="schedule-info">
                  <h2>{currentSchedule.title}</h2>
                  <p>{currentSchedule.class} • {currentSchedule.subject}</p>
                  <div className="schedule-meta">
                    <span>
                      <Icon name="calendar" size={16} style={{ marginRight: '4px' }} />
                      {new Date(currentSchedule.date).toLocaleDateString()}
                    </span>
                    <span>
                      <Icon name="clock" size={16} style={{ marginRight: '4px' }} />
                      {currentSchedule.time}
                    </span>
                    <span>
                      <Icon name="clock" size={16} style={{ marginRight: '4px' }} />
                      {currentSchedule.duration}
                    </span>
                    <span>
                      <Icon name="school" size={16} style={{ marginRight: '4px' }} />
                      {currentSchedule.classroom}
                    </span>
                    <span>
                      <Icon name="users" size={16} style={{ marginRight: '4px' }} />
                      {currentSchedule.students} {currentLanguage === 'rw' ? 'abanyeshuri' : 'students'}
                    </span>
                  </div>
                </div>
                <div className="schedule-actions">
                  <button className="action-btn primary">
                    {currentLanguage === 'rw' ? 'Guhindura' : 'Edit'}
                  </button>
                  <button className="action-btn secondary">
                    {currentLanguage === 'rw' ? 'Gusohora' : 'Publish'}
                  </button>
                  <button className="action-btn danger">
                    {currentLanguage === 'rw' ? 'Gusiba' : 'Cancel'}
                  </button>
                </div>
              </div>

              <div className="schedule-sections">
                <div className="objectives-section">
                  <h3>
                    {currentLanguage === 'rw' ? 'Intego' : 'Learning Objectives'}
                  </h3>
                  <ul>
                    {(currentSchedule?.objectives || []).map((objective, index) => (
                      <li key={index}>
                        <Icon name="target" size={16} style={{ marginRight: '8px' }} />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="class-info-section">
                  <h3>
                    {currentLanguage === 'rw' ? 'Amakuru y\'Isomo' : 'Lesson Information'}
                  </h3>
                  <div className="class-info-grid">
                    <div className="info-item">
                      <span className="info-label">
                        {currentLanguage === 'rw' ? 'Urwego:' : 'Grade:'}
                      </span>
                      <span className="info-value">{currentSchedule.class}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        {currentLanguage === 'rw' ? 'Icyiciro:' : 'Subject:'}
                      </span>
                      <span className="info-value">{currentSchedule.subject}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        {currentLanguage === 'rw' ? 'Abanyeshuri:' : 'Students:'}
                      </span>
                      <span className="info-value">{currentSchedule.students}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        {currentLanguage === 'rw' ? 'Igihe:' : 'Duration:'}
                      </span>
                      <span className="info-value">{currentSchedule.duration}</span>
                    </div>
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
                  <Icon name="calendar" size={24} />
                </div>
                <div className="stat-content">
                  <h3>{schedule.length}</h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Amasomo Yateguwe' : 'Total Scheduled'}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="analytics" size={24} />
                </div>
                <div className="stat-content">
                  <h3>{schedule.filter(item => {
                    const itemDate = new Date(item.date);
                    const now = new Date();
                    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return itemDate >= now && itemDate <= weekFromNow;
                  }).length}</h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Icyumweru Giki' : 'This Week'}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="users" size={24} />
                </div>
                <div className="stat-content">
                  <h3>{schedule.filter(item => item.type === 'lesson').length}</h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Abanyeshuri Byose' : 'Total Students'}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="clock" size={24} />
                </div>
                <div className="stat-content">
                  <h3>{schedule.filter(item => item.type === 'assignment').length}</h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Igihe Byose' : 'Total Hours'}
                  </p>
                </div>
              </div>
            </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
