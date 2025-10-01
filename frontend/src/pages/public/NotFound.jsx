// 404 Not Found Page
import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

const NotFound = () => {
  const { t } = useLanguage()

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-secondary">
              Go Back
            </button>
          </div>
        </div>
        <div className="not-found-illustration">
          <div className="floating-elements">
            <div className="element element-1">📚</div>
            <div className="element element-2">💻</div>
            <div className="element element-3">🎓</div>
            <div className="element element-4">⭐</div>
            <div className="element element-5">🔍</div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .not-found-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #0ea5a4, #06b6d4);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }

          .not-found-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 3rem;
            max-width: 600px;
            width: 100%;
            display: flex;
            align-items: center;
            gap: 2rem;
          }

          .not-found-content {
            flex: 1;
          }

          .error-code {
            font-size: 6rem;
            font-weight: bold;
            color: #0ea5a4;
            line-height: 1;
            margin-bottom: 1rem;
          }

          .not-found-content h1 {
            color: #374151;
            font-size: 2rem;
            margin-bottom: 1rem;
          }

          .not-found-content p {
            color: #6b7280;
            font-size: 1.1rem;
            margin-bottom: 2rem;
            line-height: 1.6;
          }

          .not-found-actions {
            display: flex;
            gap: 1rem;
          }

          .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            display: inline-block;
            border: none;
            cursor: pointer;
          }

          .btn-primary {
            background: #0ea5a4;
            color: white;
          }

          .btn-primary:hover {
            background: #0d9488;
            transform: translateY(-2px);
          }

          .btn-secondary {
            background: transparent;
            color: #0ea5a4;
            border: 2px solid #0ea5a4;
          }

          .btn-secondary:hover {
            background: #0ea5a4;
            color: white;
          }

          .not-found-illustration {
            flex: 1;
            position: relative;
            height: 200px;
          }

          .floating-elements {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .element {
            position: absolute;
            font-size: 2rem;
            animation: float 3s ease-in-out infinite;
          }

          .element-1 {
            top: 10%;
            left: 20%;
            animation-delay: 0s;
          }

          .element-2 {
            top: 30%;
            right: 20%;
            animation-delay: 0.5s;
          }

          .element-3 {
            top: 60%;
            left: 10%;
            animation-delay: 1s;
          }

          .element-4 {
            bottom: 20%;
            right: 30%;
            animation-delay: 1.5s;
          }

          .element-5 {
            top: 50%;
            left: 50%;
            animation-delay: 2s;
          }

          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg); 
            }
            50% { 
              transform: translateY(-20px) rotate(10deg); 
            }
          }

          @media (max-width: 768px) {
            .not-found-container {
              flex-direction: column;
              text-align: center;
            }

            .error-code {
              font-size: 4rem;
            }

            .not-found-actions {
              justify-content: center;
            }

            .not-found-illustration {
              height: 150px;
            }
          }
        `
      }} />
    </div>
  )
}

export default NotFound
