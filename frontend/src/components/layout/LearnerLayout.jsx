import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './LearnerLayout.css';

const LearnerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="learner-layout">
      {/* Simple top bar for kids */}
      <header className="learner-header">
        <div className="header-left">
          <Link to="/dashboard" className="app-title-link">
            <h1 className="app-title">🎮 DigLearners</h1>
          </Link>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">👦 {user?.fullName?.split(' ')[0] || 'Student'}</span>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Simple navigation for kids */}
      <nav className="learner-nav">
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') && !isActive('/dashboard/lessons') && !isActive('/dashboard/games') && !isActive('/dashboard/achievements') ? 'active' : ''}`}
        >
          🏠 {t('nav.home') || 'Home'}
        </Link>
        <Link 
          to="/dashboard/lessons" 
          className={`nav-link ${isActive('/dashboard/lessons') ? 'active' : ''}`}
        >
          📚 {t('nav.lessons') || 'Lessons'}
        </Link>
        <Link 
          to="/dashboard/games" 
          className={`nav-link ${isActive('/dashboard/games') ? 'active' : ''}`}
        >
          🎮 {t('student.games') || 'Games'}
        </Link>
        <Link 
          to="/dashboard/achievements" 
          className={`nav-link ${isActive('/dashboard/achievements') ? 'active' : ''}`}
        >
          🏆 {t('student.achievements') || 'Achievements'}
        </Link>
      </nav>

      {/* Main content area */}
      <main className="learner-main">
        {children}
      </main>
    </div>
  );
};

export default LearnerLayout;
