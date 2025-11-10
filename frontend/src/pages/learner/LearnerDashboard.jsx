import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import gamifiedApiService from '../../services/gamifiedApiService';
import learnerApiService from '../../services/learnerApiService';

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gamifiedContent, setGamifiedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    badgesEarned: 0,
    gamesCompleted: 0,
    currentStreak: 0
  });
  const [recentBadges, setRecentBadges] = useState([]);

  useEffect(() => {
    // Auto-set age group based on student's grade if available
    let selectedAgeGroup = localStorage.getItem('selectedAgeGroup');
    
    if (!selectedAgeGroup && user?.grade) {
      // Map grade to age group
      const gradeToAgeGroup = {
        '1': '6-7',
        'Grade 1': '6-7',
        '2': '7-8',
        'Grade 2': '7-8',
        '3': '8-9',
        'Grade 3': '8-9',
        '4': '9-10',
        'Grade 4': '9-10',
        '5': '10-11',
        'Grade 5': '10-11',
        '6': '11-12',
        'Grade 6': '11-12'
      };
      
      const ageGroup = gradeToAgeGroup[user.grade];
      if (ageGroup) {
        localStorage.setItem('selectedAgeGroup', ageGroup);
        selectedAgeGroup = ageGroup;
        console.log('[LearnerDashboard] Auto-set age group based on grade:', user.grade, '->', ageGroup);
      }
    }
    
    if (!selectedAgeGroup) {
      // If still no age group, redirect to age group selection
      console.log('[LearnerDashboard] No age group found, redirecting to age-select');
      navigate('/dashboard/age-select');
      return;
    }
    
    fetchDashboardData();
    
    // Check for new badges from localStorage (set after course completion)
    const refreshFlag = localStorage.getItem('refreshDashboard');
    if (refreshFlag === 'true') {
      localStorage.removeItem('refreshDashboard');
      // Refresh dashboard data after a short delay to ensure backend has updated
      setTimeout(() => {
        fetchDashboardData();
      }, 1000);
    }
  }, [navigate, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user stats and recent badges
      const [statsResponse, badgesResponse] = await Promise.all([
        learnerApiService.getDashboardData().catch((err) => {
          console.warn('Dashboard stats fetch failed:', err);
          return { data: { stats: userStats } };
        }),
        learnerApiService.getAchievements().catch((err) => {
          console.warn('Achievements fetch failed:', err);
          return { badges: [] };
        })
      ]);

      // Handle dashboard stats response
      if (statsResponse && statsResponse.data && statsResponse.data.stats) {
        setUserStats(statsResponse.data.stats);
      }
      
      // Handle badges response - check both response formats
      if (badgesResponse) {
        const badges = badgesResponse.badges || badgesResponse.data?.badges || [];
        setRecentBadges(badges.slice(0, 3));
      }

      // Try to get user's grade-specific content first
      try {
        const response = await gamifiedApiService.getMyContent();
        const content = response.data || response;
        if (Array.isArray(content)) {
          setGamifiedContent(content.slice(0, 6)); // Show top 6 games
        } else {
          throw new Error('Invalid content format');
        }
      } catch (gradeError) {
        console.warn('Grade-specific content fetch failed, trying age group:', gradeError);
        // Fallback to age group content
        const ageGroup = localStorage.getItem('selectedAgeGroup');
        if (ageGroup) {
          try {
            const response = await gamifiedApiService.getContentByAgeGroup(ageGroup);
            const content = response.data || response;
            if (Array.isArray(content)) {
              setGamifiedContent(content.slice(0, 6)); // Show top 6 games
            }
          } catch (ageError) {
            console.warn('Age group content fetch also failed:', ageError);
            // Set empty array as last resort
            setGamifiedContent([]);
          }
        } else {
          setGamifiedContent([]);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGameTypeIcon = (gameType) => {
    switch (gameType) {
      case 'puzzle': return '🧩';
      case 'quiz': return '❓';
      case 'interactive': return '🎮';
      case 'story': return '📚';
      case 'simulation': return '🎯';
      case 'creative': return '🎨';
      default: return '🎮';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleGameStart = (game) => {
    localStorage.setItem('selectedGame', JSON.stringify(game));
    // Navigate to the game player with the game data
    navigate(`/dashboard/game/${game.id}`, { state: { game } });
  };

  return (
    <div className="student-dashboard">
      {/* Simple Welcome */}
      <div className="simple-welcome">
        <h1>🎮 Let's Play & Learn!</h1>
        <p>Choose what you want to do! 🚀</p>
      </div>

      <div className="simple-stats">
        <div className="stat-chip">
          <span className="chip-icon">⭐</span>
          <span className="chip-label">Points</span>
          <span className="chip-value">{userStats.totalPoints}</span>
        </div>
        <div className="stat-chip">
          <span className="chip-icon">🏆</span>
          <span className="chip-label">Badges</span>
          <span className="chip-value">{userStats.badgesEarned}</span>
        </div>
        <div className="stat-chip">
          <span className="chip-icon">🎮</span>
          <span className="chip-label">Games Done</span>
          <span className="chip-value">{userStats.gamesCompleted}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="quick-action-btn games-btn"
          onClick={() => navigate('/dashboard/games')}
        >
          <span className="action-icon">🎮</span>
          <span className="action-text">Play Games</span>
        </button>
        <button 
          className="quick-action-btn puzzles-btn"
          onClick={() => navigate('/dashboard/puzzles')}
        >
          <span className="action-icon">🧩</span>
          <span className="action-text">Solve Puzzles</span>
        </button>
        <button 
          className="quick-action-btn badges-btn"
          onClick={() => navigate('/dashboard/achievements')}
        >
          <span className="action-icon">🏆</span>
          <span className="action-text">My Badges</span>
        </button>
      </div>

      {/* Simple Badges */}
      {recentBadges.length > 0 && (
        <div className="simple-badges">
          <h2>🌟 Recent Badges</h2>
          <div className="badges-row">
            {recentBadges.slice(0, 3).map(badge => (
              <div key={badge.id || badge.badgeId} className="badge-simple">
                <div className="badge-icon">{badge.icon || badge.badge?.icon || '🏆'}</div>
                <span>{badge.name || badge.title || badge.badge?.name || 'Badge'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          .student-dashboard {
            min-height: calc(100vh - 80px);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem;
            font-family: 'Comic Sans MS', cursive, sans-serif;
          }

          .simple-welcome {
            text-align: center;
            margin-bottom: 2rem;
          }

          .simple-welcome h1 {
            color: white;
            font-size: 3rem;
            margin: 0 0 0.5rem 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }

          .simple-welcome p {
            color: white;
            font-size: 1.5rem;
            margin: 0;
            opacity: 0.9;
          }

          .quick-actions {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
          }

          .quick-action-btn {
            background: white;
            border: none;
            border-radius: 25px;
            padding: 2rem 3rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            min-width: 180px;
          }

          .quick-action-btn:hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          }

          .games-btn:hover { background: linear-gradient(135deg, #ffeaa7, #fdcb6e); }
          .puzzles-btn:hover { background: linear-gradient(135deg, #a8e6cf, #dcedc1); }
          .badges-btn:hover { background: linear-gradient(135deg, #ffd3a5, #fd9853); }

          .action-icon {
            font-size: 4rem;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
          }

          .action-text {
            color: #2D3748;
            font-size: 1.3rem;
            font-weight: bold;
          }

          .main-games-section {
            margin-bottom: 2rem;
          }

          .games-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }

          .game-card {
            background: white;
            border-radius: 25px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            border: 4px solid transparent;
          }

          .game-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            border-color: #4facfe;
          }

          .game-icon-large {
            font-size: 5rem;
            margin-bottom: 1rem;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
          }

          .game-title {
            color: #2D3748;
            font-size: 1.5rem;
            margin: 0 0 1rem 0;
            font-weight: bold;
          }

          .game-description {
            color: #4A5568;
            margin: 0 0 1.5rem 0;
            font-size: 1rem;
            line-height: 1.4;
          }

          .game-rewards {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .reward-item {
            background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
            color: #2d3436;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.9rem;
          }

          .play-button-large {
            background: linear-gradient(135deg, #00b894, #00cec9);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-weight: bold;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
            width: 100%;
          }

          .play-button-large:hover {
            background: linear-gradient(135deg, #00a085, #00b7b3);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          }

          .simple-badges {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 25px;
            text-align: center;
          }

          .simple-stats {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            flex-wrap: wrap;
            margin-bottom: 2.5rem;
          }

          .stat-chip {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.35rem;
            background: rgba(255,255,255,0.15);
            border: 2px solid rgba(255,255,255,0.25);
            border-radius: 18px;
            padding: 1rem 1.5rem;
            min-width: 130px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            color: white;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.35);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .stat-chip:hover {
            transform: translateY(-6px);
            box-shadow: 0 18px 35px rgba(0,0,0,0.28);
          }

          .chip-icon {
            font-size: 2rem;
          }

          .chip-label {
            font-size: 0.85rem;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            opacity: 0.85;
          }

          .chip-value {
            font-size: 1.6rem;
            font-weight: 700;
          }

          .simple-badges h2 {
            color: white;
            font-size: 2rem;
            margin: 0 0 1.5rem 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }

          .badges-row {
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
          }

          .badge-simple {
            background: rgba(255,255,255,0.9);
            padding: 1rem;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            min-width: 100px;
            transition: all 0.3s ease;
          }

          .badge-simple:hover {
            transform: translateY(-5px);
            background: white;
          }

          .badge-simple .badge-icon {
            font-size: 2.5rem;
          }

          .badge-simple span {
            color: #2D3748;
            font-weight: bold;
            font-size: 0.9rem;
          }

          .loading-container {
            text-align: center;
            padding: 3rem;
            color: white;
          }

          .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255,255,255,0.3);
            border-top: 5px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .no-games {
            text-align: center;
            padding: 3rem;
            color: white;
            grid-column: 1 / -1;
          }

          .no-games-icon {
            font-size: 5rem;
            margin-bottom: 1rem;
          }

          .no-games h3 {
            font-size: 2rem;
            margin: 0 0 1rem 0;
          }

          .no-games p {
            font-size: 1.2rem;
            margin: 0;
          }

          @media (max-width: 768px) {
            .student-dashboard {
              padding: 1rem;
            }

            .simple-welcome h1 {
              font-size: 2.5rem;
            }

            .simple-stats {
              gap: 1rem;
            }

            .stat-chip {
              min-width: 100px;
              padding: 0.85rem 1rem;
            }

            .games-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }

            .game-card {
              padding: 1.5rem;
            }

            .game-icon-large {
              font-size: 4rem;
            }

            .badges-row {
              flex-direction: column;
              align-items: center;
              gap: 1rem;
            }
          }
        `
      }} />
    </div>
  );
};

export default LearnerDashboard;
