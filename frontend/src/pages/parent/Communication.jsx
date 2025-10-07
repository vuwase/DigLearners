import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import { getCommunicationData } from '../../services/parentMockDataService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const Communication = () => {
  const { t, currentLanguage } = useTranslation();
  const data = getCommunicationData();
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const unreadCount = data.messages.filter(msg => !msg.read).length;

  return (
    <div className="dashboard-container">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Kuvugana' 
                : 'Communication'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Reba ubutumwa n\'amakuru y\'abana banyu'
                : 'View messages and announcements about your children'
              }
            </p>
          </div>
        </div>

        {/* Communication Tabs */}
        <div className="communication-tabs">
          <button 
            className={`comm-tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            {currentLanguage === 'rw' ? 'Ubutumwa' : 'Messages'}
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </button>
          <button 
            className={`comm-tab ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            {currentLanguage === 'rw' ? 'Amakuru' : 'Announcements'}
          </button>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="messages-section">
            <div className="messages-header">
              <h3>
                {currentLanguage === 'rw' ? 'Ubutumwa' : 'Messages'}
              </h3>
              <div className="message-stats">
                <span>{unreadCount} {currentLanguage === 'rw' ? 'ntibasomwe' : 'unread'}</span>
                <span>{data.messages.length} {currentLanguage === 'rw' ? 'byose' : 'total'}</span>
              </div>
            </div>

            <div className="messages-list">
              {data.messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage === message.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                >
                  <div className="message-header">
                    <div className="message-from">
                      <span className="sender-name">{message.from}</span>
                      <span className="message-priority">{message.priority}</span>
                    </div>
                    <div className="message-meta">
                      <span className="message-date">{message.date}</span>
                      <span className="message-time">{message.time}</span>
                      {!message.read && <span className="unread-dot">●</span>}
                    </div>
                  </div>
                  <div className="message-subject">{message.subject}</div>
                  {selectedMessage === message.id && (
                    <div className="message-content">
                      <p>{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="announcements-section">
            <div className="announcements-header">
              <h3>
                {currentLanguage === 'rw' ? 'Amakuru' : 'Announcements'}
              </h3>
              <div className="announcement-stats">
                <span>{data.announcements.length} {currentLanguage === 'rw' ? 'amakuru' : 'announcements'}</span>
              </div>
            </div>

            <div className="announcements-list">
              {data.announcements.map((announcement) => (
                <div key={announcement.id} className="announcement-item">
                  <div className="announcement-header">
                    <div className="announcement-title">
                      <h4>{announcement.title}</h4>
                      <span className={`announcement-type ${announcement.type}`}>
                        <Icon 
                          name={announcement.type === 'update' ? 'recent' : 'achievement'} 
                          size={16} 
                        />
                      </span>
                    </div>
                    <div className="announcement-date">{announcement.date}</div>
                  </div>
                  <div className="announcement-content">
                    <p>{announcement.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>
            {currentLanguage === 'rw' ? 'Ikorwa Ryihuse' : 'Quick Actions'}
          </h3>
          <div className="actions-grid">
            <button className="action-btn">
              <span className="action-icon">
                <Icon name="email" size={20} />
              </span>
              <span className="action-text">
                {currentLanguage === 'rw' ? 'Ohereza Ubutumwa' : 'Send Message'}
              </span>
            </button>
            <button className="action-btn">
              <span className="action-icon">
                <Icon name="phone" size={20} />
              </span>
              <span className="action-text">
                {currentLanguage === 'rw' ? 'Hamagara Umwarimu' : 'Call Teacher'}
              </span>
            </button>
            <button className="action-btn">
              <span className="action-icon">
                <Icon name="calendar" size={20} />
              </span>
              <span className="action-text">
                {currentLanguage === 'rw' ? 'Gahunda Y\'Ihuriro' : 'Schedule Meeting'}
              </span>
            </button>
            <button className="action-btn">
              <span className="action-icon">
                <Icon name="analytics" size={20} />
              </span>
              <span className="action-text">
                {currentLanguage === 'rw' ? 'Raporo Y\'Imikurire' : 'Progress Report'}
              </span>
            </button>
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
                <Icon name="email" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.unreadMessages}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ubutumwa Butasomwe' : 'Unread Messages'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="message" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.totalMessages}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ubutumwa Bwose' : 'Total Messages'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="announcement" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.recentAnnouncements}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Amakuru Ryihariye' : 'Recent Announcements'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="phone" size={24} />
              </div>
              <div className="stat-content">
                <h3>24/7</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ubufasha' : 'Support Available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;
