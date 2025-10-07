import React, { useState, useEffect } from 'react'
import { useTranslation } from '../lib/language'
import { gamificationManager, BADGES } from '../lib/gamification'
import AchievementNotification from './AchievementNotification'
import Icon from './icons/Icon'
import './CodePlayStyles.css'

export default function GamificationDashboard({ userId = 'demo-student-1' }) {
  const { t } = useTranslation()
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [currentBadge, setCurrentBadge] = useState(null)
  const [currentPoints, setCurrentPoints] = useState(0)

  useEffect(() => {
    loadUserProgress()
  }, [userId])

  const loadUserProgress = async () => {
    try {
      const progress = await gamificationManager.getUserProgress(userId)
      setUserProgress(progress)
    } catch (error) {
      console.error('Error loading user progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const simulateAchievement = () => {
    const randomBadge = Object.values(BADGES)[Math.floor(Math.random() * Object.values(BADGES).length)]
    setCurrentBadge(randomBadge)
    setCurrentPoints(randomBadge.points)
    setShowNotification(true)
  }

  const handleNotificationClose = () => {
    setShowNotification(false)
    setCurrentBadge(null)
    setCurrentPoints(0)
  }

  if (loading) {
    return (
      <div className="gamification-dashboard">
        <div className="loading">Loading gamification data...</div>
      </div>
    )
  }

  if (!userProgress) {
    return (
      <div className="gamification-dashboard">
        <div className="no-data">No gamification data available</div>
      </div>
    )
  }

  const earnedBadges = userProgress.badges || []
  const allBadges = Object.values(BADGES)
  const progressToNextLevel = userProgress.totalPoints % 100
  const levelProgress = (progressToNextLevel / 100) * 360

  return (
    <div className="gamification-dashboard">
      {/* Achievement Notification */}
      {showNotification && (
        <AchievementNotification
          badge={currentBadge}
          points={currentPoints}
          isVisible={showNotification}
          onClose={handleNotificationClose}
        />
      )}

      {/* CodePlay-style header */}
      <div className="lesson-header codeplay-header">
        <div className="header-left">
          <h1 className="codeplay-title">CodePlay</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <div className="avatar">
              <Icon name="achievement" size={24} />
            </div>
            <span className="user-name">Achievements</span>
          </div>
        </div>
      </div>

      {/* Main dashboard content */}
      <div className="lesson-content">
        {/* Points and Level Display */}
        <div className="points-display">
          <h3>Your Progress</h3>
          <div className="points-value">{userProgress.totalPoints}</div>
          <div className="points-label">Total Points</div>
        </div>

        {/* Level Progress Ring */}
        <div className="level-ring">
          <svg>
            <circle
              className="level-ring-circle"
              cx="40"
              cy="40"
              r="32"
            />
            <circle
              className="level-ring-progress"
              cx="40"
              cy="40"
              r="32"
              strokeDasharray={`${levelProgress} 360`}
            />
          </svg>
          <div className="level-ring-text">
            <div className="level-ring-number">{userProgress.level}</div>
            <div className="level-ring-label">Level</div>
          </div>
        </div>

        {/* User Stats */}
        <div className="user-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Icon name="lightning" size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userProgress.streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Icon name="target" size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userProgress.lessonsCompleted}</div>
              <div className="stat-label">Lessons</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Icon name="puzzle" size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userProgress.codingPuzzles}</div>
              <div className="stat-label">Puzzles</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Icon name="star" size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userProgress.perfectScores}</div>
              <div className="stat-label">Perfect</div>
            </div>
          </div>
        </div>

        {/* Badge Collection */}
        <div className="badge-collection">
          <h3>Badge Collection</h3>
          <div className="badges-grid">
            {allBadges.map((badge) => {
              const isEarned = earnedBadges.includes(badge.id)
              return (
                <div 
                  key={badge.id} 
                  className={`badge-card ${isEarned ? 'earned' : 'locked'}`}
                >
                  <div className="badge-card-icon">{badge.icon}</div>
                  <div className="badge-card-name">{badge.name}</div>
                  <div className="badge-card-description">{badge.description}</div>
                  <div className="badge-card-points">+{badge.points} pts</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Demo Achievement Button */}
        <div className="demo-section">
          <button 
            className="demo-button"
            onClick={simulateAchievement}
          >
            <Icon name="star" size={16} style={{ marginRight: '8px' }} />
            Test Achievement Notification
          </button>
        </div>
      </div>
    </div>
  )
}
