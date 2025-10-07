import React, { useState } from 'react'
import { useTranslation } from '../../lib/language'
import { mockLeaderboard, mockClassProgress } from '../../services/mockDataService'
import Icon from '../../components/icons/Icon'
import '../../components/CodePlayStyles.css'
import '../../components/DashboardStyles.css'

export default function Leaderboard() {
  const { t } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = useState('weekly')
  const [leaderboard] = useState(mockLeaderboard)
  const [classProgress] = useState(mockClassProgress)

  const periods = [
    { id: 'weekly', name: 'This Week', icon: 'calendar' },
    { id: 'monthly', name: 'This Month', icon: 'calendar' },
    { id: 'alltime', name: 'All Time', icon: 'achievement' }
  ]

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Icon name="trophy" size={20} />
      case 2: return <Icon name="trophy" size={20} />
      case 3: return <Icon name="trophy" size={20} />
      default: return `#${rank}`
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700'
      case 2: return '#C0C0C0'
      case 3: return '#CD7F32'
      default: return '#666'
    }
  }

  const getLevelColor = (level) => {
    if (level >= 5) return '#4CAF50'
    if (level >= 3) return '#FF9800'
    return '#2196F3'
  }

  return (
    <div className="leaderboard-page">
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
            <span className="user-name">Leaderboard</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lesson-content">
        {/* Class Overview */}
        <div className="class-overview">
          <div className="class-header">
            <h2>
              <Icon name="book" size={20} style={{ marginRight: '8px' }} />
              {classProgress.className}
            </h2>
            <p>Teacher: {classProgress.teacher}</p>
          </div>
          
          <div className="class-stats">
            <div className="class-stat">
              <div className="stat-icon">
                <Icon name="users" size={20} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{classProgress.totalStudents}</div>
                <div className="stat-label">Students</div>
              </div>
            </div>
            
            <div className="class-stat">
              <div className="stat-icon">
                <Icon name="progress" size={20} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{classProgress.averageProgress}%</div>
                <div className="stat-label">Avg Progress</div>
              </div>
            </div>
            
            <div className="class-stat">
              <div className="stat-icon">
                <Icon name="star" size={20} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{classProgress.classStats.averageScore}</div>
                <div className="stat-label">Avg Score</div>
              </div>
            </div>
            
            <div className="class-stat">
              <div className="stat-icon">
                <Icon name="clock" size={20} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{classProgress.classStats.totalTimeSpent}h</div>
                <div className="stat-label">Total Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Period Filter */}
        <div className="period-filter">
          <h3>Leaderboard Period</h3>
          <div className="period-buttons">
            {periods.map(period => (
              <button
                key={period.id}
                className={`period-button ${selectedPeriod === period.id ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(period.id)}
              >
                <span className="period-icon">
                  <Icon name={period.icon} size={16} />
                </span>
                <span className="period-name">{period.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="top-performers">
          <h3>🌟 Top Performers</h3>
          <div className="top-three">
            {leaderboard.slice(0, 3).map((student, index) => (
              <div key={student.studentId} className={`podium-item rank-${index + 1}`}>
                <div className="podium-rank">
                  <span className="rank-icon">{getRankIcon(index + 1)}</span>
                </div>
                <div className="podium-avatar">
                  <div className="avatar-large">{student.avatar}</div>
                </div>
                <div className="podium-info">
                  <div className="student-name">{student.name}</div>
                  <div className="student-points">{student.points} points</div>
                  <div className="student-level">Level {student.level}</div>
                </div>
                <div className="podium-stats">
                  <div className="stat-item">
                    <span className="stat-icon">
                      <Icon name="book" size={16} />
                    </span>
                    <span className="stat-value">{student.lessonsCompleted}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon"><Icon name="lightning" size={16} /></span>
                    <span className="stat-value">{student.streak}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon"><Icon name="achievement" size={16} /></span>
                    <span className="stat-value">{student.badges}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="full-leaderboard">
          <h3>
            <Icon name="analytics" size={20} style={{ marginRight: '8px' }} />
            Complete Rankings
          </h3>
          <div className="leaderboard-list">
            {leaderboard.map((student, index) => (
              <div key={student.studentId} className={`leaderboard-item ${index < 3 ? 'top-three-item' : ''}`}>
                <div className="rank-section">
                  <span 
                    className="rank-number"
                    style={{ color: getRankColor(index + 1) }}
                  >
                    {getRankIcon(index + 1)}
                  </span>
                </div>
                
                <div className="student-section">
                  <div className="student-avatar">{student.avatar}</div>
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                    <div className="student-details">
                      Level {student.level} • {student.lessonsCompleted} lessons
                    </div>
                  </div>
                </div>
                
                <div className="points-section">
                  <div className="points-value">{student.points}</div>
                  <div className="points-label">points</div>
                </div>
                
                <div className="stats-section">
                  <div className="stat-item">
                    <span className="stat-icon"><Icon name="lightning" size={16} /></span>
                    <span className="stat-value">{student.streak}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon"><Icon name="achievement" size={16} /></span>
                    <span className="stat-value">{student.badges}</span>
                  </div>
                </div>
                
                <div className="level-section">
                  <div 
                    className="level-badge"
                    style={{ backgroundColor: getLevelColor(student.level) }}
                  >
                    L{student.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Highlights */}
        <div className="achievement-highlights">
          <h3>
            <Icon name="star" size={20} style={{ marginRight: '8px' }} />
            Recent Achievements
          </h3>
          <div className="achievements-grid">
            <div className="achievement-item">
              <div className="achievement-icon"><Icon name="achievement" size={16} /></div>
              <div className="achievement-info">
                <div className="achievement-title">Weekly Champion</div>
                <div className="achievement-student">Alex K.</div>
              </div>
            </div>
            
            <div className="achievement-item">
              <div className="achievement-icon"><Icon name="lightning" size={16} /></div>
              <div className="achievement-info">
                <div className="achievement-title">7-Day Streak</div>
                <div className="achievement-student">Alex K.</div>
              </div>
            </div>
            
            <div className="achievement-item">
              <div className="achievement-icon">
                <Icon name="star" size={16} />
              </div>
              <div className="achievement-info">
                <div className="achievement-title">Perfect Score</div>
                <div className="achievement-student">Grace M.</div>
              </div>
            </div>
            
            <div className="achievement-item">
              <div className="achievement-icon">
                <Icon name="puzzle" size={16} />
              </div>
              <div className="achievement-info">
                <div className="achievement-title">Code Breaker</div>
                <div className="achievement-student">David R.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
