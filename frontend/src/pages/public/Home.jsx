// Home Page Component - Kid-Friendly Design
import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import PublicFooter from '../../components/layout/PublicFooter'
import Icon from '../../components/icons/Icon'

const Home = () => {
  const { t, language, changeLanguage, availableLanguages } = useLanguage()

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="language-selector">
          <div className="language-dropdown">
            <label htmlFor="language-select">{t('welcome.chooseLanguage')}:</label>
            <select 
              id="language-select"
              value={language} 
              onChange={(e) => changeLanguage(e.target.value)}
              className="language-select"
            >
              {availableLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <Icon name="achievement" size={24} />
            <span>{t('welcome.madeByTeachers')}</span>
          </div>
          <h1>{t('welcome.title')}</h1>
          <p className="hero-subtitle">{t('welcome.subtitle')}</p>
          <p className="hero-description">
            {t('welcome.description')}
          </p>
          <div className="hero-actions">
            <Link to="/enroll" className="btn btn-primary">
              {t('welcome.enrollChild')}
            </Link>
            <Link to="/login" className="btn btn-secondary">
              {t('welcome.login')}
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="cartoon-characters">
            <div className="cartoon-boy">
              <div className="boy-face">😊</div>
              <div className="boy-body">👦</div>
            </div>
            <div className="cartoon-girl">
              <div className="girl-face">😊</div>
              <div className="girl-body">👧</div>
            </div>
            <div className="floating-icons">
              <div className="floating-star">⭐</div>
              <div className="floating-heart">💖</div>
              <div className="floating-book">📚</div>
              <div className="floating-computer">💻</div>
            </div>
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="container">
          <h2>{t('welcome.whyDigLearners')} 🌟</h2>
          <div className="features-grid">
            <div className="feature-card feature-card-1">
              <div className="feature-icon">🎮</div>
              <h3>{t('welcome.feature1')}</h3>
              <p>{t('welcome.feature1Desc')}</p>
            </div>
            <div className="feature-card feature-card-2">
              <div className="feature-icon">🏆</div>
              <h3>{t('welcome.feature2')}</h3>
              <p>{t('welcome.feature2Desc')}</p>
            </div>
            <div className="feature-card feature-card-3">
              <div className="feature-icon">🌍</div>
              <h3>{t('welcome.feature3')}</h3>
              <p>{t('welcome.feature3Desc')}</p>
            </div>
            <div className="feature-card feature-card-4">
              <div className="feature-icon">👨‍👩‍👧‍👦</div>
              <h3>{t('welcome.feature4')}</h3>
              <p>{t('welcome.feature4Desc')}</p>
            </div>
            <div className="feature-card feature-card-5">
              <div className="feature-icon">📱</div>
              <h3>{t('welcome.feature5')}</h3>
              <p>{t('welcome.feature5Desc')}</p>
            </div>
            <div className="feature-card feature-card-6">
              <div className="feature-icon">🎨</div>
              <h3>{t('welcome.feature6')}</h3>
              <p>{t('welcome.feature6Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-badge">
            <Icon name="star" size={20} />
            <span>{t('welcome.joinTheFun')}</span>
          </div>
          <h2>{t('welcome.readyToStart')} 🚀</h2>
          <p>{t('welcome.joinThousands')}</p>
          <div className="cta-actions">
            <Link to="/enroll" className="btn btn-primary btn-large">
              {t('welcome.enrollToday')} 🎉
            </Link>
          </div>
          <div className="parent-note">
            <p>👨‍👩‍👧‍👦 <strong>{t('welcome.forParents')}</strong> {t('welcome.parentNote')}</p>
          </div>
        </div>
      </section>

      <PublicFooter />

      <style dangerouslySetInnerHTML={{
        __html: `
          /* Kid-Friendly Color Palette */
          :root {
            --primary-color: #FF677D;      /* Vibrant Pink */
            --secondary-color: #F8B400;    /* Golden Yellow */
            --third-color: #B9FBC0;        /* Soft Mint Green */
            --accent-pink: #FFB3BA;        /* Light Pink */
            --accent-mauve: #D4A5A5;       /* Muted Rose */
            --text-dark: #2D3748;
            --text-light: #4A5568;
          }

          .home-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #FFB3BA, #B9FBC0);
            font-family: 'Comic Sans MS', cursive, sans-serif;
          }

          .language-selector {
            position: absolute;
            top: 2rem;
            right: 2rem;
            z-index: 10;
          }

          .language-dropdown {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.9);
            padding: 0.75rem 1rem;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
          }

          .language-dropdown label {
            color: #2D3748;
            font-weight: bold;
            font-size: 0.9rem;
            white-space: nowrap;
          }

          .language-select {
            background: white;
            border: 2px solid #E2E8F0;
            border-radius: 15px;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            font-weight: bold;
            color: #2D3748;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 120px;
          }

          .language-select:focus {
            outline: none;
            border-color: #FF677D;
            box-shadow: 0 0 0 3px rgba(255, 103, 125, 0.1);
          }

          .language-select:hover {
            border-color: #FF677D;
          }

          /* Hero Section with Kid-Friendly Design */
          .hero-section {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 4rem 2rem;
            display: flex;
            align-items: center;
            min-height: 80vh;
            position: relative;
            overflow: hidden;
          }

          .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
            animation: float 6s ease-in-out infinite;
          }

          .hero-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            font-weight: bold;
            backdrop-filter: blur(10px);
          }

          .hero-content {
            flex: 1;
            max-width: 600px;
            position: relative;
            z-index: 2;
          }

          .hero-content h1 {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            animation: bounce 2s ease-in-out infinite;
          }

          .hero-subtitle {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }

          .hero-description {
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            opacity: 0.95;
          }

          .hero-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .btn {
            padding: 1rem 2rem;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-block;
            font-size: 1.1rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }

          .btn-primary {
            background: var(--third-color);
            color: var(--text-dark);
            border: 3px solid white;
          }

          .btn-primary:hover {
            background: white;
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          }

          .btn-secondary {
            background: transparent;
            color: white;
            border: 3px solid white;
          }

          .btn-secondary:hover {
            background: white;
            color: var(--primary-color);
            transform: translateY(-3px) scale(1.05);
          }

          .btn-large {
            padding: 1.5rem 3rem;
            font-size: 1.3rem;
            border-radius: 30px;
          }

          /* Cartoon Characters */
          .hero-image {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            z-index: 2;
          }

          .cartoon-characters {
            position: relative;
            width: 400px;
            height: 400px;
          }

          .cartoon-boy, .cartoon-girl {
            position: absolute;
            font-size: 4rem;
            animation: bounce 2s ease-in-out infinite;
          }

          .cartoon-boy {
            top: 20%;
            left: 20%;
            animation-delay: 0s;
          }

          .cartoon-girl {
            top: 20%;
            right: 20%;
            animation-delay: 0.5s;
          }

          .floating-icons {
            position: absolute;
            width: 100%;
            height: 100%;
          }

          .floating-star, .floating-heart, .floating-book, .floating-computer {
            position: absolute;
            font-size: 2rem;
            animation: float 3s ease-in-out infinite;
          }

          .floating-star {
            top: 10%;
            right: 10%;
            animation-delay: 0s;
          }

          .floating-heart {
            bottom: 30%;
            left: 10%;
            animation-delay: 1s;
          }

          .floating-book {
            bottom: 10%;
            right: 30%;
            animation-delay: 2s;
          }

          .floating-computer {
            top: 50%;
            left: 5%;
            animation-delay: 1.5s;
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }

          /* Features Section */
          .features-section {
            padding: 4rem 2rem;
            background: linear-gradient(135deg, #B9FBC0, #FFB3BA);
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .features-section h2 {
            text-align: center;
            font-size: 3rem;
            color: var(--text-dark);
            margin-bottom: 3rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }

          .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            text-align: center;
            transition: all 0.3s ease;
            border: 3px solid transparent;
            position: relative;
            overflow: hidden;
          }

          .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--third-color));
          }

          .feature-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          }

          .feature-card-1:hover { border-color: var(--primary-color); }
          .feature-card-2:hover { border-color: var(--secondary-color); }
          .feature-card-3:hover { border-color: var(--third-color); }
          .feature-card-4:hover { border-color: var(--accent-pink); }
          .feature-card-5:hover { border-color: var(--accent-mauve); }
          .feature-card-6:hover { border-color: var(--primary-color); }

          .feature-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: wiggle 2s ease-in-out infinite;
          }

          .feature-card h3 {
            color: var(--text-dark);
            font-size: 1.5rem;
            margin-bottom: 1rem;
            font-weight: bold;
          }

          .feature-card p {
            color: var(--text-light);
            line-height: 1.6;
            font-size: 1.1rem;
          }

          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
          }

          /* CTA Section */
          .cta-section {
            background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
            color: white;
            padding: 4rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
          }

          .cta-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="20" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="20" cy="90" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
            animation: float 8s ease-in-out infinite;
          }

          .cta-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            font-weight: bold;
            backdrop-filter: blur(10px);
          }

          .cta-section h2 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 2;
          }

          .cta-section p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            opacity: 0.95;
            position: relative;
            z-index: 2;
          }

          .cta-actions {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
            position: relative;
            z-index: 2;
          }

          .parent-note {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            position: relative;
            z-index: 2;
            max-width: 600px;
            margin: 0 auto;
          }

          .parent-note p {
            margin: 0;
            font-size: 1.1rem;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .language-selector {
              position: relative;
              top: auto;
              right: auto;
              margin-bottom: 1rem;
              display: flex;
              justify-content: center;
            }

            .language-dropdown {
              flex-direction: column;
              gap: 0.5rem;
              text-align: center;
            }

            .hero-section {
              flex-direction: column;
              text-align: center;
              padding: 2rem 1rem;
            }

            .hero-content h1 {
              font-size: 2.5rem;
            }

            .hero-actions {
              justify-content: center;
            }

            .cartoon-characters {
              width: 300px;
              height: 300px;
            }

            .features-section h2 {
              font-size: 2rem;
            }

            .cta-section h2 {
              font-size: 2rem;
            }
          }
        `
      }} />
    </div>
  )
}

export default Home
