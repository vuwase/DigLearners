import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './GamePlayer.css';

const GamePlayer = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
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

  const completeGame = (finalScore = 100) => {
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
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [solved, setSolved] = useState(false);

  // Generate age-appropriate puzzles based on game content and grade
  const generatePuzzles = () => {
    const grade = game.grade;
    
    if (grade === 'Grade 1') {
      return [
        { question: "What shape is this? ⭕", answer: "Circle", options: ["Circle", "Square", "Triangle", "Rectangle"] },
        { question: "What color is this? 🔴", answer: "Red", options: ["Red", "Blue", "Green", "Yellow"] },
        { question: "Count the stars: ⭐⭐⭐", answer: "3", options: ["1", "2", "3", "4"] }
      ];
    } else if (grade === 'Grade 2') {
      return [
        { question: "What comes next? 🐶 🐱 🐶 ?", answer: "🐱", options: ["🐶", "🐱", "🐭", "🐹"] },
        { question: "Which is different?", answer: "🔺", options: ["🔴", "🔴", "🔺", "🔴"] },
        { question: "Complete: A, B, C, ?", answer: "D", options: ["D", "E", "F", "G"] }
      ];
    } else if (grade === 'Grade 3') {
      return [
        { question: "2 × 3 = ?", answer: "6", options: ["5", "6", "7", "8"] },
        { question: "Which word rhymes with 'cat'?", answer: "hat", options: ["dog", "hat", "car", "sun"] },
        { question: "What's the missing number? 2, 4, 6, ?", answer: "8", options: ["7", "8", "9", "10"] }
      ];
    } else if (grade === 'Grade 4') {
      return [
        { question: "What is 1/2 of 8?", answer: "4", options: ["2", "3", "4", "5"] },
        { question: "Which is a noun?", answer: "book", options: ["run", "happy", "book", "quickly"] },
        { question: "12 ÷ 3 = ?", answer: "4", options: ["3", "4", "5", "6"] }
      ];
    } else if (grade === 'Grade 5') {
      return [
        { question: "What is 0.5 + 0.3?", answer: "0.8", options: ["0.7", "0.8", "0.9", "1.0"] },
        { question: "Which is the main idea?", answer: "The story is about friendship", options: ["The boy was tall", "The story is about friendship", "It was sunny", "They ate lunch"] },
        { question: "15 × 4 = ?", answer: "60", options: ["50", "55", "60", "65"] }
      ];
    } else {
      return [
        { question: "Solve: x + 5 = 12", answer: "x = 7", options: ["x = 6", "x = 7", "x = 8", "x = 9"] },
        { question: "Which is a metaphor?", answer: "Time is money", options: ["The cat ran", "Time is money", "She is tall", "I like pizza"] },
        { question: "What is 25% of 80?", answer: "20", options: ["15", "20", "25", "30"] }
      ];
    }
  };

  const puzzles = generatePuzzles();

  const handleAnswer = (answer) => {
    if (answer === puzzles[currentPuzzle].answer) {
      setSolved(true);
      onProgress(((currentPuzzle + 1) / puzzles.length) * 100);
      
      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(currentPuzzle + 1);
          setSolved(false);
        } else {
          onComplete(100);
        }
      }, 1500);
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
          <p>Correct! Well done!</p>
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
        Puzzle {currentPuzzle + 1} of {puzzles.length}
      </div>
    </div>
  );
};

