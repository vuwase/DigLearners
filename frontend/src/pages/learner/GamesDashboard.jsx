import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import gamifiedApiService from '../../services/gamifiedApiService';
import { getContentByGrade } from '../../lib/contentFilter';
import './GamesDashboard.css';

const GamesDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dedupeContent = (items) => {
    if (!Array.isArray(items)) return [];
    const seen = new Set();
    const normalizeTitle = (value = '') =>
      value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
    const getKey = (item = {}) => {
      const normalizedTitle = normalizeTitle(item.title || item.name || item.slug || '');
      const normalizedGrade = normalizeTitle(item.grade || '');
      if (normalizedTitle) {
        return `${normalizedGrade}__${normalizedTitle}`;
      }
      if (item.id || item._id) return String(item.id || item._id);
      return JSON.stringify(item);
    };
    return items.filter((item) => {
      const key = getKey(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  const getNormalizedGrade = () => {
    const rawGrade = user?.grade || location.state?.grade;
    if (!rawGrade) return null;
    const parsed = parseInt(rawGrade.toString().replace('Grade ', '').trim(), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return {
      gradeNum: parsed,
      gradeLabel: `Grade ${parsed}`
    };
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError('');

      const normalizedGrade = getNormalizedGrade();
      let games = [];

      try {
        const response = await gamifiedApiService.getMyContent();
        const data = response.data || response;
        if (Array.isArray(data) && data.length > 0) {
          const filtered = data.filter(item => {
            const allowed = ['interactive', 'quiz', 'simulation', 'creative', 'story'];
            return allowed.includes(item.gameType?.toLowerCase());
          });
          if (filtered.length > 0) {
            games = filtered;
          }
        }
      } catch (err) {
        console.warn('[GamesDashboard] getMyContent failed, falling back to grade fetch.', err);
      }

      if (games.length === 0 && normalizedGrade) {
        try {
          const gradeResponse = await gamifiedApiService.getContentByGrade(normalizedGrade.gradeLabel);
          const gradeData = gradeResponse.data || gradeResponse;
          if (Array.isArray(gradeData) && gradeData.length > 0) {
            const filtered = gradeData.filter(item => {
              const allowed = ['interactive', 'quiz', 'simulation', 'creative', 'story'];
              return allowed.includes(item.gameType?.toLowerCase());
            });
            games = getContentByGrade(filtered, normalizedGrade.gradeNum);
          }
        } catch (gradeErr) {
          console.warn('[GamesDashboard] getContentByGrade failed:', gradeErr);
        }
      }

      if (games.length === 0) {
        try {
          const allResponse = await gamifiedApiService.getAllContent();
          const allData = allResponse.data || allResponse;
          if (Array.isArray(allData)) {
            const allowed = ['interactive', 'quiz', 'simulation', 'creative', 'story'];
            games = allData.filter(item => allowed.includes(item.gameType?.toLowerCase()));
            if (normalizedGrade) {
              games = getContentByGrade(games, normalizedGrade.gradeNum);
            }
          }
        } catch (allErr) {
          console.warn('[GamesDashboard] getAllContent failed:', allErr);
        }
      }

      setContent(dedupeContent(games));
    } catch (error) {
      setError('Failed to load games. Please try again.');
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [user?.grade]);

  // Content is already filtered to only games

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
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

  const handleGameStart = (game) => {
    // Store the selected game in localStorage
    localStorage.setItem('selectedGame', JSON.stringify(game));
    // Navigate to the game player with the game data
    window.location.href = `/dashboard/game/${game.id}`;
  };

  if (loading) {
    return (
      <div className="games-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="games-dashboard">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={fetchGames}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="games-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🎮 Fun Games!</h1>
          <p>Let's play and learn! 🚀</p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="games-grid">
        {content.length === 0 ? (
          <div className="no-games">
            <div className="no-games-icon">🎮</div>
            <h3>No games yet!</h3>
            <p>More games coming soon! 🎉</p>
          </div>
        ) : (
          content.map((game) => (
            <div key={game.id} className="game-card">
              <div className="game-header">
                <div className="game-icon">
                  {getGameTypeIcon(game.gameType)}
                </div>
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(game.difficulty) }}
                >
                  {game.difficulty}
                </span>
              </div>

              <div className="game-content">
                <h3 className="game-title">{game.title}</h3>
                <p className="game-description">{game.description}</p>
                
                <div className="game-meta">
                  <div className="meta-item">
                    <span className="meta-icon">⭐</span>
                    <span>{game.pointsReward} points</span>
                  </div>
                </div>
              </div>

              <div className="game-actions">
                <button 
                  className="play-button"
                  onClick={() => handleGameStart(game)}
                >
                  🎮 Let's Play!
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GamesDashboard;
