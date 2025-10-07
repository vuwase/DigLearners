import React, { useState } from 'react'
import { useTranslation } from '../../lib/language'
import { mockBadges, mockAchievements, getEarnedBadges, getPendingBadges, formatDate } from '../../services/mockDataService'
import AchievementNotification from '../../components/AchievementNotification'
import Icon from '../../components/icons/Icon'

export default function Achievements() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showNotification, setShowNotification] = useState(false)
  const [currentBadge, setCurrentBadge] = useState(null)

  const categories = [
    { id: 'all', name: 'All Badges', icon: 'achievement', color: '#FF677D' },
    { id: 'achievement', name: 'Achievements', icon: 'target', color: '#F8B400' },
    { id: 'milestone', name: 'Milestones', icon: 'progress', color: '#B9FBC0' },
    { id: 'special', name: 'Special', icon: 'star', color: '#FFB3BA' }
  ]

  const getFilteredBadges = () => {
    if (selectedCategory === 'all') {
      return mockBadges
    }
    return mockBadges.filter(badge => badge.category === selectedCategory)
  }

  const simulateAchievement = (badge) => {
    setCurrentBadge(badge)
    setShowNotification(true)
  }

  const handleNotificationClose = () => {
    setShowNotification(false)
    setCurrentBadge(null)
  }

  const earnedBadges = getEarnedBadges()
  const pendingBadges = getPendingBadges()
  const completionRate = Math.round((earnedBadges.length / mockBadges.length) * 100)

  return (
    <div className="kid-achievements-page">
      {/* Achievement Notification */}
      {showNotification && (
        <AchievementNotification
          badge={currentBadge}
          points={currentBadge?.points}
          isVisible={showNotification}
          onClose={handleNotificationClose}
        />
      )}

      <div className="achievements-header">
        <div className="header-content">
          <h1>🏆 My Amazing Badges!</h1>
          <p>Look at all the cool badges you've earned! Keep learning to get more! 🌟</p>
        </div>
        <div className="kid-avatar">
          <div className="avatar-circle">👦</div>
          <div className="kid-info">
            <h3>Alex</h3>
            <p>Badge Collector</p>
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="achievement-stats">
        <div className="stat-card stat-1">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>{earnedBadges.length}</h3>
            <p>Badges Earned!</p>
          </div>
        </div>
        <div className="stat-card stat-2">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{completionRate}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>
        <div className="stat-card stat-3">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{earnedBadges.reduce((sum, badge) => sum + badge.points, 0)}</h3>
            <p>Points from Badges!</p>
          </div>
        </div>
        <div className="stat-card stat-4">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{pendingBadges.length}</h3>
            <p>Available Badges</p>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="recent-achievements-section">
        <h2>🎉 Recent Achievements</h2>
        <div className="recent-badges-grid">
          {mockAchievements.recentAchievements.map(achievement => (
            <div key={achievement.id} className="recent-badge-card">
              <div className="badge-icon-large">{achievement.icon}</div>
              <div className="badge-info">
                <h4>{achievement.name}</h4>
                <p>Earned {formatDate(achievement.earnedAt)}</p>
              </div>
              <button 
                className="celebrate-btn"
                onClick={() => simulateAchievement(achievement)}
              >
                🎉 Celebrate!
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter-section">
        <h2>🔍 Filter by Category</h2>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              style={{ 
                backgroundColor: selectedCategory === category.id ? category.color : 'white',
                borderColor: category.color,
                color: selectedCategory === category.id ? 'white' : category.color
              }}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-emoji">
                {category.id === 'all' ? '🏆' : 
                 category.id === 'achievement' ? '🎯' :
                 category.id === 'milestone' ? '📈' : '⭐'}
              </span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Badge Collection */}
      <div className="badge-collection-section">
        <h2>🏆 Badge Collection</h2>
        <div className="badges-grid">
          {getFilteredBadges().map(badge => (
            <div 
              key={badge.id} 
              className={`badge-card ${badge.isEarned ? 'earned' : 'locked'}`}
            >
              <div className="badge-card-header">
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-name">{badge.name}</div>
              </div>
              
              <div className="badge-description">{badge.description}</div>
              
              <div className="badge-points">
                <span className="points-badge">+{badge.points} pts</span>
              </div>
              
              {badge.isEarned ? (
                <div className="badge-earned">
                  <div className="earned-date">
                    ✅ Earned {formatDate(badge.earnedAt)}
                  </div>
                  <button 
                    className="celebrate-button"
                    onClick={() => simulateAchievement(badge)}
                  >
                    🎉 Celebrate!
                  </button>
                </div>
              ) : (
                <div className="badge-locked">
                  <div className="locked-icon">🔒</div>
                  <div className="locked-text">
                    Keep learning to unlock! Complete more lessons to earn this badge!
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Tips */}
      <div className="achievement-tips-section">
        <h2>💡 Tips to Earn More Badges!</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">📚</div>
            <div className="tip-content">
              <h4>Complete Lessons</h4>
              <p>Finish lessons to earn achievement badges!</p>
            </div>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">🔥</div>
            <div className="tip-content">
              <h4>Maintain Streaks</h4>
              <p>Learn daily to earn streak badges!</p>
            </div>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">⭐</div>
            <div className="tip-content">
              <h4>Perfect Scores</h4>
              <p>Get 100% on lessons for special badges!</p>
            </div>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">🏆</div>
            <div className="tip-content">
              <h4>Top Rankings</h4>
              <p>Be among the top performers weekly!</p>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .kid-achievements-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #FFB3BA, #B9FBC0);
            padding: 2rem;
            font-family: 'Comic Sans MS', cursive, sans-serif;
          }

          .achievements-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            padding: 2rem;
            border-radius: 25px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .header-content h1 {
            color: #2D3748;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }

          .header-content p {
            color: #4A5568;
            font-size: 1.2rem;
            margin: 0;
          }

          .kid-avatar {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .avatar-circle {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #FF677D, #F8B400);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }

          .kid-info h3 {
            color: #2D3748;
            font-size: 1.5rem;
            margin: 0 0 0.25rem 0;
          }

          .kid-info p {
            color: #4A5568;
            margin: 0;
          }

          .achievement-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

           .stat-card {
             background: white;
             padding: 1.5rem;
             border-radius: 20px;
             display: flex;
             align-items: center;
             gap: 1rem;
             box-shadow: 0 4px 15px rgba(0,0,0,0.1);
             transition: transform 0.3s ease;
             border-left: 5px solid;
             min-height: 120px;
             justify-content: space-between;
           }

           .stat-card:hover {
             transform: translateY(-5px);
           }

           .stat-1 { border-left-color: #FF677D; }
           .stat-2 { border-left-color: #F8B400; }
           .stat-3 { border-left-color: #B9FBC0; }
           .stat-4 { border-left-color: #FFB3BA; }

           .stat-icon {
             font-size: 2.5rem;
             filter: none;
             opacity: 1;
             text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
             display: block;
             color: inherit;
           }

           .stat-content h3 {
             color: #2D3748;
             font-size: 2rem;
             margin: 0 0 0.5rem 0;
             font-weight: bold;
             line-height: 1;
           }

           .stat-content p {
             color: #4A5568;
             margin: 0;
             font-size: 0.9rem;
             line-height: 1.2;
             font-weight: 600;
             text-align: center;
           }

          .recent-achievements-section {
            background: white;
            padding: 2rem;
            border-radius: 25px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .recent-achievements-section h2 {
            color: #2D3748;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .recent-badges-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }

          .recent-badge-card {
            background: linear-gradient(135deg, #F8F9FA, #E8F5E8);
            padding: 1.5rem;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 1rem;
            border: 3px solid #E2E8F0;
            transition: all 0.3s ease;
          }

          .recent-badge-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          }

           .badge-icon-large {
             font-size: 3rem;
             filter: none;
             opacity: 1;
             text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
             display: block;
             color: inherit;
           }

          .badge-info h4 {
            color: #2D3748;
            font-size: 1.2rem;
            margin: 0 0 0.25rem 0;
          }

          .badge-info p {
            color: #4A5568;
            margin: 0;
            font-size: 0.9rem;
          }

          .celebrate-btn {
            background: #FF677D;
            color: white;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 15px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
          }

          .celebrate-btn:hover {
            background: #E53E3E;
            transform: translateY(-2px);
          }

          .category-filter-section {
            background: white;
            padding: 2rem;
            border-radius: 25px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .category-filter-section h2 {
            color: #2D3748;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .category-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
          }

          .category-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem 1.5rem;
            border: 3px solid;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
          }

          .category-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          }

          .category-emoji {
            font-size: 1.2rem;
          }

          .badge-collection-section {
            background: white;
            padding: 2rem;
            border-radius: 25px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .badge-collection-section h2 {
            color: #2D3748;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .badges-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }

           .badge-card {
             background: linear-gradient(135deg, #F8F9FA, #E8F5E8);
             border: 3px solid #E2E8F0;
             border-radius: 20px;
             padding: 1.5rem;
             transition: all 0.3s ease;
             position: relative;
             overflow: hidden;
             display: flex;
             flex-direction: column;
             align-items: center;
             text-align: center;
             min-height: 200px;
             justify-content: space-between;
           }

           .badge-card.earned {
             border-color: #4CAF50;
             background: linear-gradient(135deg, #E8F5E8, #F1F8E9);
           }

           .badge-card.locked {
             border-color: #E2E8F0;
             background: linear-gradient(135deg, #F8F9FA, #FFFFFF);
             opacity: 1;
           }

           .badge-card:hover {
             transform: translateY(-3px);
             box-shadow: 0 8px 25px rgba(0,0,0,0.2);
           }

           .badge-card-header {
             display: flex;
             flex-direction: column;
             align-items: center;
             gap: 0.5rem;
             margin-bottom: 1rem;
             width: 100%;
           }

           .badge-icon {
             font-size: 3rem;
             margin-bottom: 0.5rem;
             filter: none;
             opacity: 1;
             text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
             display: block;
             color: inherit;
           }

           /* Specific icon styling for different badge types */
           .badge-card.earned .badge-icon {
             filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
             opacity: 1;
           }

           .badge-card.locked .badge-icon {
             filter: grayscale(0.3) drop-shadow(0 1px 2px rgba(0,0,0,0.1));
             opacity: 0.8;
           }

           .badge-name {
             color: #2D3748 !important;
             font-size: 1.1rem;
             font-weight: bold;
             margin: 0 0 0.5rem 0;
             line-height: 1.2;
             text-align: center;
           }

           .badge-description {
             color: #4A5568 !important;
             font-size: 0.85rem;
             margin: 0;
             line-height: 1.3;
             font-weight: 500;
             text-align: center;
             max-width: 200px;
             word-wrap: break-word;
           }

           .badge-points {
             margin-bottom: 1rem;
             width: 100%;
             display: flex;
             justify-content: center;
           }

           .points-badge {
             background: #1976D2;
             color: white !important;
             padding: 0.5rem 1rem;
             border-radius: 20px;
             font-weight: bold;
             font-size: 0.9rem;
           }

           .badge-earned {
             text-align: center;
             width: 100%;
             margin-top: auto;
           }

           .earned-date {
             color: #4CAF50 !important;
             font-weight: bold;
             margin-bottom: 0.75rem;
             font-size: 0.85rem;
           }

           .celebrate-button {
             background: #4CAF50;
             color: white !important;
             border: none;
             padding: 0.6rem 1rem;
             border-radius: 15px;
             font-weight: bold;
             cursor: pointer;
             transition: all 0.3s ease;
             font-size: 0.85rem;
             width: 100%;
             max-width: 150px;
           }

           .celebrate-button:hover {
             background: #45A049;
             transform: translateY(-2px);
           }

           .badge-locked {
             text-align: center;
             width: 100%;
             margin-top: auto;
           }

           .locked-icon {
             font-size: 2rem;
             margin-bottom: 0.5rem;
           }

           .locked-text {
             color: #2D3748 !important;
             font-size: 0.8rem;
             line-height: 1.3;
             font-weight: 600;
             max-width: 180px;
             margin: 0 auto;
           }

           /* Ensure all text in badge cards is visible */
           .badge-card * {
             color: inherit;
           }

           .badge-card h4,
           .badge-card .badge-name {
             color: #2D3748 !important;
           }

           .badge-card p,
           .badge-card .badge-description {
             color: #4A5568 !important;
           }

           .badge-card .points-badge {
             color: white !important;
           }

           .badge-card .earned-date {
             color: #4CAF50 !important;
           }

           .badge-card .locked-text {
             color: #2D3748 !important;
           }

           .badge-card .celebrate-button {
             color: white !important;
           }

           /* Specific styling for locked badge cards */
           .badge-card.locked .badge-name {
             color: #2D3748 !important;
             font-weight: 700;
           }

           .badge-card.locked .badge-description {
             color: #4A5568 !important;
             font-weight: 600;
           }

           .badge-card.locked .points-badge {
             background: #6B7280 !important;
             color: white !important;
             font-weight: 600;
           }

           .badge-card.locked .locked-icon {
             color: #6B7280 !important;
           }

           /* Force all icons to be visible and properly colored */
           .badge-card .badge-icon,
           .recent-badge-card .badge-icon-large,
           .stat-card .stat-icon,
           .tip-card .tip-icon {
             opacity: 1 !important;
             filter: none !important;
             color: inherit !important;
             text-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
             display: block !important;
             visibility: visible !important;
           }

           /* Specific colors for different icon types */
           .badge-card.earned .badge-icon {
             color: #4CAF50 !important;
             text-shadow: 0 2px 4px rgba(76, 175, 80, 0.3) !important;
           }

           .badge-card.locked .badge-icon {
             color: #6B7280 !important;
             text-shadow: 0 1px 2px rgba(107, 114, 128, 0.3) !important;
           }

           .recent-badge-card .badge-icon-large {
             color: #1976D2 !important;
             text-shadow: 0 2px 4px rgba(25, 118, 210, 0.3) !important;
           }

           .stat-card .stat-icon {
             color: #2D3748 !important;
             text-shadow: 0 2px 4px rgba(45, 55, 72, 0.2) !important;
           }

           .tip-card .tip-icon {
             color: #4CAF50 !important;
             text-shadow: 0 2px 4px rgba(76, 175, 80, 0.3) !important;
           }

          .achievement-tips-section {
            background: white;
            padding: 2rem;
            border-radius: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .achievement-tips-section h2 {
            color: #2D3748;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .tips-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }

          .tip-card {
            background: linear-gradient(135deg, #F8F9FA, #E8F5E8);
            padding: 1.5rem;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 1rem;
            border: 3px solid #E2E8F0;
            transition: all 0.3s ease;
          }

          .tip-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          }

          .tip-icon {
            font-size: 2.5rem;
          }

          .tip-content h4 {
            color: #2D3748;
            font-size: 1.1rem;
            margin: 0 0 0.25rem 0;
          }

          .tip-content p {
            color: #4A5568;
            margin: 0;
            font-size: 0.9rem;
            line-height: 1.4;
          }

          @media (max-width: 768px) {
            .kid-achievements-page {
              padding: 1rem;
            }

            .achievements-header {
              flex-direction: column;
              text-align: center;
              gap: 1rem;
            }

            .header-content h1 {
              font-size: 2rem;
            }

            .badges-grid {
              grid-template-columns: 1fr;
            }

            .category-buttons {
              flex-direction: column;
            }
          }
        `
      }} />
    </div>
  )
}