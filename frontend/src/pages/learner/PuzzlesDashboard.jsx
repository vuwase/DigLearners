import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import gamifiedApiService from '../../services/gamifiedApiService';
import { getContentByGrade } from '../../lib/contentFilter';
import './GamesDashboard.css';

const PuzzlesDashboard = () => {
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getNormalizedGrade = () => {
    const rawGrade = user?.grade;
    if (!rawGrade) return null;
    const parsed = parseInt(rawGrade.toString().replace('Grade ', '').trim(), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return {
      gradeNum: parsed,
      gradeLabel: `Grade ${parsed}`
    };
  };

  const fetchPuzzles = async () => {
    try {
      setLoading(true);
      setError('');

      const normalizedGrade = getNormalizedGrade();
      let puzzles = [];

      try {
        const response = await gamifiedApiService.getMyContent();
        const data = response.data || response;
        if (Array.isArray(data) && data.length > 0) {
          const filtered = data.filter(item => item.gameType?.toLowerCase() === 'puzzle');
          if (filtered.length > 0) {
            puzzles = filtered;
          }
        }
      } catch (err) {
        console.warn('[PuzzlesDashboard] getMyContent failed, falling back to grade fetch.', err);
      }

      if (puzzles.length === 0 && normalizedGrade) {
        try {
          const gradeResponse = await gamifiedApiService.getContentByGrade(normalizedGrade.gradeLabel);
          const gradeData = gradeResponse.data || gradeResponse;
          if (Array.isArray(gradeData) && gradeData.length > 0) {
            const filtered = gradeData.filter(item => item.gameType?.toLowerCase() === 'puzzle');
            puzzles = getContentByGrade(filtered, normalizedGrade.gradeNum);
          }
        } catch (gradeErr) {
          console.warn('[PuzzlesDashboard] getContentByGrade failed:', gradeErr);
        }
      }

      if (puzzles.length === 0) {
        try {
          const allResponse = await gamifiedApiService.getAllContent({ gameType: 'puzzle' });
          const allData = allResponse.data || allResponse;
          if (Array.isArray(allData)) {
            puzzles = allData.filter(item => item.gameType?.toLowerCase() === 'puzzle');
            if (normalizedGrade) {
              puzzles = getContentByGrade(puzzles, normalizedGrade.gradeNum);
            }
          }
        } catch (allErr) {
          console.warn('[PuzzlesDashboard] getAllContent failed:', allErr);
        }
      }

      setContent(puzzles);
    } catch (error) {
      setError('Failed to load puzzles. Please try again.');
      console.error('Error fetching puzzles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzles();
  }, [user?.grade]);

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
    window.location.href = `/dashboard/game/${game.id}`;
  };

  if (loading) {
    return (
      <div className="games-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading puzzles... 🧩</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="games-dashboard">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops!</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchPuzzles}>
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
          <h1>🧩 Fun Puzzles!</h1>
          <p>Challenge your brain with these cool puzzles! 🧠</p>
        </div>
      </div>

      <div className="games-grid">
        {content.length === 0 ? (
          <div className="no-games">
            <div className="no-games-icon">🧩</div>
            <h3>No puzzles yet!</h3>
            <p>More puzzles coming soon! 🎉</p>
          </div>
        ) : (
          content.map((puzzle) => (
            <div key={puzzle.id} className="game-card">
              <div className="game-header">
                <div className="game-icon">🧩</div>
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(puzzle.difficulty) }}
                >
                  {puzzle.difficulty}
                </span>
              </div>

              <div className="game-content">
                <h3 className="game-title">{puzzle.title}</h3>
                <p className="game-description">{puzzle.description}</p>
                
                <div className="game-meta">
                  <div className="meta-item">
                    <span className="meta-icon">⭐</span>
                    <span>{puzzle.pointsReward} points</span>
                  </div>
                </div>
              </div>

              <div className="game-actions">
                <button 
                  className="play-button"
                  onClick={() => handleGameStart(puzzle)}
                >
                  🧩 Let's Play!
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PuzzlesDashboard;

