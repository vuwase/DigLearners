// Home Page Component
import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

const Home = () => {
  const { t } = useLanguage()

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content">
          <h1>DigLearners</h1>
          <p className="hero-subtitle">Digital Literacy Platform for Rwandan Primary Schools</p>
          <p className="hero-description">
            Empowering young learners with essential digital skills through interactive, 
            gamified learning experiences designed for offline-first environments.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">
              {t('nav.login')}
            </Link>
            <Link to="/register" className="btn btn-secondary">
              {t('nav.register')}
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="learning-illustration">
            <div className="student-icon">🎓</div>
            <div className="computer-icon">💻</div>
            <div className="book-icon">📚</div>
            <div className="star-icon">⭐</div>
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="container">
          <h2>Why DigLearners?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Offline-First</h3>
              <p>Works seamlessly in low-bandwidth and rural areas with offline capabilities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Gamified Learning</h3>
              <p>Engaging points, badges, and levels to motivate young learners</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Multilingual</h3>
              <p>Available in English and Kinyarwanda for local accessibility</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">♿</div>
              <h3>Accessible</h3>
              <p>Designed with accessibility features for inclusive learning</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍👩‍👧‍👦</div>
              <h3>Family Engagement</h3>
              <p>Parents can track their child's progress and achievements</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Research-Driven</h3>
              <p>Built on educational research for effective digital literacy learning</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students already learning digital skills with DigLearners</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 DigLearners. Empowering digital literacy in Rwanda.</p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
          .home-page {
            min-height: 100vh;
            background: #f8f9fa;
          }

          .hero-section {
            background: linear-gradient(135deg, #0ea5a4, #06b6d4);
            color: white;
            padding: 4rem 2rem;
            display: flex;
            align-items: center;
            min-height: 80vh;
          }

          .hero-content {
            flex: 1;
            max-width: 600px;
          }

          .hero-content h1 {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }

          .hero-subtitle {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            opacity: 0.9;
          }

          .hero-description {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            opacity: 0.8;
          }

          .hero-actions {
            display: flex;
            gap: 1rem;
          }

          .btn {
            padding: 1rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-block;
          }

          .btn-primary {
            background: white;
            color: #0ea5a4;
          }

          .btn-primary:hover {
            background: #f8f9fa;
            transform: translateY(-2px);
          }

          .btn-secondary {
            background: transparent;
            color: white;
            border: 2px solid white;
          }

          .btn-secondary:hover {
            background: white;
            color: #0ea5a4;
          }

          .btn-large {
            padding: 1.25rem 2.5rem;
            font-size: 1.1rem;
          }

          .hero-image {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .learning-illustration {
            position: relative;
            width: 300px;
            height: 300px;
          }

          .student-icon, .computer-icon, .book-icon, .star-icon {
            position: absolute;
            font-size: 3rem;
            animation: float 3s ease-in-out infinite;
          }

          .student-icon {
            top: 20%;
            left: 20%;
            animation-delay: 0s;
          }

          .computer-icon {
            top: 20%;
            right: 20%;
            animation-delay: 0.5s;
          }

          .book-icon {
            bottom: 20%;
            left: 20%;
            animation-delay: 1s;
          }

          .star-icon {
            bottom: 20%;
            right: 20%;
            animation-delay: 1.5s;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          .features-section {
            padding: 4rem 2rem;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .features-section h2 {
            text-align: center;
            font-size: 2.5rem;
            color: #0ea5a4;
            margin-bottom: 3rem;
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }

          .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.3s ease;
          }

          .feature-card:hover {
            transform: translateY(-4px);
          }

          .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .feature-card h3 {
            color: #0ea5a4;
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .feature-card p {
            color: #6b7280;
            line-height: 1.6;
          }

          .cta-section {
            background: #0ea5a4;
            color: white;
            padding: 4rem 2rem;
            text-align: center;
          }

          .cta-section h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }

          .cta-section p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
          }

          .cta-actions {
            display: flex;
            justify-content: center;
          }

          .footer {
            background: #374151;
            color: white;
            padding: 2rem;
            text-align: center;
          }

          @media (max-width: 768px) {
            .hero-section {
              flex-direction: column;
              text-align: center;
            }

            .hero-content h1 {
              font-size: 2.5rem;
            }

            .hero-actions {
              justify-content: center;
            }

            .learning-illustration {
              width: 200px;
              height: 200px;
            }
          }
        `
      }} />
    </div>
  )
}

export default Home
