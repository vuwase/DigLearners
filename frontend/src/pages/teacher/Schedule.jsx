import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import { getScheduleData } from '../../services/teacherMockDataService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const Schedule = () => {
  const { t, currentLanguage } = useTranslation();
  const data = getScheduleData();
  const [viewMode, setViewMode] = useState('week'); // week, month
  const [selectedSchedule, setSelectedSchedule] = useState(data.schedule[0].id);

  const currentSchedule = data.schedule.find(sched => sched.id === selectedSchedule);

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
    return data.schedule.filter(item => 
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

  return (
    <div className="dashboard-container">
    <div className="page-container">
      <div className="page-header">
          <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Gahunda' 
                : 'Schedule'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Genzura gahunda y\'amasomo yose'
                : 'Manage your teaching schedule and classes'
              }
            </p>
          </div>
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
            {data.upcoming.map((item) => (
              <div key={item.id} className="schedule-item">
                <div className="schedule-time">
                  <span className="time">{item.time}</span>
                  <span className="date">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="schedule-content">
                  <h4>{item.title}</h4>
                  <p>{item.class} • {item.students} {currentLanguage === 'rw' ? 'abanyeshuri' : 'students'}</p>
                </div>
                <div className="schedule-type">
                  <span className="type-badge">
                    <Icon name="book" size={16} />
                  </span>
                </div>
              </div>
            ))}
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
              {data.schedule.map((item) => (
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
                  {currentSchedule.objectives.map((objective, index) => (
                    <li key={index}>
                      <Icon name="target" size={16} style={{ marginRight: '8px' }} />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="class-info-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Amakuru y\'Ishuuri' : 'Class Information'}
                </h3>
                <div className="class-info-grid">
                  <div className="info-item">
                    <span className="info-label">
                      {currentLanguage === 'rw' ? 'Ishuuri:' : 'Class:'}
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
                <h3>{data.summary.totalScheduled}</h3>
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
                <h3>{data.summary.thisWeek}</h3>
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
                <h3>{data.summary.totalStudents}</h3>
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
                <h3>{data.summary.totalHours}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Igihe Byose' : 'Total Hours'}
                </p>
              </div>
            </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;