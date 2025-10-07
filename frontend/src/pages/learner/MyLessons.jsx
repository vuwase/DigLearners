import React, { useState, useEffect } from 'react'
import { useTranslation } from '../../lib/language'
import { mockLessons, getLessonsByModule, getCompletedLessons, getPendingLessons, formatDate } from '../../services/mockDataService'
import ProgressTracker from '../../components/ProgressTracker'
import Icon from '../../components/icons/Icon'
import '../../components/CodePlayStyles.css'
import '../../components/DashboardStyles.css'

export default function MyLessons() {
  const { t } = useTranslation()
  const [selectedModule, setSelectedModule] = useState('all')
  const [lessons, setLessons] = useState(mockLessons)
  const [filteredLessons, setFilteredLessons] = useState(mockLessons)

  const modules = [
    { id: 'all', name: 'All Lessons', icon: 'book', color: '#1976D2' },
    { id: 'introduction', name: 'Introduction', icon: 'globe', color: '#4CAF50' },
    { id: 'typing', name: 'Typing', icon: 'computer', color: '#FF9800' },
    { id: 'safety', name: 'Safety', icon: 'shield', color: '#F44336' },
    { id: 'coding', name: 'Coding', icon: 'puzzle', color: '#9C27B0' },
    { id: 'creative', name: 'Creative', icon: 'palette', color: '#E91E63' }
  ]

  useEffect(() => {
    if (selectedModule === 'all') {
      setFilteredLessons(lessons)
    } else {
      setFilteredLessons(getLessonsByModule(selectedModule))
    }
  }, [selectedModule, lessons])

  const completedLessons = getCompletedLessons()
  const pendingLessons = getPendingLessons()
  const totalProgress = Math.round((completedLessons.length / lessons.length) * 100)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50'
      case 'intermediate': return '#FF9800'
      case 'advanced': return '#F44336'
      default: return '#9E9E9E'
    }
  }

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '🟢'
      case 'intermediate': return '🟡'
      case 'advanced': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div className="my-lessons-page">
      {/* CodePlay-style header */}
      <div className="lesson-header codeplay-header">
        <div className="header-left">
          <h1 className="codeplay-title">CodePlay</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <div className="avatar">
              <Icon name="book" size={24} />
            </div>
            <span className="user-name">My Lessons</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lesson-content">
        {/* Progress Overview */}
        <div className="progress-overview">
          <ProgressTracker 
            currentProgress={completedLessons.length}
            totalItems={lessons.length}
            showStats={true}
            showLevel={true}
          />
        </div>

        {/* Module Filter */}
        <div className="module-filter">
          <h3>Filter by Module</h3>
          <div className="module-buttons">
            {modules.map(module => (
              <button
                key={module.id}
                className={`module-button ${selectedModule === module.id ? 'active' : ''}`}
                style={{ borderColor: module.color }}
                onClick={() => setSelectedModule(module.id)}
              >
                <span className="module-icon">
                  <Icon name={module.icon} size={20} />
                </span>
                <span className="module-name">{module.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Kid-Friendly Lessons Grid */}
        <div className="kid-lessons-grid">
          {filteredLessons.map(lesson => (
            <div key={lesson.id} className={`kid-lesson-card ${lesson.isCompleted ? 'completed' : 'pending'}`}>
              {/* Big Icon */}
              <div className="kid-lesson-icon">
                <div className="big-icon-container">
                  {lesson.moduleType === 'introduction' && <span className="big-emoji">🌍</span>}
                  {lesson.moduleType === 'typing' && <span className="big-emoji">⌨️</span>}
                  {lesson.moduleType === 'safety' && <span className="big-emoji">🛡️</span>}
                  {lesson.moduleType === 'coding' && <span className="big-emoji">🧩</span>}
                  {lesson.moduleType === 'creative' && <span className="big-emoji">🎨</span>}
                  {!['introduction', 'typing', 'safety', 'coding', 'creative'].includes(lesson.moduleType) && 
                    <span className="big-emoji">📚</span>}
                </div>
                
                {/* Status Badge */}
                <div className="kid-status-badge">
                  {lesson.isCompleted ? (
                    <span className="completed-emoji">✅</span>
                  ) : (
                    <span className="pending-emoji">⏰</span>
                  )}
                </div>
              </div>

              {/* Small Course Title */}
              <div className="kid-lesson-title">
                <h4>{lesson.title}</h4>
              </div>

              {/* Simple Action Button */}
              <div className="kid-lesson-action">
                {lesson.isCompleted ? (
                  <button className="kid-review-btn">
                    <span className="btn-emoji">🔄</span>
                    Review
                  </button>
                ) : (
                  <button className="kid-start-btn">
                    <span className="btn-emoji">▶️</span>
                    Start
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <Icon name="check" size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{completedLessons.length}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <Icon name="clock" size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{pendingLessons.length}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <Icon name="star" size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">
                {completedLessons.reduce((sum, lesson) => sum + lesson.points, 0)}
              </div>
              <div className="stat-label">Points Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
