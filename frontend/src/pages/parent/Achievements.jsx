import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import { getAchievementsData } from '../../services/parentMockDataService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const Achievements = () => {
  const { t, currentLanguage } = useTranslation();
  const data = getAchievementsData();
  const [selectedChild, setSelectedChild] = useState(data.children[0].id);
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('recent'); // recent, all, earned

  const currentChild = data.children.find(child => child.id === selectedChild);
  
  const filteredBadges = filterCategory === 'all' 
    ? currentChild?.allBadges || []
    : currentChild?.allBadges.filter(badge => badge.category === filterCategory) || [];

  const categories = [
    { key: 'all', label: currentLanguage === 'rw' ? 'Byose' : 'All' },
    { key: 'Safety', label: currentLanguage === 'rw' ? 'Umutekano' : 'Safety' },
    { key: 'Coding', label: currentLanguage === 'rw' ? 'Gukora Code' : 'Coding' },
    { key: 'Consistency', label: currentLanguage === 'rw' ? 'Gukomeza' : 'Consistency' },
    { key: 'Milestone', label: currentLanguage === 'rw' ? 'Intsinzi' : 'Milestone' },
    { key: 'Skill', label: currentLanguage === 'rw' ? 'Ubuhanga' : 'Skill' }
  ];

  const viewModes = [
    { key: 'recent', label: currentLanguage === 'rw' ? 'Ryihariye' : 'Recent' },
    { key: 'earned', label: currentLanguage === 'rw' ? 'Yarangije' : 'Earned' },
    { key: 'all', label: currentLanguage === 'rw' ? 'Byose' : 'All' }
  ];

  const getDisplayBadges = () => {
    if (viewMode === 'recent') {
      return currentChild?.recentBadges || [];
    } else if (viewMode === 'earned') {
      return filteredBadges.filter(badge => badge.earned);
    } else {
      return filteredBadges;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Ibyubahiro' 
                : 'Achievements'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Reba ibyubahiro n\'intsinzi z\'abana banyu'
                : 'View badges and accomplishments'
              }
            </p>
          </div>
        </div>

        {/* Child Selector */}
        <div className="child-selector">
          <h3>
            {currentLanguage === 'rw' ? 'Hitamo Umwana' : 'Select Child'}
          </h3>
          <div className="child-tabs">
            {data.children.map((child) => (
              <button
                key={child.id}
                className={`child-tab ${selectedChild === child.id ? 'active' : ''}`}
                onClick={() => setSelectedChild(child.id)}
              >
                <span className="child-avatar">{child.avatar}</span>
                <div className="child-info">
                  <span className="child-name">{child.name}</span>
                  <span className="child-grade">{child.grade}</span>
                </div>
                <div className="child-stats">
                  <span>{child.totalBadges} {currentLanguage === 'rw' ? 'ibyubahiro' : 'badges'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="view-controls">
          <div className="view-toggle">
            {viewModes.map((mode) => (
              <button
                key={mode.key}
                className={`view-btn ${viewMode === mode.key ? 'active' : ''}`}
                onClick={() => setViewMode(mode.key)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <h3>
            {currentLanguage === 'rw' ? 'Hitamo Ubwoko' : 'Filter by Category'}
          </h3>
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category.key}
                className={`category-tab ${filterCategory === category.key ? 'active' : ''}`}
                onClick={() => setFilterCategory(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Child Achievements */}
        {currentChild && (
          <div className="achievements-section">
            <div className="achievements-header">
              <div className="child-info">
                <div className="child-avatar-large">{currentChild.avatar}</div>
                <div>
                  <h2>{currentChild.name}</h2>
                  <p>{currentChild.grade}</p>
                  <p>{currentChild.totalBadges} {currentLanguage === 'rw' ? 'ibyubahiro byose' : 'total badges'}</p>
                </div>
              </div>
              <div className="achievements-summary">
                <div className="summary-stat">
                  <span className="stat-number">{currentChild.totalBadges}</span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Ibyubahiro' : 'Badges Earned'}
                  </span>
                </div>
                <div className="summary-stat">
                  <span className="stat-number">{currentChild.recentBadges.length}</span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Ryihariye' : 'Recent'}
                  </span>
                </div>
                <div className="summary-stat">
                  <span className="stat-number">
                    {Math.round((currentChild.allBadges.filter(badge => badge.earned).length / currentChild.allBadges.length) * 100)}%
                  </span>
                  <span className="stat-label">
                    {currentLanguage === 'rw' ? 'Imikurire' : 'Progress'}
                  </span>
                </div>
              </div>
            </div>

            {/* Badges Display */}
            <div className="badges-display">
              <h3>
                {viewMode === 'recent' && (currentLanguage === 'rw' ? 'Ibyubahiro Ryihariye' : 'Recent Badges')}
                {viewMode === 'earned' && (currentLanguage === 'rw' ? 'Ibyubahiro Yarangije' : 'Earned Badges')}
                {viewMode === 'all' && (currentLanguage === 'rw' ? 'Ibyubahiro Byose' : 'All Badges')}
              </h3>
              <div className="badges-grid">
                {getDisplayBadges().map((badge) => (
                  <div key={badge.id} className={`badge-card ${badge.earned ? 'earned' : 'not-earned'} ${badge.earned && badge.date ? 'recent' : ''}`}>
                    <div className="badge-icon">{badge.icon}</div>
                    <div className="badge-content">
                      <h4>{badge.title}</h4>
                      <p>{badge.description}</p>
                      {badge.earned && badge.date && (
                        <span className="badge-date">{badge.date}</span>
                      )}
                    </div>
                    <div className="badge-category">{badge.category}</div>
                    {badge.earned && (
                      <div className="badge-status">
                        <Icon name="check" size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="category-breakdown">
              <h3>
                {currentLanguage === 'rw' ? 'Ibyiciro by\'Ibyubahiro' : 'Badge Categories'}
              </h3>
              <div className="category-stats">
                {categories.slice(1).map((category) => {
                  const categoryBadges = currentChild.allBadges.filter(badge => badge.category === category.key);
                  const earnedBadges = categoryBadges.filter(badge => badge.earned);
                  return (
                    <div key={category.key} className="category-stat">
                      <div className="category-header">
                        <h4>{category.label}</h4>
                        <span className="category-count">{earnedBadges.length}/{categoryBadges.length}</span>
                      </div>
                      <div className="category-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${(earnedBadges.length / categoryBadges.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {Math.round((earnedBadges.length / categoryBadges.length) * 100)}% {currentLanguage === 'rw' ? 'yarangije' : 'complete'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="summary-stats">
          <h3>
            {currentLanguage === 'rw' ? 'Incamake' : 'Summary'}
          </h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="achievement" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.totalBadges}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ibyubahiro Byose' : 'Total Badges'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="new" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.recentBadges}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ryihariye' : 'Recent Badges'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="shield" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.topCategory}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ubwoko bw\'Icyubahiro' : 'Top Category'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="star" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.mostActiveChild}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Umwana ukora cyane' : 'Most Active Child'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
