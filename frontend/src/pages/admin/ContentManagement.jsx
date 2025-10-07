import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import Icon from '../../components/icons/Icon';
import adminMockDataService from '../../services/adminMockDataService';
import './AdminPages.css';

const ContentManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('lessons');
  const [content] = useState(adminMockDataService.getContent());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLessons = content.lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return '#4CAF50';
      case 'draft': return '#FF9800';
      case 'archived': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Content Management</h1>
        <p>Manage lessons, courses, and educational content</p>
      </div>

      {/* Content Tabs */}
      <div className="content-tabs">
        <button 
          className={`tab-button ${activeTab === 'lessons' ? 'active' : ''}`}
          onClick={() => setActiveTab('lessons')}
        >
          <Icon name="book" size={20} />
          Lessons ({content.lessons.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <Icon name="course" size={20} />
          Courses ({content.courses.length})
        </button>
      </div>

      {/* Filters and Search */}
      <div className="admin-filters">
        <div className="search-box">
          <Icon name="search" size={20} />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Content Statistics */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="book" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{content.lessons.length}</div>
            <div className="stat-label">Total Lessons</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="check" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{content.lessons.filter(l => l.status === 'published').length}</div>
            <div className="stat-label">Published</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="eye" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {content.lessons.reduce((sum, lesson) => sum + lesson.views, 0)}
            </div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="achievement" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {content.lessons.reduce((sum, lesson) => sum + lesson.completions, 0)}
            </div>
            <div className="stat-label">Completions</div>
          </div>
        </div>
      </div>

      {/* Lessons Content */}
      {activeTab === 'lessons' && (
        <div className="content-grid">
          {filteredLessons.map(lesson => (
            <div key={lesson.id} className="content-card">
              <div className="content-header">
                <div className="content-title">{lesson.title}</div>
                <div className="content-actions">
                  <button className="btn-icon" title="Edit">
                    <Icon name="edit" size={16} />
                  </button>
                  <button className="btn-icon" title="View">
                    <Icon name="eye" size={16} />
                  </button>
                  <button className="btn-icon" title="More">
                    <Icon name="more" size={16} />
                  </button>
                </div>
              </div>
              
              <div className="content-meta">
                <span className="category-badge">{lesson.category}</span>
                <span 
                  className="level-badge" 
                  style={{ backgroundColor: getLevelColor(lesson.level) }}
                >
                  {lesson.level}
                </span>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(lesson.status) }}
                >
                  {lesson.status}
                </span>
              </div>
              
              <div className="content-details">
                <div className="detail-item">
                  <Icon name="clock" size={16} />
                  <span>{lesson.duration}</span>
                </div>
                <div className="detail-item">
                  <Icon name="eye" size={16} />
                  <span>{lesson.views} views</span>
                </div>
                <div className="detail-item">
                  <Icon name="check" size={16} />
                  <span>{lesson.completions} completions</span>
                </div>
                <div className="detail-item">
                  <Icon name="star" size={16} />
                  <span>{lesson.rating}/5</span>
                </div>
              </div>
              
              <div className="content-footer">
                <div className="author-info">
                  <Icon name="teacher" size={16} />
                  <span>By {lesson.author}</span>
                </div>
                <div className="last-updated">
                  Updated {new Date(lesson.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Courses Content */}
      {activeTab === 'courses' && (
        <div className="content-grid">
          {content.courses.map(course => (
            <div key={course.id} className="content-card course-card">
              <div className="content-header">
                <div className="content-title">{course.title}</div>
                <div className="content-actions">
                  <button className="btn-icon" title="Edit">
                    <Icon name="edit" size={16} />
                  </button>
                  <button className="btn-icon" title="View">
                    <Icon name="eye" size={16} />
                  </button>
                </div>
              </div>
              
              <div className="course-description">
                {course.description}
              </div>
              
              <div className="course-stats">
                <div className="stat-item">
                  <Icon name="book" size={16} />
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="stat-item">
                  <Icon name="users" size={16} />
                  <span>{course.students} students</span>
                </div>
                <div className="stat-item">
                  <Icon name="analytics" size={16} />
                  <span>{course.completionRate}% completion</span>
                </div>
              </div>
              
              <div className="course-footer">
                <span className="status-badge active">Active</span>
                <span className="created-date">
                  Created {new Date(course.createdDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Content Button */}
      <div className="admin-actions">
        <button className="btn-primary">
          <Icon name="plus" size={20} />
          Add New {activeTab === 'lessons' ? 'Lesson' : 'Course'}
        </button>
      </div>
    </div>
  );
};

export default ContentManagement;
