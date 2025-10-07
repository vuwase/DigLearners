import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import { getScheduleData } from '../../services/parentMockDataService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const Schedule = () => {
  const { t, currentLanguage } = useTranslation();
  const data = getScheduleData();
  const [selectedChild, setSelectedChild] = useState(data.children[0].id);
  const [viewMode, setViewMode] = useState('week'); // week, month

  const currentChild = data.children.find(child => child.id === selectedChild);

  const getUpcomingSchedule = () => {
    if (!currentChild) return [];
    return currentChild.schedule.filter(item => 
      new Date(item.date) >= new Date()
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getScheduleByDate = (date) => {
    if (!currentChild) return [];
    return currentChild.schedule.filter(item => 
      new Date(item.date).toDateString() === new Date(date).toDateString()
    );
  };

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
                ? 'Reba gahunda y\'amahugurwa y\'abana banyu'
                : 'View your children\'s learning schedule'
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
                <span className="child-schedule-count">{child.schedule.length} {currentLanguage === 'rw' ? 'amahugurwa' : 'sessions'}</span>
              </button>
            ))}
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
                  <p>{item.childName}</p>
                </div>
                <div className="schedule-type">
                  <span className={`type-badge ${item.type}`}>
                    <Icon 
                      name={item.type === 'lesson' ? 'book' : 'recent'} 
                      size={16} 
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Child Schedule */}
        {currentChild && (
          <div className="child-schedule">
            <div className="schedule-header">
              <h3>
                {currentLanguage === 'rw' ? 'Gahunda ya' : 'Schedule for'} {currentChild.name}
              </h3>
              <div className="schedule-stats">
                <span>{currentChild.schedule.length} {currentLanguage === 'rw' ? 'amahugurwa' : 'sessions'}</span>
              </div>
            </div>

            {viewMode === 'week' && (
              <div className="weekly-schedule">
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
                        <div key={item.id} className="schedule-card">
                          <div className="card-time">{item.time}</div>
                          <div className="card-title">{item.title}</div>
                          <div className="card-subject">{item.subject}</div>
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
                <div className="schedule-list">
                  {currentChild.schedule.map((item) => (
                    <div key={item.id} className="schedule-item">
                      <div className="schedule-time">
                        <span className="time">{item.time}</span>
                        <span className="date">{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <div className="schedule-content">
                        <h4>{item.title}</h4>
                        <p>{item.subject} • {item.duration}</p>
                      </div>
                      <div className="schedule-status">
                        <span className={`status-badge ${item.status}`}>
                          <Icon 
                            name={item.status === 'scheduled' ? 'calendar' : 'check'} 
                            size={16} 
                          />
                        </span>
                        <span className="type-badge">{item.type}</span>
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
                <Icon name="calendar" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.totalScheduled}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Amahugurwa Yateguwe' : 'Total Scheduled'}
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
                <Icon name="progress" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.nextWeek}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Icyumweru Gikurikira' : 'Next Week'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="calendar" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.mostActiveDay}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Umunsi ukora cyane' : 'Most Active Day'}
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
