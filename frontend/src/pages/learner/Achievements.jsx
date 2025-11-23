import React, { useState, useEffect } from 'react'
import { useTranslation } from '../../lib/language'
import { useAuth } from '../../contexts/AuthContext'
import learnerApiService from '../../services/learnerApiService'
import AchievementNotification from '../../components/AchievementNotification'
import StudentProfile from '../../components/student/StudentProfile'
import Icon from '../../components/icons/Icon'
import '../../components/CodePlayStyles.css'

export default function Achievements() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showNotification, setShowNotification] = useState(false)
  const [currentBadge, setCurrentBadge] = useState(null)
  const [badges, setBadges] = useState([])
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAchievements()
    
    // Refresh achievements if there's a refresh flag (from game completion)
    const refreshFlag = localStorage.getItem('refreshAchievements')
    if (refreshFlag === 'true') {
      localStorage.removeItem('refreshAchievements')
      // Refresh after a short delay to ensure backend has processed
      setTimeout(() => {
        fetchAchievements()
      }, 1000)
    }
  }, [])

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      console.log('[Achievements] Fetching achievements...')
      const response = await learnerApiService.getAchievements()
      console.log('[Achievements] Full API response:', JSON.stringify(response, null, 2))
      
      // Handle different response formats
      const badgesData = response.data?.badges || response.badges || []
      const achievementsData = response.data?.achievements || response.achievements || []
      
      console.log('[Achievements] Badges data:', badgesData)
      console.log('[Achievements] Badges count:', badgesData.length)
      console.log('[Achievements] Earned badges:', badgesData.filter(b => b.isEarned))
      
      setBadges(badgesData)
      setAchievements(achievementsData)
      
      if (badgesData.length === 0) {
        console.warn('[Achievements] No badges found in response!')
      }
    } catch (err) {
      console.error('[Achievements] Error fetching achievements:', err)
      console.error('[Achievements] Error details:', err.message, err.stack)
      setError(err.message)
      // Set fallback data
      setBadges([])
      setAchievements([])
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'All Badges', icon: 'achievement', color: '#FF6B9D', bgGradient: 'linear-gradient(135deg, #FF6B9D, #FF8E9B)' },
    { id: 'achievement', name: 'Achievements', icon: 'target', color: '#FFB020', bgGradient: 'linear-gradient(135deg, #FFB020, #FFD700)' },
    { id: 'milestone', name: 'Milestones', icon: 'progress', color: '#4ECDC4', bgGradient: 'linear-gradient(135deg, #4ECDC4, #44E5E7)' },
    { id: 'special', name: 'Special', icon: 'star', color: '#C77DFF', bgGradient: 'linear-gradient(135deg, #C77DFF, #E0AAFF)' }
  ]

  const getFilteredBadges = () => {
    if (selectedCategory === 'all') {
      return badges
    }
    return badges.filter(badge => badge.category === selectedCategory)
  }

  const simulateAchievement = (badge) => {
    setCurrentBadge(badge)
    setShowNotification(true)
  }

  const handleNotificationClose = () => {
    setShowNotification(false)
    setCurrentBadge(null)
  }

  const earnedBadges = badges.filter(badge => badge.isEarned === true || badge.isEarned === 'true')
  const pendingBadges = badges.filter(badge => !badge.isEarned)
  const completionRate = badges.length > 0 ? Math.round((earnedBadges.length / badges.length) * 100) : 0
  
  // Debug logging
  console.log('[Achievements] Current badges state:', badges)
  console.log('[Achievements] Earned badges count:', earnedBadges.length)
  console.log('[Achievements] Earned badges:', earnedBadges)
  console.log('[Achievements] Total points:', earnedBadges.reduce((sum, badge) => sum + (badge.points || 0), 0))

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="kid-achievements-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading Achievements...</h2>
          <p>Fetching your badges and achievements...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="kid-achievements-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Achievements</h2>
          <p>{error}</p>
          <button onClick={fetchAchievements} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

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
          <h1>🏆 My Badges!</h1>
          <p>Awesome work! Keep learning! 🌟</p>
        </div>
        <div className="kid-avatar">
          <StudentProfile showFullProfile={false} />
          <div className="kid-info">
            <h3>{user?.fullName?.split(' ')[0] || 'Student'}</h3>
          </div>
        </div>
      </div>

      {/* Achievement Stats - Simplified */}
      <div className="achievement-stats">
        <div className="stat-card stat-1">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>{earnedBadges.length}</h3>
            <p>Badges!</p>
          </div>
        </div>
        <div className="stat-card stat-3">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{earnedBadges.reduce((sum, badge) => sum + (badge.points || 0), 0)}</h3>
            <p>Points!</p>
          </div>
        </div>
      </div>


      {/* Badge Collection - Simplified */}
      <div className="badge-collection-section">
        <h2>🏆 My Badges</h2>
        <div className="badges-grid">
          {getFilteredBadges().slice(0, 6).map(badge => (
            <div 
              key={badge.id} 
              className={`badge-card ${badge.isEarned ? 'earned' : 'locked'}`}
            >
              <div className="badge-card-header">
                <div className="badge-icon">{badge.icon || '🏆'}</div>
                <div className="badge-name">{badge.name}</div>
              </div>
              
              {badge.isEarned ? (
                <div className="badge-earned">
                  <div className="earned-date">✅ Got it!</div>
                  <button 
                    className="celebrate-button"
                    onClick={() => simulateAchievement(badge)}
                  >
                    🎉
                  </button>
                </div>
              ) : (
                <div className="badge-locked">
                  <div className="locked-icon">🔒</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .kid-achievements-page {
            min-height: 100vh;
            background: linear-gradient(180deg, #FFF0F7 0%, #FFE5F1 30%, #E8F4FD 70%, #D1E9FF 100%);
            padding: 2rem;
            padding-top: 3rem;
            margin-top: 0;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            position: relative;
            z-index: 1;
          }

          .achievements-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #FFFFFF, #F8F9FA);
            padding: 2rem;
            border-radius: 25px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(139, 92, 246, 0.1);
            border: 2px solid rgba(139, 92, 246, 0.1);
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
            background: linear-gradient(135deg, #FF6B9D, #FFB020, #4ECDC4);
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

           .stat-1 { border-left-color: #FF6B9D; background: linear-gradient(135deg, #FFF0F5, #FFEBF0, #FFFFFF); border-left-width: 6px; }
           .stat-2 { border-left-color: #FFB020; background: linear-gradient(135deg, #FFF8E1, #FFF4D6, #FFFFFF); border-left-width: 6px; }
           .stat-3 { border-left-color: #10B981; background: linear-gradient(135deg, #D1FAE5, #A7F3D0, #FFFFFF); border-left-width: 6px; }
           .stat-4 { border-left-color: #8B5CF6; background: linear-gradient(135deg, #EDE9FE, #DDD6FE, #FFFFFF); border-left-width: 6px; }

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
            background: linear-gradient(135deg, #FEF3C7, #FDE68A, #FFFFFF);
            padding: 1.5rem;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 1rem;
            border: 3px solid #FBBF24;
            box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4), 0 0 0 1px rgba(251, 191, 36, 0.1);
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
            background: linear-gradient(135deg, #FF6B9D, #FF8E9B);
            color: white;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 15px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
          }

          .celebrate-btn:hover {
            background: linear-gradient(135deg, #FF5785, #FF7A8A);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(255, 107, 157, 0.5);
          }

          .category-filter-section {
            background: linear-gradient(135deg, #FFFFFF, #F8F9FA);
            padding: 2rem;
            border-radius: 25px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            border: 2px solid rgba(255, 107, 157, 0.1);
          }

          .category-filter-section h2 {
            color: #2D3748 !important;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
            font-weight: 600;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
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
            color: inherit !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.15);
            position: relative;
            overflow: hidden;
            background: white;
          }

          .category-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
          }

          .category-btn:hover::before {
            left: 100%;
          }

          .category-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          }

          .category-btn.active {
            box-shadow: 0 4px 15px rgba(0,0,0,0.25);
          }

          .category-emoji {
            font-size: 1.2rem;
          }

          .badge-collection-section {
            background: linear-gradient(135deg, #FFFFFF, #F8F9FA);
            padding: 2rem;
            border-radius: 25px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            border: 2px solid rgba(139, 92, 246, 0.1);
          }

          .badge-collection-section h2 {
            color: #2D3748 !important;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
            font-weight: 600;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }

          .badges-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }

           .badge-card {
             background: linear-gradient(135deg, #FFFFFF, #F8F9FA);
             border: 3px solid #E5E7EB;
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
             border-color: #10B981;
             background: linear-gradient(135deg, #D1FAE5, #A7F3D0, #6EE7B7);
             box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4), 0 0 0 2px rgba(16, 185, 129, 0.1);
             border-width: 4px;
             animation: glow-pulse 2s ease-in-out infinite;
           }

           @keyframes glow-pulse {
             0%, 100% { box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4), 0 0 0 2px rgba(16, 185, 129, 0.1); }
             50% { box-shadow: 0 8px 30px rgba(16, 185, 129, 0.6), 0 0 0 4px rgba(16, 185, 129, 0.2); }
           }

           .badge-card.locked {
             border-color: #D1D5DB;
             background: linear-gradient(135deg, #F9FAFB, #F3F4F6);
             opacity: 0.9;
             position: relative;
           }

           .badge-card.locked::after {
             content: '';
             position: absolute;
             top: 0;
             left: 0;
             right: 0;
             bottom: 0;
             background: linear-gradient(135deg, rgba(255,255,255,0.6), rgba(243,244,246,0.4));
             pointer-events: none;
           }

           .badge-card.earned::before {
             content: '';
             position: absolute;
             top: -50%;
             left: -50%;
             width: 200%;
             height: 200%;
             background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
             animation: pulse 3s ease-in-out infinite;
           }

           @keyframes pulse {
             0%, 100% { transform: scale(1); opacity: 0.5; }
             50% { transform: scale(1.1); opacity: 0.8; }
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
             background: linear-gradient(135deg, #8B5CF6, #A78BFA);
             color: white !important;
             padding: 0.5rem 1rem;
             border-radius: 20px;
             font-weight: bold;
             font-size: 0.9rem;
             box-shadow: 0 3px 10px rgba(139, 92, 246, 0.4);
             text-shadow: 0 1px 2px rgba(0,0,0,0.2);
           }

           .badge-card.earned .points-badge {
             background: linear-gradient(135deg, #10B981, #34D399);
             box-shadow: 0 3px 12px rgba(16, 185, 129, 0.5);
             animation: shimmer 2s ease-in-out infinite;
           }

           @keyframes shimmer {
             0%, 100% { box-shadow: 0 3px 12px rgba(16, 185, 129, 0.5); }
             50% { box-shadow: 0 4px 16px rgba(16, 185, 129, 0.7); }
           }

           .badge-earned {
             text-align: center;
             width: 100%;
             margin-top: auto;
           }

           .earned-date {
             color: #059669 !important;
             font-weight: bold;
             margin-bottom: 0.75rem;
             font-size: 0.85rem;
             text-shadow: 0 1px 2px rgba(5, 150, 105, 0.2);
           }

           .celebrate-button {
             background: linear-gradient(135deg, #10B981, #34D399);
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
             box-shadow: 0 3px 10px rgba(16, 185, 129, 0.4);
             text-shadow: 0 1px 2px rgba(0,0,0,0.2);
           }

           .celebrate-button:hover {
             background: linear-gradient(135deg, #059669, #10B981);
             transform: translateY(-2px);
             box-shadow: 0 5px 15px rgba(16, 185, 129, 0.6);
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
             background: linear-gradient(135deg, #9CA3AF, #D1D5DB) !important;
             color: white !important;
             font-weight: 600;
             box-shadow: 0 2px 6px rgba(156, 163, 175, 0.3) !important;
           }

           .badge-card.locked .locked-icon {
             color: #9CA3AF !important;
             opacity: 0.8;
             filter: drop-shadow(0 2px 4px rgba(156, 163, 175, 0.3));
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
             color: #10B981 !important;
             text-shadow: 0 2px 6px rgba(16, 185, 129, 0.4), 0 0 10px rgba(16, 185, 129, 0.2) !important;
             filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.3)) !important;
           }

           .badge-card.locked .badge-icon {
             color: #9CA3AF !important;
             text-shadow: 0 1px 3px rgba(156, 163, 175, 0.4) !important;
             filter: grayscale(0.4) !important;
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
            background: linear-gradient(135deg, #FFFFFF, #F8F9FA);
            padding: 2rem;
            border-radius: 25px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            border: 2px solid rgba(16, 185, 129, 0.1);
          }

          .achievement-tips-section h2 {
            color: #2D3748 !important;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
            font-weight: 600;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
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