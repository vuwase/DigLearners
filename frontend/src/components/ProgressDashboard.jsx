import React, { useState, useEffect } from 'react'
import { useTranslation } from '../lib/language'
import { gamificationManager } from '../lib/gamification'
import Icon from './icons/Icon'
import './CodePlayStyles.css'

export default function ProgressDashboard({ userId = 'demo-student-1' }) {
  const { t } = useTranslation()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [userId])

  const loadProgress = async () => {
    try {
      const userProgress = await gamificationManager.getUserProgress(userId)
      setProgress(userProgress)
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="progress-dashboard">
        <div className="loading">Loading progress...</div>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="progress-dashboard">
        <div className="no-progress">No progress data available</div>
      </div>
    )
  }

  const modules = [
    {
      id: 'introduction',
      name: 'Introduction',
      completed: progress.lessonsCompleted >= 3,
      progress: Math.min((progress.lessonsCompleted / 3) * 100, 100)
    },
    {
      id: 'sequences',
      name: 'Sequences',
      completed: progress.codingPuzzles >= 5,
      progress: Math.min((progress.codingPuzzles / 5) * 100, 100)
    },
    {
      id: 'loops',
      name: 'Loops',
      completed: progress.typingLessons >= 3,
      progress: Math.min((progress.typingLessons / 3) * 100, 100)
    }
  ]

  const challengesCompleted = progress.lessonsCompleted + progress.codingPuzzles + progress.typingLessons
  const overallProgress = Math.round((challengesCompleted / 20) * 100) // Assuming 20 total challenges

  return (
    <div className="progress-dashboard">
      {/* CodePlay-style header */}
      <div className="lesson-header codeplay-header">
        <div className="header-left">
          <h1 className="codeplay-title">CodePlay</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <div className="avatar">
              <Icon name="teacher" size={24} />
            </div>
            <span className="user-name">Hello, Mrs. A</span>
          </div>
        </div>
      </div>

      {/* Main dashboard content */}
      <div className="lesson-content">
        {/* Progress Overview */}
        <div className="progress-overview">
          <div className="progress-header">
            <h2>Progress</h2>
            <div className="progress-icon">
              <Icon name="analytics" size={24} />
            </div>
          </div>
          
          <div className="progress-stats">
            <div className="challenges-completed">
              <div className="stat-number">{challengesCompleted}</div>
              <div className="stat-label">Challenges completed</div>
            </div>
            
            <div className="overall-progress">
              <div className="progress-percentage">{overallProgress}%</div>
              <div className="progress-label">Overall progress</div>
            </div>
          </div>
        </div>

        {/* Module Overview */}
        <div className="module-overview">
          <div className="module-header">
            <h2>Module Overview</h2>
          </div>
          
          <div className="modules-list">
            {modules.map((module) => (
              <div key={module.id} className="module-item">
                <div className="module-info">
                  <div className="module-name">{module.name}</div>
                  <div className="module-status">
                    {module.completed ? (
                      <span className="completed-badge">
                        <Icon name="check" size={16} />
                      </span>
                    ) : (
                      <span className="in-progress-badge">
                        <Icon name="recent" size={16} />
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="module-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">{Math.round(module.progress)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="recent-achievements">
          <div className="achievements-header">
            <h2>Recent Achievements</h2>
          </div>
          
          <div className="badges-grid">
            {progress.badges.slice(-3).map((badgeId, index) => {
              const badge = Object.values(require('../lib/gamification').BADGES).find(b => b.id === badgeId)
              if (!badge) return null
              
              return (
                <div key={index} className="badge-item">
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-info">
                    <div className="badge-name">{badge.name}</div>
                    <div className="badge-description">{badge.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Level Information */}
        <div className="level-info">
          <div className="current-level">
            <div className="level-badge">
              <div className="level-number">{progress.level}</div>
              <div className="level-name">Level {progress.level}</div>
            </div>
            
            <div className="level-progress">
              <div className="level-points">{progress.totalPoints} points</div>
              <div className="next-level">
                {progress.level < 6 ? `Next level in ${100 - (progress.totalPoints % 100)} points` : 'Max level reached!'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
