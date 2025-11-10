import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSound } from '../../lib/soundEffects';
import gamifiedApiService from '../../services/gamifiedApiService';
import './GamePlayer.css';

const GamePlayer = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { playNextButton, playClick } = useSound();
  
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState('intro'); // intro, playing, completed
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeStarted, setTimeStarted] = useState(null);

  useEffect(() => {
    // Get game data from localStorage or location state
    const gameData = location.state?.game || JSON.parse(localStorage.getItem('selectedGame') || 'null');
    
    if (gameData) {
      setGame(gameData);
      setLoading(false);
    } else {
      // If no game data, redirect back to dashboard
      navigate('/dashboard');
    }
  }, [gameId, location.state, navigate]);

  const startGame = () => {
    setGameState('playing');
    setTimeStarted(Date.now());
  };

  const completeGame = async (finalScore = 100) => {
    const timeSpent = timeStarted ? Math.round((Date.now() - timeStarted) / 1000) : 0;
    setScore(finalScore);
    setGameState('completed');
    
    // Save progress to localStorage (in a real app, this would be sent to the backend)
    const gameProgress = {
      gameId: game.id,
      title: game.title,
      score: finalScore,
      timeSpent,
      completedAt: new Date().toISOString(),
      pointsEarned: game.pointsReward || 10
    };
    
    const existingProgress = JSON.parse(localStorage.getItem('gameProgress') || '[]');
    existingProgress.push(gameProgress);
    localStorage.setItem('gameProgress', JSON.stringify(existingProgress));
    
    // Send to backend API to award badges and update points
    try {
      console.log('[GamePlayer] Saving game completion to backend...');
      console.log('[GamePlayer] Game ID:', game.id);
      console.log('[GamePlayer] Score:', finalScore);
      console.log('[GamePlayer] Points reward:', game.pointsReward || 10);
      
      const response = await gamifiedApiService.saveProgress({
        contentId: game.id,
        score: finalScore,
        timeSpent,
        progressPercentage: 100,
        isCompleted: true
      });
      console.log('[GamePlayer] Gamified progress response:', response);
      
      const awardedBadges = response?.newBadges || response?.data?.newBadges || [];
      if (awardedBadges.length > 0) {
        console.log('🎉 Badges awarded:', awardedBadges);
        localStorage.setItem('newBadges', JSON.stringify(awardedBadges));
        localStorage.setItem('refreshAchievements', 'true');
        localStorage.setItem('refreshDashboard', 'true');
      }
      
    } catch (error) {
      console.error('[GamePlayer] Error saving game progress:', error);
      console.error('[GamePlayer] Error stack:', error.stack);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const renderGameContent = () => {
    if (!game) return null;

    switch (game.gameType) {
      case 'puzzle':
        return <PuzzleGame game={game} onComplete={completeGame} onProgress={setProgress} />;
      case 'quiz':
        return <QuizGame game={game} onComplete={completeGame} onProgress={setProgress} />;
      case 'interactive':
        return <InteractiveGame game={game} onComplete={completeGame} onProgress={setProgress} />;
      case 'story':
        return <StoryGame game={game} onComplete={completeGame} onProgress={setProgress} />;
      default:
        return <DefaultGame game={game} onComplete={completeGame} onProgress={setProgress} />;
    }
  };

  if (loading) {
    return (
      <div className="game-player">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <h2>Loading Game...</h2>
          <p>Getting your adventure ready!</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-player">
        <div className="error-screen">
          <div className="error-icon">😞</div>
          <h2>Game Not Found</h2>
          <p>Sorry, we couldn't find this game.</p>
          <button className="back-button" onClick={handleBackToDashboard}>
            🏠 Back to Games
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'intro') {
    return (
      <div className="game-player">
        <div className="game-intro">
          <div className="intro-header">
            <div className="game-icon-huge">
              {getGameTypeIcon(game.gameType)}
            </div>
            <h1>{game.title}</h1>
            <p className="game-description">{game.description}</p>
          </div>

          <div className="game-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">🎯</span>
                <div>
                  <h3>Learning Goals</h3>
                  <p>{game.learningObjectives || 'Have fun while learning!'}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <div>
                  <h3>Time Needed</h3>
                  <p>{game.estimatedTime || 10} minutes</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⭐</span>
                <div>
                  <h3>Points to Earn</h3>
                  <p>{game.pointsReward || 10} points</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🏆</span>
                <div>
                  <h3>Badge Reward</h3>
                  <p>{game.badgeReward || 'Completion Badge'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="intro-actions">
            <button className="start-button" onClick={startGame}>
              🚀 Start Game!
            </button>
            <button className="back-button" onClick={handleBackToDashboard}>
              ← Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="game-player">
        <div className="completion-screen">
          <div className="completion-celebration">
            <div className="celebration-icon">🎉</div>
            <h1>Congratulations!</h1>
            <p>You completed <strong>{game.title}</strong>!</p>
          </div>

          <div className="completion-stats">
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <div>
                <h3>Score</h3>
                <p>{score}%</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🏆</span>
              <div>
                <h3>Points Earned</h3>
                <p>+{game.pointsReward || 10}</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎖️</span>
              <div>
                <h3>Badge Unlocked</h3>
                <p>{game.badgeReward || 'Game Master'}</p>
              </div>
            </div>
          </div>

          <div className="completion-actions">
            <button className="play-again-button" onClick={() => setGameState('intro')}>
              🔄 Play Again
            </button>
            <button className="back-button" onClick={handleBackToDashboard}>
              🏠 Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-player">
      <div className="game-header">
        <button className="exit-button" onClick={handleBackToDashboard}>
          ← Exit Game
        </button>
        <h2>{game.title}</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="game-content">
        {renderGameContent()}
      </div>
    </div>
  );
};

// Helper function to get game type icon
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

// Enhanced game components for different game types and grades
const PuzzleGame = ({ game, onComplete, onProgress }) => {
  const { t, language } = useLanguage();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [solved, setSolved] = useState(false);

  // Generate age-appropriate puzzles based on game content and grade - using translations
  // Recreate when language changes
  const generatePuzzles = React.useCallback(() => {
    const grade = game.grade;
    const gradeNum = parseInt(grade?.toString().replace('Grade ', '') || '0') || 0;
    
    // Grades 1-3: Easy puzzles
    if (gradeNum >= 1 && gradeNum <= 3) {
      return [
        { 
          question: t('puzzle.grade1.q1.question'), 
          answer: t('puzzle.grade1.q1.answer'), 
          options: [
            t('puzzle.grade1.q1.option1'), 
            t('puzzle.grade1.q1.option2'), 
            t('puzzle.grade1.q1.option3'), 
            t('puzzle.grade1.q1.option4')
          ] 
        },
        { 
          question: t('puzzle.grade1.q2.question'), 
          answer: t('puzzle.grade1.q2.answer'), 
          options: [
            t('puzzle.grade1.q2.option1'), 
            t('puzzle.grade1.q2.option2'), 
            t('puzzle.grade1.q2.option3'), 
            t('puzzle.grade1.q2.option4')
          ] 
        },
        { 
          question: t('puzzle.grade1.q3.question'), 
          answer: t('puzzle.grade1.q3.answer'), 
          options: [
            t('puzzle.grade1.q3.option1'), 
            t('puzzle.grade1.q3.option2'), 
            t('puzzle.grade1.q3.option3'), 
            t('puzzle.grade1.q3.option4')
          ] 
        }
      ];
    } 
    // Grades 4-6: Harder puzzles
    else if (gradeNum >= 4 && gradeNum <= 6) {
      return [
        { 
          question: t('puzzle.grade4.q1.question'), 
          answer: t('puzzle.grade4.q1.answer'), 
          options: [
            t('puzzle.grade4.q1.option1'), 
            t('puzzle.grade4.q1.option2'), 
            t('puzzle.grade4.q1.option3'), 
            t('puzzle.grade4.q1.option4')
          ] 
        },
        { 
          question: t('puzzle.grade4.q2.question'), 
          answer: t('puzzle.grade4.q2.answer'), 
          options: [
            t('puzzle.grade4.q2.option1'), 
            t('puzzle.grade4.q2.option2'), 
            t('puzzle.grade4.q2.option3'), 
            t('puzzle.grade4.q2.option4')
          ] 
        },
        { 
          question: t('puzzle.grade4.q3.question'), 
          answer: t('puzzle.grade4.q3.answer'), 
          options: [
            t('puzzle.grade4.q3.option1'), 
            t('puzzle.grade4.q3.option2'), 
            t('puzzle.grade4.q3.option3'), 
            t('puzzle.grade4.q3.option4')
          ] 
        }
      ];
    }
    // Default: Easy puzzles
      return [
      { 
        question: t('puzzle.grade1.q1.question'), 
        answer: t('puzzle.grade1.q1.answer'), 
        options: [
          t('puzzle.grade1.q1.option1'), 
          t('puzzle.grade1.q1.option2'), 
          t('puzzle.grade1.q1.option3'), 
          t('puzzle.grade1.q1.option4')
        ] 
      },
      { 
        question: t('puzzle.grade1.q2.question'), 
        answer: t('puzzle.grade1.q2.answer'), 
        options: [
          t('puzzle.grade1.q2.option1'), 
          t('puzzle.grade1.q2.option2'), 
          t('puzzle.grade1.q2.option3'), 
          t('puzzle.grade1.q2.option4')
        ] 
      },
      { 
        question: t('puzzle.grade1.q3.question'), 
        answer: t('puzzle.grade1.q3.answer'), 
        options: [
          t('puzzle.grade1.q3.option1'), 
          t('puzzle.grade1.q3.option2'), 
          t('puzzle.grade1.q3.option3'), 
          t('puzzle.grade1.q3.option4')
        ] 
      }
    ];
  }, [t, language, game.grade]); // Recreate when language or grade changes

  const puzzles = React.useMemo(() => generatePuzzles(), [generatePuzzles]);

  const handleAnswer = (answer) => {
    if (answer === puzzles[currentPuzzle].answer) {
      setSolved(true);
      const nextPuzzle = currentPuzzle + 1;
      onProgress((nextPuzzle / puzzles.length) * 100);
      
      setTimeout(() => {
        if (nextPuzzle < puzzles.length) {
          setCurrentPuzzle(nextPuzzle);
          setSolved(false);
        } else {
          onComplete(100);
        }
      }, 1500);
    } else {
      // Wrong answer - show error and let them try again
      setSolved(false);
    }
  };

  return (
    <div className="puzzle-game">
      <div className="puzzle-question">
        <h3>{puzzles[currentPuzzle].question}</h3>
      </div>
      
      {solved ? (
        <div className="correct-answer">
          <div className="success-icon">✅</div>
          <p>{t('puzzle.feedback.correct')}</p>
        </div>
      ) : (
        <div className="puzzle-options">
          {puzzles[currentPuzzle].options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      
      <div className="puzzle-progress">
        {t('puzzle.progress', { current: currentPuzzle + 1, total: puzzles.length })}
      </div>
    </div>
  );
};

const QuizGame = ({ game, onComplete, onProgress }) => {
  const { playClick, playBlockSelect, playSuccess, playError } = useSound();
  const { t, language } = useLanguage();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [catPosition, setCatPosition] = useState({ x: 0, y: 4 }); // Start at bottom left (row 4, col 0)
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGameBoard, setShowGameBoard] = useState(true); // Show board from start
  const [score, setScore] = useState(0);

  // Fun cat movement challenges - using translations (recreated when language changes)
  const challenges = React.useMemo(() => [
    {
      id: 1,
      title: t('game.cat.challenge1.title'),
      description: t('game.cat.challenge1.description'),
      target: { x: 2, y: 2 }, // Column 2, Row 2
      blocks: [
        { id: 'move_forward', text: t('game.cat.block.forward'), icon: '⬆️', color: '#4CAF50' },
        { id: 'move_backward', text: t('game.cat.block.backward'), icon: '⬇️', color: '#f44336' },
        { id: 'move_left', text: t('game.cat.block.left'), icon: '⬅️', color: '#2196F3' },
        { id: 'move_right', text: t('game.cat.block.right'), icon: '➡️', color: '#FF9800' }
      ],
      solution: ['move_right', 'move_right', 'move_forward', 'move_forward'],
      hint: t('game.cat.challenge1.hint')
    },
    {
      id: 2,
      title: t('game.cat.challenge2.title'),
      description: t('game.cat.challenge2.description'),
      target: { x: 3, y: 1 },
      blocks: [
        { id: 'move_forward', text: t('game.cat.block.forward'), icon: '⬆️', color: '#4CAF50' },
        { id: 'move_backward', text: t('game.cat.block.backward'), icon: '⬇️', color: '#f44336' },
        { id: 'move_left', text: t('game.cat.block.left'), icon: '⬅️', color: '#2196F3' },
        { id: 'move_right', text: t('game.cat.block.right'), icon: '➡️', color: '#FF9800' }
      ],
      solution: ['move_right', 'move_right', 'move_right', 'move_forward'],
      hint: t('game.cat.challenge2.hint')
    },
    {
      id: 3,
      title: t('game.cat.challenge3.title'),
      description: t('game.cat.challenge3.description'),
      target: { x: 4, y: 3 },
      blocks: [
        { id: 'move_forward', text: t('game.cat.block.forward'), icon: '⬆️', color: '#4CAF50' },
        { id: 'move_backward', text: t('game.cat.block.backward'), icon: '⬇️', color: '#f44336' },
        { id: 'move_left', text: t('game.cat.block.left'), icon: '⬅️', color: '#2196F3' },
        { id: 'move_right', text: t('game.cat.block.right'), icon: '➡️', color: '#FF9800' }
      ],
      solution: ['move_right', 'move_right', 'move_right', 'move_right', 'move_forward', 'move_forward', 'move_forward'],
      hint: t('game.cat.challenge3.hint')
    }
  ], [t, language]); // Recreate when language changes

  const currentChallengeData = challenges[currentChallenge];

  // Animate cat movement
  const animateCatMovement = async (blocks) => {
    setIsAnimating(true);
    // Reset cat to start position
    let currentPos = { x: 0, y: 4 }; // Start at bottom left (row 4, col 0)
    setCatPosition(currentPos);

    // Filter out non-movement blocks
    const movementBlocks = blocks.filter(b => b && typeof b === 'string' && b.startsWith('move_'));

    for (let i = 0; i < movementBlocks.length; i++) {
      const block = movementBlocks[i];
      await new Promise(resolve => {
        setTimeout(() => {
          if (block === 'move_forward') {
            currentPos.y = Math.max(0, currentPos.y - 1); // Up = decrease row
          } else if (block === 'move_backward') {
            currentPos.y = Math.min(4, currentPos.y + 1); // Down = increase row
          } else if (block === 'move_left') {
            currentPos.x = Math.max(0, currentPos.x - 1); // Left = decrease col
          } else if (block === 'move_right') {
            currentPos.x = Math.min(4, currentPos.x + 1); // Right = increase col
          }
          setCatPosition({ ...currentPos });
          playClick();
          resolve();
        }, 800); // Slow movement (800ms) so kids can see the cat move clearly
      });
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return currentPos;
  };

  const handleBlockSelect = (blockId) => {
    if (selectedBlocks.length >= 10) return; // Limit sequence
    playBlockSelect();
    setSelectedBlocks(prev => [...prev, blockId]);
  };

  const handleBlockRemove = (index) => {
    playClick();
    setSelectedBlocks(prev => prev.filter((_, i) => i !== index));
  };

  const handleRun = async () => {
    if (selectedBlocks.length === 0) {
      playError();
      return;
    }

    playClick();
    const finalPosition = await animateCatMovement(selectedBlocks);
    
    // Check if cat reached target
    const target = currentChallengeData.target;
    const isCorrectAnswer = finalPosition.x === target.x && finalPosition.y === target.y;
    setIsCorrect(isCorrectAnswer);

    if (isCorrectAnswer) {
      playSuccess();
      setScore(prev => prev + 1);
      const nextChallenge = currentChallenge + 1;
      onProgress((nextChallenge / challenges.length) * 100);
    
    setTimeout(() => {
        if (nextChallenge < challenges.length) {
          setCurrentChallenge(nextChallenge);
          setSelectedBlocks([]);
          setIsCorrect(null);
          setShowHint(false);
          setCatPosition({ x: 0, y: 4 }); // Reset to start position
          setIsAnimating(false);
      } else {
          const finalPercentage = (score + 1) / challenges.length * 100;
          onComplete(finalPercentage);
      }
    }, 2000);
    } else {
      playError();
      setTimeout(() => {
        setIsCorrect(null);
        setSelectedBlocks([]);
        setCatPosition({ x: 0, y: 4 }); // Reset to start position
        setIsAnimating(false);
      }, 2000);
    }
  };

  const resetChallenge = () => {
    playClick();
    setSelectedBlocks([]);
    setIsCorrect(null);
    setShowHint(false);
    setCatPosition({ x: 0, y: 4 }); // Reset to start position (bottom left)
    setIsAnimating(false);
  };

  return (
    <div className="cat-movement-game">
      <div className="game-header-cat">
        <h2>{currentChallengeData.title}</h2>
        <p>{currentChallengeData.description}</p>
      </div>
      
      {/* Game Board Visualization - Always visible */}
      <div className="game-board-container">
        <div className="game-board">
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} className="game-row">
              {Array.from({ length: 5 }).map((_, col) => {
                const isCat = catPosition.x === col && catPosition.y === row;
                const isTarget = currentChallengeData.target.x === col && currentChallengeData.target.y === row;
                const isStart = col === 0 && row === 4;

                return (
                  <div key={col} className={`game-cell ${isCat ? 'cat-cell' : ''} ${isTarget ? 'target-cell' : ''} ${isStart ? 'start-cell' : ''}`}>
                    {isCat && <div className="cat-emoji">🐱</div>}
                    {isTarget && !isCat && <div className="target-emoji">🍽️</div>}
                    {isStart && !isCat && !isTarget && <div className="start-emoji">🚀</div>}
        </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Available Blocks */}
      <div className="blocks-section">
        <h3>{t('game.cat.blocks.title')}</h3>
        <div className="available-blocks">
          {currentChallengeData.blocks.map((block) => (
            <button
              key={block.id}
              className="block-button"
              onClick={() => handleBlockSelect(block.id)}
              style={{ backgroundColor: block.color }}
            >
              <span className="block-icon">{block.icon}</span>
              <span className="block-text">{block.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Blocks Sequence */}
      <div className="selected-blocks-section">
        <h3>{t('game.cat.code.title')}</h3>
        <div className="selected-blocks">
          {selectedBlocks.length === 0 ? (
            <p className="no-blocks">{t('game.cat.code.empty')}</p>
          ) : (
            selectedBlocks.map((blockId, index) => {
              const block = currentChallengeData.blocks.find(b => b.id === blockId);
              return (
                <div key={index} className="selected-block" style={{ backgroundColor: block?.color || '#667eea' }}>
                  <span className="block-icon">{block?.icon || '⬆️'}</span>
                  <span className="block-text">{block?.text || blockId}</span>
                  <button className="remove-block" onClick={() => handleBlockRemove(index)}>×</button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="game-actions">
        <button className="run-button" onClick={handleRun} disabled={selectedBlocks.length === 0 || isAnimating}>
          ▶️ {t('game.cat.actions.run')}
        </button>
        <button className="reset-button" onClick={resetChallenge}>
          🔄 {t('game.cat.actions.reset')}
        </button>
        <button className="hint-button" onClick={() => { setShowHint(!showHint); playClick(); }}>
          💡 {t('game.cat.actions.hint')}
        </button>
      </div>

      {/* Hint */}
      {showHint && (
        <div className="hint-box">
          <p>{currentChallengeData.hint}</p>
        </div>
      )}

      {/* Feedback */}
      {isCorrect === true && (
        <div className="feedback success">
          <div className="success-icon">🎉</div>
          <p>{t('game.cat.feedback.success')}</p>
        </div>
      )}

      {isCorrect === false && (
        <div className="feedback error">
          <div className="error-icon">😅</div>
          <p>{t('game.cat.feedback.error')}</p>
        </div>
      )}

      {/* Progress */}
      <div className="game-progress">
        {t('game.cat.progress', { current: currentChallenge + 1, total: challenges.length, score })}
      </div>
    </div>
  );
};

const InteractiveGame = ({ game, onComplete, onProgress }) => {
  const { playClick, playSuccess } = useSound();
  const [clicks, setClicks] = useState(0);
  const [catPosition, setCatPosition] = useState({ x: 0, y: 0 });
  const [isBouncing, setIsBouncing] = useState(false);
  const targetClicks = 10;

  const handleClick = () => {
    playClick();
    setIsBouncing(true);
    
    // Move cat around randomly
    setCatPosition({
      x: Math.random() * 200 - 100,
      y: Math.random() * 100 - 50
    });
    
    const newClicks = clicks + 1;
    setClicks(newClicks);
    onProgress((newClicks / targetClicks) * 100);
    
    setTimeout(() => setIsBouncing(false), 500);
    
    if (newClicks >= targetClicks) {
      playSuccess();
      setTimeout(() => onComplete(100), 1500);
    }
  };

  // Cat encouraging messages
  const getEncouragement = () => {
    if (clicks === 0) return "🐱 Hi! I'm Whiskers! Click me to start!";
    if (clicks < targetClicks / 2) return `🐱 Yay! ${clicks} clicks! Keep going!`;
    if (clicks < targetClicks) return `🐱 Almost there! ${targetClicks - clicks} more!`;
    return "🐱 Wow! You did it! Amazing! 🎉";
  };

  return (
    <div className="interactive-game">
      <div className="game-header-fun">
        <h3>🐱 Play with Whiskers the Cat!</h3>
        <p className="encouragement-text">{getEncouragement()}</p>
      </div>
      
      <div className="click-area">
        <div className="cat-container" 
             style={{ 
               transform: `translate(${catPosition.x}px, ${catPosition.y}px)`,
               animation: isBouncing ? 'bounce 0.5s ease' : 'none'
             }}>
          <div className="animated-cat">🐱</div>
          {isBouncing && <div className="sparkle">✨</div>}
        </div>
        
        <button 
          className={`click-button ${isBouncing ? 'clicked' : ''}`}
          onClick={handleClick}
          style={{
            transform: isBouncing ? 'scale(1.2)' : 'scale(1)',
            background: `linear-gradient(135deg, hsl(${clicks * 36}, 70%, 60%), hsl(${clicks * 36 + 30}, 70%, 50%))`
          }}
        >
          <span className="button-emoji">🎯</span>
          <span className="button-text">Click Me!</span>
          <span className="button-count">({clicks}/{targetClicks})</span>
        </button>
      </div>
      
      {clicks >= targetClicks && (
        <div className="completion-message">
          <div className="celebration-cat">🐱🎉</div>
          <p>Awesome! Whiskers is so happy! You're a superstar! ⭐</p>
        </div>
      )}
    </div>
  );
};

const StoryGame = ({ game, onComplete, onProgress }) => {
  const { playNextButton, playSuccess } = useSound();
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [catPosition, setCatPosition] = useState({ x: 0, y: 0 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Fun, engaging story with animated cat character - using translations (recreated when language changes)
  const story = React.useMemo(() => [
    { 
      text: t('story.page1.text'), 
      character: "🐱",
      action: "bounce",
      sound: "meow"
    },
    { 
      text: t('story.page2.text'), 
      character: "🐱",
      action: "walk-right",
      sound: "excited"
    },
    { 
      text: t('story.page3.text'), 
      character: "🐱",
      action: "type",
      sound: "click"
    },
    { 
      text: t('story.page4.text'), 
      character: "🐱",
      action: "surf",
      sound: "success"
    },
    { 
      text: t('story.page5.text'), 
      character: "🐱",
      action: "celebrate",
      sound: "celebration"
    }
  ], [t, language]); // Recreate when language changes

  // Animate character based on action
  useEffect(() => {
    if (story[currentPage]?.action) {
      setIsAnimating(true);
      const action = story[currentPage].action;
      
      if (action === 'walk-right') {
        // Animate cat walking
        let x = 0;
        const walkInterval = setInterval(() => {
          x += 5;
          setCatPosition({ x: Math.min(x, 300), y: 0 });
          if (x >= 300) {
            clearInterval(walkInterval);
            setIsAnimating(false);
          }
        }, 50);
        return () => clearInterval(walkInterval);
      } else if (action === 'celebrate') {
        // Bouncing celebration
        const bounceInterval = setInterval(() => {
          setCatPosition(prev => ({ ...prev, y: prev.y === 0 ? -20 : 0 }));
        }, 300);
        setTimeout(() => {
          clearInterval(bounceInterval);
          setIsAnimating(false);
        }, 2000);
        return () => clearInterval(bounceInterval);
      } else {
        setIsAnimating(false);
      }
    }
  }, [currentPage]);

  // Text-to-speech for cat with kid voice
  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get kid-like voice
      const voices = window.speechSynthesis.getVoices();
      const kidVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('samantha')
      ) || voices.find(v => v.default) || voices[0];
      
      if (kidVoice) {
        utterance.voice = kidVoice;
      }
      
      // Make it sound like a kid - higher pitch, faster, louder
      utterance.rate = 1.2; // Faster (kids talk faster when excited)
      utterance.pitch = 1.7; // Much higher pitch (kids have higher voices)
        utterance.volume = 0.95; // Slightly louder
        // Set language based on current language setting
        utterance.lang = language === 'rw' ? 'rw-RW' : 'en-US'; // Kinyarwanda or English
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (error) => {
        console.error('Speech error:', error);
        setIsSpeaking(false);
      };
    }
  };

      // Auto-speak when page changes or language changes
      useEffect(() => {
        if (story[currentPage]) {
          setTimeout(() => {
            speakText(story[currentPage].text);
          }, 300);
        }
        return () => {
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
          }
        };
      }, [currentPage, language, story]);

  const nextPage = () => {
    if (playNextButton) {
    playNextButton();
    }
    
    // Stop current speech
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    const newPage = currentPage + 1;
    
    // If we've reached the last page, complete the game
    if (newPage >= story.length) {
      if (playSuccess) {
        playSuccess();
      }
      setTimeout(() => {
        onProgress(100);
        onComplete(100);
      }, 500);
      return;
    }
    
    // Move to next page
    setCurrentPage(newPage);
    onProgress((newPage / story.length) * 100);
  };

  const currentStory = story[currentPage];

  return (
    <div className="story-game">
      <div className="story-page">
        <div className={`story-character ${currentStory?.action || ''} ${isAnimating ? 'animating' : ''}`}
             style={{ 
               transform: `translate(${catPosition.x}px, ${catPosition.y}px)`,
               animation: isAnimating ? `${currentStory?.action || 'bounce'} 1s ease-in-out infinite` : 'none'
             }}>
          <div className="character-emoji">{currentStory?.character || '🐱'}</div>
          {isSpeaking && <div className="speaking-indicator">💬</div>}
        </div>
        <div className="story-text-container">
          <p className="story-text">{currentStory?.text || ''}</p>
        </div>
      </div>
      
      {currentPage < story.length - 1 && (
        <button className="next-button" onClick={nextPage}>
          {t('story.button.next')}
        </button>
      )}
      
      {currentPage === story.length - 1 && (
        <button className="next-button finish-button" onClick={nextPage}>
          {t('story.button.finish')}
        </button>
      )}
      
      <div className="story-progress">
        {t('story.progress', { current: currentPage + 1, total: story.length })}
      </div>
    </div>
  );
};

const DefaultGame = ({ game, onComplete, onProgress }) => {
  const { playNextButton, playSuccess } = useSound();
  const { t, language } = useLanguage();
  const [step, setStep] = useState(0);
  const [catVisible, setCatVisible] = useState(true);
  const [catMoved, setCatMoved] = useState(false);
  const totalSteps = 5;

  // Fun interactive steps with animated cat - using translations (recreated when language changes)
  const steps = React.useMemo(() => [
    { 
      emoji: "🐱", 
      text: t('game.default.step1', { subject: game.subject || t('game.default.subject.default') }),
      action: "bounce"
    },
    { 
      emoji: "🎮", 
      text: t('game.default.step2', { subject: game.subject || t('game.default.subject.default') }),
      action: "excited"
    },
    { 
      emoji: "⭐", 
      text: t('game.default.step3'),
      action: "happy"
    },
    { 
      emoji: "🎯", 
      text: t('game.default.step4'),
      action: "cheer"
    },
    { 
      emoji: "🏆", 
      text: t('game.default.step5'),
      action: "celebrate"
    }
  ], [t, language, game.subject]); // Recreate when language or subject changes

  const nextStep = () => {
    if (playNextButton) {
    playNextButton();
    }
    setCatMoved(true);
    
    setTimeout(() => {
    const newStep = step + 1;
    
      // If we've completed all steps, finish the game
    if (newStep >= totalSteps) {
        setStep(newStep - 1); // Keep showing last step
        onProgress(100);
        setCatMoved(false);
        if (playSuccess) {
          playSuccess();
        }
        setTimeout(() => onComplete(100), 500);
        return;
      }
      
      // Move to next step
      setStep(newStep);
      onProgress((newStep / totalSteps) * 100);
      setCatMoved(false);
    }, 300);
  };

  const currentStepData = steps[step] || steps[0];

  return (
    <div className="default-game">
      <div className="fun-game-header">
        <div className={`animated-character ${currentStepData.action} ${catMoved ? 'moving' : ''}`}>
          <div className="character-big">{currentStepData.emoji}</div>
        </div>
        <h3>{game.title || 'Fun Learning Game!'}</h3>
      </div>
      
      <div className="game-content">
        <div className="step-content">
          <p className="fun-text">{currentStepData.text}</p>
          {game.description && (
            <p className="game-description-text">{game.description}</p>
          )}
        </div>
      </div>
      
      {step < totalSteps - 1 && (
        <button className="continue-button" onClick={nextStep}>
          {t('game.default.button.next')}
        </button>
      )}
      
      {step === totalSteps - 1 && (
        <button className="continue-button finish-button" onClick={nextStep}>
          {t('game.default.button.finish')}
        </button>
      )}
      
      <div className="step-progress">
        {t('game.default.progress', { current: step + 1, total: totalSteps })}
      </div>
    </div>
  );
};

export default GamePlayer;
