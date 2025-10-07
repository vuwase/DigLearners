import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/icons/Icon';

const LearnerDashboard = () => {
  const codingCourses = [
    {
      id: 1,
      title: "🎮 Block Coding Adventure",
      description: "Learn to code with colorful blocks! Drag and drop to create amazing programs!",
      progress: 75,
      difficulty: "Easy",
      color: "#FF677D",
      icon: "🧩",
      lessons: 8,
      completed: 6
    },
    {
      id: 2,
      title: "⌨️ Typing Superhero",
      description: "Become a typing superhero! Learn to type fast and accurately!",
      progress: 60,
      difficulty: "Medium",
      color: "#F8B400",
      icon: "⌨️",
      lessons: 10,
      completed: 6
    },
    {
      id: 3,
      title: "🛡️ Safe Internet Explorer",
      description: "Learn how to stay safe on the internet! Be a smart digital citizen!",
      progress: 40,
      difficulty: "Easy",
      color: "#B9FBC0",
      icon: "🛡️",
      lessons: 6,
      completed: 2
    },
    {
      id: 4,
      title: "🎨 Digital Art Creator",
      description: "Create amazing digital art! Learn to draw and design on the computer!",
      progress: 20,
      difficulty: "Medium",
      color: "#FFB3BA",
      icon: "🎨",
      lessons: 5,
      completed: 1
    }
  ];

  const achievements = [
    { id: 1, title: "First Steps", icon: "👶", description: "Completed your first lesson!" },
    { id: 2, title: "Block Master", icon: "🧩", description: "Finished 5 block coding lessons!" },
    { id: 3, title: "Speed Demon", icon: "⚡", description: "Typed 30 words per minute!" },
    { id: 4, title: "Safety Hero", icon: "🛡️", description: "Learned all internet safety rules!" }
  ];

  return (
    <div className="kid-dashboard">
      <div className="kid-header">
        <div className="welcome-section">
          <h1>🎉 Welcome to Your Learning Adventure!</h1>
          <p>Hi there! Ready to learn some cool coding skills? Let's have fun! 🚀</p>
        </div>
        <div className="kid-avatar">
          <div className="avatar-circle">👦</div>
          <div className="kid-info">
            <h3>Alex</h3>
            <p>Level 3 Explorer</p>
            <div className="points-display">
              <span>⭐ 850 Points</span>
            </div>
          </div>
        </div>
      </div>

      <div className="kid-stats">
        <div className="stat-card stat-1">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>12</h3>
            <p>Lessons Done!</p>
          </div>
        </div>
        <div className="stat-card stat-2">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>5</h3>
            <p>Badges Won!</p>
          </div>
        </div>
        <div className="stat-card stat-3">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>850</h3>
            <p>Total Points!</p>
          </div>
        </div>
        <div className="stat-card stat-4">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>7</h3>
            <p>Day Streak!</p>
          </div>
        </div>
      </div>

      <div className="coding-courses-section">
        <h2>🎮 My Coding Courses</h2>
        <div className="courses-grid">
          {codingCourses.map(course => (
            <div key={course.id} className="course-card" style={{ borderColor: course.color }}>
              <div className="course-header">
                <div className="course-icon">{course.icon}</div>
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
              </div>
              
              <div className="course-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${course.progress}%`,
                      backgroundColor: course.color 
                    }}
                  ></div>
                </div>
                <span className="progress-text">{course.progress}% Complete</span>
              </div>
              
              <div className="course-stats">
                <div className="stat">
                  <span className="stat-number">{course.completed}</span>
                  <span className="stat-label">of {course.lessons} lessons</span>
                </div>
                <div className="difficulty-badge" style={{ backgroundColor: course.color }}>
                  {course.difficulty}
                </div>
              </div>
              
              <Link to={`/lesson/${course.id}`} className="start-course-btn" style={{ backgroundColor: course.color }}>
                {course.completed > 0 ? 'Continue Learning! 🚀' : 'Start Course! 🎉'}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="achievements-section">
        <h2>🏆 My Achievements</h2>
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div key={achievement.id} className="achievement-card">
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
              </div>
              <div className="achievement-badge">✅</div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <h2>🎯 Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/leaderboard" className="action-btn action-1">
            <div className="action-icon">🏆</div>
            <span>Leaderboard</span>
          </Link>
          <Link to="/achievements" className="action-btn action-2">
            <div className="action-icon">⭐</div>
            <span>My Badges</span>
          </Link>
          <Link to="/progress" className="action-btn action-3">
            <div className="action-icon">📊</div>
            <span>My Progress</span>
          </Link>
          <Link to="/lessons" className="action-btn action-4">
            <div className="action-icon">📚</div>
            <span>All Lessons</span>
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .kid-dashboard {
            min-height: 100vh;
            background: linear-gradient(135deg, #FFB3BA, #B9FBC0);
            padding: 2rem;
            font-family: 'Comic Sans MS', cursive, sans-serif;
          }

          .kid-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            padding: 2rem;
            border-radius: 25px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .welcome-section h1 {
            color: #2D3748;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }

          .welcome-section p {
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
            margin: 0 0 0.5rem 0;
          }

          .points-display {
            background: linear-gradient(135deg, #FF677D, #F8B400);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.9rem;
          }

          .kid-stats {
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
          }

          .stat-card:hover {
            transform: translateY(-5px);
          }

          .stat-1 { border-left: 5px solid #FF677D; }
          .stat-2 { border-left: 5px solid #F8B400; }
          .stat-3 { border-left: 5px solid #B9FBC0; }
          .stat-4 { border-left: 5px solid #FFB3BA; }

          .stat-icon {
            font-size: 2.5rem;
          }

          .stat-content h3 {
            color: #2D3748;
            font-size: 2rem;
            margin: 0;
            font-weight: bold;
          }

          .stat-content p {
            color: #4A5568;
            margin: 0;
            font-size: 1rem;
          }

          .coding-courses-section {
            background: white;
            padding: 2rem;
            border-radius: 25px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .coding-courses-section h2 {
            color: #2D3748;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
          }

          .course-card {
            background: white;
            border: 3px solid;
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
          }

          .course-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          }

          .course-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .course-icon {
            font-size: 3rem;
          }

          .course-info h3 {
            color: #2D3748;
            font-size: 1.3rem;
            margin: 0 0 0.5rem 0;
          }

          .course-info p {
            color: #4A5568;
            margin: 0;
            font-size: 0.9rem;
            line-height: 1.4;
          }

          .course-progress {
            margin-bottom: 1rem;
          }

          .progress-bar {
            background: #E2E8F0;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 0.5rem;
          }

          .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
          }

          .progress-text {
            color: #4A5568;
            font-size: 0.9rem;
            font-weight: bold;
          }

          .course-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .stat-number {
            color: #2D3748;
            font-size: 1.5rem;
            font-weight: bold;
          }

          .stat-label {
            color: #4A5568;
            font-size: 0.9rem;
          }

          .difficulty-badge {
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: bold;
          }

          .start-course-btn {
            display: block;
            width: 100%;
            background: #FF677D;
            color: white;
            text-decoration: none;
            padding: 1rem;
            border-radius: 15px;
            text-align: center;
            font-weight: bold;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .start-course-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }

          .achievements-section {
            background: white;
            padding: 2rem;
            border-radius: 25px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .achievements-section h2 {
            color: #2D3748;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .achievements-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }

          .achievement-card {
            background: linear-gradient(135deg, #F8F9FA, #E8F5E8);
            padding: 1rem;
            border-radius: 15px;
            display: flex;
            align-items: center;
            gap: 1rem;
            border: 2px solid #E2E8F0;
          }

          .achievement-icon {
            font-size: 2rem;
          }

          .achievement-info h4 {
            color: #2D3748;
            margin: 0 0 0.25rem 0;
            font-size: 1rem;
          }

          .achievement-info p {
            color: #4A5568;
            margin: 0;
            font-size: 0.8rem;
          }

          .achievement-badge {
            font-size: 1.5rem;
          }

          .quick-actions {
            background: white;
            padding: 2rem;
            border-radius: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }

          .quick-actions h2 {
            color: #2D3748;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
          }

          .action-btn {
            background: white;
            border: 3px solid;
            border-radius: 20px;
            padding: 1.5rem;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .action-1 { border-color: #FF677D; }
          .action-2 { border-color: #F8B400; }
          .action-3 { border-color: #B9FBC0; }
          .action-4 { border-color: #FFB3BA; }

          .action-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          }

          .action-icon {
            font-size: 2rem;
          }

          .action-btn span {
            color: #2D3748;
            font-weight: bold;
            font-size: 0.9rem;
          }

          @media (max-width: 768px) {
            .kid-dashboard {
              padding: 1rem;
            }

            .kid-header {
              flex-direction: column;
              text-align: center;
              gap: 1rem;
            }

            .welcome-section h1 {
              font-size: 2rem;
            }

            .courses-grid {
              grid-template-columns: 1fr;
            }
          }
        `
      }} />
    </div>
  );
};

export default LearnerDashboard;