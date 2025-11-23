import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gamifiedApiService from '../services/gamifiedApiService';
import './AgeGroupSelector.css';

const AgeGroupSelector = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const ageGroups = [
    {
      id: '6-7',
      label: '6-7 years',
      description: 'Grade 1 - Early Elementary',
      icon: '🌟',
      color: '#fbbf24'
    },
    {
      id: '7-8',
      label: '7-8 years',
      description: 'Grade 2 - Elementary',
      icon: '🎨',
      color: '#f59e0b'
    },
    {
      id: '8-9',
      label: '8-9 years',
      description: 'Grade 3 - Elementary',
      icon: '🚀',
      color: '#10b981'
    },
    {
      id: '9-10',
      label: '9-10 years',
      description: 'Grade 4 - Elementary',
      icon: '🧩',
      color: '#3b82f6'
    },
    {
      id: '10-11',
      label: '10-11 years',
      description: 'Grade 5 - Upper Elementary',
      icon: '🎯',
      color: '#8b5cf6'
    },
    {
      id: '11-12',
      label: '11-12 years',
      description: 'Grade 6 - Upper Elementary',
      icon: '🎓',
      color: '#ef4444'
    }
  ];

  const handleAgeGroupSelect = async (ageGroup) => {
    setSelectedAgeGroup(ageGroup);
    setLoading(true);
    setError('');

    try {
      // Fetch content for the selected age group
      const response = await gamifiedApiService.getContentByAgeGroup(ageGroup);
      
      // Store the selected age group and content in localStorage
      localStorage.setItem('selectedAgeGroup', ageGroup);
      localStorage.setItem('ageGroupContent', JSON.stringify(response.data));
      
      // Navigate to the learner dashboard with age group content
      navigate('/dashboard/games', { 
        state: { 
          ageGroup, 
          content: response.data 
        } 
      });
    } catch (err) {
      setError('Failed to load content. Please try again.');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="age-group-selector">
      <div className="selector-container">
        <div className="character-section">
          <div className="character">
            <div className="character-avatar">🎮</div>
            <div className="speech-bubble">
              <p>Choose your age group</p>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h1 className="platform-title">KEAKO world</h1>
          <p className="subtitle">To create personal learning plan</p>
          
          <div className="age-groups-grid">
            {ageGroups.map((group) => (
              <button
                key={group.id}
                className={`age-group-card ${selectedAgeGroup === group.id ? 'selected' : ''}`}
                onClick={() => handleAgeGroupSelect(group.id)}
                disabled={loading}
                style={{ '--card-color': group.color }}
              >
                <div className="age-group-icon">{group.icon}</div>
                <div className="age-group-label">{group.label}</div>
                <div className="age-group-description">{group.description}</div>
              </button>
            ))}
          </div>

          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Loading your personalized content...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button 
                className="retry-button"
                onClick={() => setError('')}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgeGroupSelector;