const QuizGame = ({ game, onComplete, onProgress }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  // Generate grade-appropriate quiz questions
  const generateQuestions = () => {
    const grade = game.grade;
    const subject = game.subject;
    
    if (grade === 'Grade 1') {
      if (subject === 'Math') {
        return [
          { question: "How many fingers do you have?", answer: "10", options: ["8", "9", "10", "11"] },
          { question: "What comes after 5?", answer: "6", options: ["4", "5", "6", "7"] },
          { question: "Which is bigger: 3 or 7?", answer: "7", options: ["3", "7", "Same", "Don't know"] }
        ];
      } else if (subject === 'Digital Literacy') {
        return [
          { question: "What do you use to click on a computer?", answer: "Mouse", options: ["Keyboard", "Mouse", "Screen", "Speaker"] },
          { question: "Where do you see pictures on a computer?", answer: "Screen", options: ["Keyboard", "Mouse", "Screen", "Speaker"] },
          { question: "What makes sounds on a computer?", answer: "Speaker", options: ["Keyboard", "Mouse", "Screen", "Speaker"] }
        ];
      }
    } else if (grade === 'Grade 2') {
      if (subject === 'Math') {
        return [
          { question: "What is 5 + 3?", answer: "8", options: ["6", "7", "8", "9"] },
          { question: "What is 10 - 4?", answer: "6", options: ["5", "6", "7", "8"] },
          { question: "How many sides does a triangle have?", answer: "3", options: ["2", "3", "4", "5"] }
        ];
      } else if (subject === 'Language') {
        return [
          { question: "Which letter comes after B?", answer: "C", options: ["A", "C", "D", "E"] },
          { question: "What sound does 'M' make?", answer: "mmm", options: ["aaa", "mmm", "sss", "rrr"] },
          { question: "Which word starts with 'S'?", answer: "Sun", options: ["Cat", "Dog", "Sun", "Ball"] }
        ];
      }
    } else if (grade === 'Grade 3') {
      if (subject === 'Math') {
        return [
          { question: "What is 4 × 3?", answer: "12", options: ["10", "11", "12", "13"] },
          { question: "What is 15 ÷ 3?", answer: "5", options: ["4", "5", "6", "7"] },
          { question: "Which number is even?", answer: "8", options: ["7", "8", "9", "11"] }
        ];
      } else if (subject === 'Science') {
        return [
          { question: "What do plants need to grow?", answer: "Water and sunlight", options: ["Only water", "Water and sunlight", "Only soil", "Only air"] },
          { question: "Which animal is a mammal?", answer: "Dog", options: ["Fish", "Bird", "Dog", "Butterfly"] },
          { question: "What happens to water when it gets very cold?", answer: "It becomes ice", options: ["It disappears", "It becomes ice", "It becomes hot", "Nothing"] }
        ];
      }
    } else if (grade === 'Grade 4') {
      if (subject === 'Math') {
        return [
          { question: "What is 1/4 + 1/4?", answer: "1/2", options: ["1/8", "1/4", "1/2", "1"] },
          { question: "What is 25 × 4?", answer: "100", options: ["90", "95", "100", "105"] },
          { question: "How many minutes are in 2 hours?", answer: "120", options: ["100", "110", "120", "130"] }
        ];
      } else if (subject === 'Social Studies') {
        return [
          { question: "What is the capital of Rwanda?", answer: "Kigali", options: ["Butare", "Kigali", "Gisenyi", "Ruhengeri"] },
          { question: "Which continent is Rwanda in?", answer: "Africa", options: ["Asia", "Europe", "Africa", "America"] },
          { question: "What language do most Rwandans speak?", answer: "Kinyarwanda", options: ["English", "French", "Kinyarwanda", "Swahili"] }
        ];
      }
    } else if (grade === 'Grade 5') {
      if (subject === 'Math') {
        return [
          { question: "What is 0.25 + 0.75?", answer: "1.0", options: ["0.9", "1.0", "1.1", "1.2"] },
          { question: "What is 20% of 50?", answer: "10", options: ["8", "9", "10", "11"] },
          { question: "What is the area of a rectangle 5×3?", answer: "15", options: ["12", "13", "15", "18"] }
        ];
      } else if (subject === 'Science') {
        return [
          { question: "What is the process plants use to make food?", answer: "Photosynthesis", options: ["Respiration", "Photosynthesis", "Digestion", "Circulation"] },
          { question: "Which planet is closest to the sun?", answer: "Mercury", options: ["Venus", "Earth", "Mercury", "Mars"] },
          { question: "What gas do we breathe in?", answer: "Oxygen", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"] }
        ];
      }
    } else if (grade === 'Grade 6') {
      if (subject === 'Math') {
        return [
          { question: "If x + 7 = 15, what is x?", answer: "8", options: ["6", "7", "8", "9"] },
          { question: "What is 3² + 4²?", answer: "25", options: ["23", "24", "25", "26"] },
          { question: "What is 60% of 80?", answer: "48", options: ["46", "47", "48", "49"] }
        ];
      } else if (subject === 'Digital Literacy') {
        return [
          { question: "What does HTML stand for?", answer: "HyperText Markup Language", options: ["High Tech Modern Language", "HyperText Markup Language", "Home Tool Markup Language", "Hard Text Making Language"] },
          { question: "Which is a safe way to create passwords?", answer: "Use letters, numbers, and symbols", options: ["Use your name only", "Use 123456", "Use letters, numbers, and symbols", "Use your birthday"] },
          { question: "What should you do if someone online asks for personal information?", answer: "Tell a trusted adult", options: ["Give them the information", "Tell a trusted adult", "Ignore them", "Ask for their information too"] }
        ];
      }
    }
    
    // Default questions if no specific match
    return [
      { question: "What should you do before crossing the street?", answer: "Look both ways", options: ["Run quickly", "Look both ways", "Close your eyes", "Jump"] },
      { question: "Which is a safe password?", answer: "MyDog123!", options: ["123", "password", "MyDog123!", "abc"] },
      { question: "What color means 'stop' in traffic lights?", answer: "Red", options: ["Green", "Yellow", "Red", "Blue"] }
    ];
  };

  const questions = generateQuestions();

  const handleAnswer = (answer) => {
    setAnswered(true);
    let newScore = score;
    
    if (answer === questions[currentQuestion].answer) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    onProgress(((currentQuestion + 1) / questions.length) * 100);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswered(false);
      } else {
        onComplete((newScore / questions.length) * 100);
      }
    }, 2000);
  };

  return (
    <div className="quiz-game">
      <div className="quiz-question">
        <h3>{questions[currentQuestion].question}</h3>
      </div>
      
      {answered ? (
        <div className="answer-feedback">
          <p>Good job! Moving to next question...</p>
        </div>
      ) : (
        <div className="quiz-options">
          {questions[currentQuestion].options.map((option, index) => (
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
      
      <div className="quiz-progress">
        Question {currentQuestion + 1} of {questions.length} | Score: {score}
      </div>
    </div>
  );
};

const InteractiveGame = ({ game, onComplete, onProgress }) => {
  const [clicks, setClicks] = useState(0);
  const targetClicks = 10;

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    onProgress((newClicks / targetClicks) * 100);
    
    if (newClicks >= targetClicks) {
      setTimeout(() => onComplete(100), 1000);
    }
  };

  return (
    <div className="interactive-game">
      <h3>Click the button {targetClicks} times!</h3>
      <div className="click-area">
        <button className="click-button" onClick={handleClick}>
          🎯 Click Me! ({clicks}/{targetClicks})
        </button>
      </div>
      {clicks >= targetClicks && (
        <div className="completion-message">
          <p>🎉 Great job! You did it!</p>
        </div>
      )}
    </div>
  );
};

const StoryGame = ({ game, onComplete, onProgress }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const story = [
    { text: "Once upon a time, there was a brave little mouse...", image: "🐭" },
    { text: "The mouse wanted to learn about computers!", image: "💻" },
    { text: "First, the mouse learned to use a keyboard.", image: "⌨️" },
    { text: "Then, the mouse learned to browse safely online.", image: "🌐" },
    { text: "The mouse became a digital expert! The End.", image: "🏆" }
  ];

  const nextPage = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    onProgress((newPage / story.length) * 100);
    
    if (newPage >= story.length - 1) {
      setTimeout(() => onComplete(100), 2000);
    }
  };

  return (
    <div className="story-game">
      <div className="story-page">
        <div className="story-image">{story[currentPage].image}</div>
        <p className="story-text">{story[currentPage].text}</p>
      </div>
      
      {currentPage < story.length - 1 && (
        <button className="next-button" onClick={nextPage}>
          Next →
        </button>
      )}
      
      <div className="story-progress">
        Page {currentPage + 1} of {story.length}
      </div>
    </div>
  );
};

const DefaultGame = ({ game, onComplete, onProgress }) => {
  const [step, setStep] = useState(0);
  const totalSteps = 5;

  const nextStep = () => {
    const newStep = step + 1;
    setStep(newStep);
    onProgress((newStep / totalSteps) * 100);
    
    if (newStep >= totalSteps) {
      onComplete(100);
    }
  };

  return (
    <div className="default-game">
      <h3>{game.title}</h3>
      <p>{game.description}</p>
      
      <div className="game-content">
        <p>Step {step + 1}: Learning about {game.subject}!</p>
        <div className="learning-content">
          {game.content ? (
            <div dangerouslySetInnerHTML={{ __html: game.content }} />
          ) : (
            <p>This is an interactive learning experience about {game.subject}.</p>
          )}
        </div>
      </div>
      
      {step < totalSteps && (
        <button className="continue-button" onClick={nextStep}>
          Continue Learning →
        </button>
      )}
    </div>
  );
};

export default GamePlayer;
