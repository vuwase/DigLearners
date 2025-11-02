import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import learnerApiService from '../../services/learnerApiService';

const Lessons = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('[Lessons] Fetching lessons...');
        
        const res = await learnerApiService.getLessons();
        console.log('[Lessons] API response:', res);
        
        // Handle both response formats: { lessons: [...] } or { success: true, lessons: [...] }
        const lessonsData = res.lessons || res.data?.lessons || (Array.isArray(res) ? res : []);
        console.log('[Lessons] Extracted lessons:', lessonsData.length);
        
        setLessons(lessonsData);
        
        if (lessonsData.length === 0) {
          console.log('[Lessons] No lessons available');
        }
      } catch (e) {
        console.error('[Lessons] Error loading lessons:', e);
        setError(e.message || 'Failed to load lessons. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const startLesson = (lesson) => {
    console.log('[Lessons] Starting lesson:', lesson.id, lesson.title);
    navigate(`/dashboard/lesson/${lesson.id}`, { state: { lesson } });
  };

  if (loading) {
    return (
      <div className="lessons-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t('common.loading') || 'Loading lessons...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lessons-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>{t('common.error') || 'Error'}</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            {t('common.retry') || 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lessons-container">
      <div className="lessons-header">
        <h1>📚 {t('nav.lessons') || 'Lessons'}</h1>
        <p>{t('lessons.description') || 'Explore and learn with interactive lessons'}</p>
      </div>
      
      {lessons.length === 0 ? (
        <div className="no-lessons">
          <div className="no-lessons-icon">📖</div>
          <h3>{t('lessons.noLessons') || 'No lessons available yet'}</h3>
          <p>{t('lessons.noLessonsDesc') || 'Lessons will appear here once your teacher adds them.'}</p>
        </div>
      ) : (
        <div className="lessons-grid">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="lesson-card">
              <div className="lesson-header">
                <div className="lesson-icon">📚</div>
                <div className="lesson-category">{lesson.subject || lesson.moduleType || 'Lesson'}</div>
              </div>
              <h3 className="lesson-title">{lesson.title || 'Untitled Lesson'}</h3>
              <p className="lesson-description">{lesson.description || 'Learn something new today!'}</p>
              
              <div className="lesson-tags">
                <span className={`tag difficulty difficulty-${lesson.difficulty || 'beginner'}`}>
                  {lesson.difficulty || 'beginner'}
                </span>
                {lesson.ageGroup && (
                  <span className="tag age-group">Age {lesson.ageGroup}</span>
                )}
                {lesson.estimatedTime && (
                  <span className="tag time">⏱️ {lesson.estimatedTime} min</span>
                )}
                {lesson.isCompleted && (
                  <span className="tag completed">✓ Completed</span>
                )}
              </div>
              
              <button 
                onClick={() => startLesson(lesson)} 
                className="start-lesson-button"
                disabled={loading}
              >
                {lesson.isCompleted ? '🔁 Review Lesson' : '▶️ Start Learning'}
              </button>
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          .lessons-container {
            min-height: calc(100vh - 140px);
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Comic Sans MS', cursive, sans-serif;
          }

          .lessons-header {
            text-align: center;
            margin-bottom: 2rem;
            color: white;
          }

          .lessons-header h1 {
            font-size: 3rem;
            margin: 0 0 0.5rem 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }

          .lessons-header p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin: 0;
          }

          .lessons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }

          .lesson-card {
            background: white;
            border-radius: 25px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            border: 4px solid transparent;
            display: flex;
            flex-direction: column;
          }

          .lesson-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            border-color: #4facfe;
          }

          .lesson-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .lesson-icon {
            font-size: 3rem;
          }

          .lesson-category {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: bold;
          }

          .lesson-title {
            color: #2D3748;
            font-size: 1.5rem;
            margin: 0 0 1rem 0;
            font-weight: bold;
          }

          .lesson-description {
            color: #4A5568;
            margin: 0 0 1.5rem 0;
            font-size: 1rem;
            line-height: 1.5;
            flex-grow: 1;
          }

          .lesson-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }

          .tag {
            padding: 0.4rem 0.8rem;
            border-radius: 15px;
            font-size: 0.85rem;
            font-weight: bold;
          }

          .tag.difficulty {
            text-transform: capitalize;
          }

          .tag.difficulty-beginner {
            background: #dcfce7;
            color: #166534;
          }

          .tag.difficulty-intermediate {
            background: #fef3c7;
            color: #92400e;
          }

          .tag.difficulty-advanced {
            background: #fee2e2;
            color: #991b1b;
          }

          .tag.age-group {
            background: #e0f2fe;
            color: #0e7490;
          }

          .tag.time {
            background: #fef3c7;
            color: #92400e;
          }

          .tag.completed {
            background: #dcfce7;
            color: #166534;
          }

          .start-lesson-button {
            width: 100%;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 20px;
            font-weight: bold;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
          }

          .start-lesson-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #16a34a, #15803d);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
          }

          .start-lesson-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .loading-state,
          .error-state,
          .no-lessons {
            text-align: center;
            padding: 4rem 2rem;
            color: white;
          }

          .spinner {
            width: 60px;
            height: 60px;
            border: 6px solid rgba(255,255,255,0.3);
            border-top: 6px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1.5rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .error-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .error-state h3,
          .no-lessons h3 {
            font-size: 2rem;
            margin: 0 0 1rem 0;
          }

          .retry-button {
            background: white;
            color: #667eea;
            border: none;
            padding: 1rem 2rem;
            border-radius: 20px;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.3s ease;
          }

          .retry-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }

          .no-lessons-icon {
            font-size: 5rem;
            margin-bottom: 1rem;
          }

          @media (max-width: 768px) {
            .lessons-container {
              padding: 1rem;
            }

            .lessons-header h1 {
              font-size: 2.5rem;
            }

            .lessons-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }

            .lesson-card {
              padding: 1.5rem;
            }
          }
        `
      }} />
    </div>
  );
};

export default Lessons;


