import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import StudentProfile from '../student/StudentProfile';
import './LearnerLayout.css';

const LearnerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
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
            {/* Language Switcher */}
            <div className="language-switcher">
              <button 
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
                title="English"
              >
                🇬🇧 EN
              </button>
              <button 
                className={`lang-btn ${language === 'rw' ? 'active' : ''}`}
                onClick={() => changeLanguage('rw')}
                title="Kinyarwanda"
              >
                🇷🇼 RW
              </button>
            </div>
            <StudentProfile showFullProfile={false} />
            <button className="logout-btn" onClick={handleLogout}>
              🚪 {t('nav.logout') || 'Logout'}
            </button>
          </div>
        </div>
      </header>

      {/* Simple navigation for kids */}
      <nav className="learner-nav">
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === '/dashboard' || location.pathname === '/dashboard/' ? 'active' : ''}`}
        >
          🏠 {t('nav.home') || 'My Dashboard'}
        </Link>
        <Link 
          to="/dashboard/games" 
          className={`nav-link ${isActive('/dashboard/games') ? 'active' : ''}`}
        >
          🎮 {t('nav.games') || 'Games'}
        </Link>
        <Link 
          to="/dashboard/puzzles" 
          className={`nav-link ${isActive('/dashboard/puzzles') ? 'active' : ''}`}
        >
          🧩 {t('nav.puzzles') || 'Puzzles'}
        </Link>
        <Link 
          to="/dashboard/achievements" 
          className={`nav-link ${isActive('/dashboard/achievements') ? 'active' : ''}`}
        >
          🏆 {t('nav.achievements') || 'Achievement'}
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
