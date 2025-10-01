import React, { useState, useEffect } from 'react'
import { gamificationManager } from '../lib/gamification'
import MyComponent from '../components/MyComponent'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([])
  const [activeTab, setActiveTab] = useState('overall')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboards()
  }, [])

  const loadLeaderboards = async () => {
    try {
      const overall = await gamificationManager.getLeaderboard(10)
      const weekly = await gamificationManager.getWeeklyLeaderboard(10)
      setLeaderboard(overall)
      setWeeklyLeaderboard(weekly)
    } catch (error) {
      console.error('Error loading leaderboards:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getLevelColor = (level) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#795548']
    return colors[(level - 1) % colors.length]
  }

  if (loading) {
    return (
      <MyComponent title="Leaderboard" subtitle="Loading rankings...">
        <div className="loading">Loading leaderboard...</div>
      </MyComponent>
    )
  }

  const currentLeaderboard = activeTab === 'overall' ? leaderboard : weeklyLeaderboard

  return (
    <MyComponent title="Leaderboard" subtitle="Top performers">
      {/* Tab Navigation */}
      <div className="leaderboard-tabs">
        <button 
          className={`tab ${activeTab === 'overall' ? 'active' : ''}`}
          onClick={() => setActiveTab('overall')}
        >
          All Time
        </button>
        <button 
          className={`tab ${activeTab === 'weekly' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          This Week
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="leaderboard-list">
        {currentLeaderboard.length === 0 ? (
          <div className="no-data">
            <p>No data available yet. Complete some lessons to appear on the leaderboard!</p>
          </div>
        ) : (
          currentLeaderboard.map((student, index) => (
            <div key={student.userId} className="leaderboard-item">
              <div className="rank">
                <span className="rank-icon">{getRankIcon(student.rank)}</span>
              </div>
              
              <div className="student-info">
                <div className="student-name">
                  Student {student.userId.split('-').pop()}
                </div>
                <div className="student-level" style={{ color: getLevelColor(student.level) }}>
                  Level {student.level}
                </div>
              </div>
              
              <div className="stats">
                <div className="points">
                  {student.totalPoints} pts
                </div>
                <div className="badges">
                  {student.badges.length} badges
                </div>
              </div>
              
              <div className="progress-indicators">
                <div className="lessons-completed">
                  📚 {student.lessonsCompleted}
                </div>
                <div className="streak">
                  🔥 {student.streak}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Motivational Message */}
      <div className="motivational-message">
        <h3>Keep Learning! 🚀</h3>
        <p>
          {activeTab === 'overall' 
            ? "Complete more lessons and earn badges to climb the leaderboard!"
            : "Stay active this week to maintain your position on the weekly leaderboard!"
          }
        </p>
      </div>
    </MyComponent>
  )
}
