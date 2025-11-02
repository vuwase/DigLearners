import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../lib/language';
import Icon from '../icons/Icon';
import './Footer.css';

const Footer = () => {
  const { t, currentLanguage } = useTranslation();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <h3>DigLearners</h3>
              <p className="footer-tagline">
                {currentLanguage === 'rw' 
                  ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                  : 'Empowering digital literacy in Rwanda'
                }
              </p>
            </div>
            <div className="footer-social">
              <h4>{currentLanguage === 'rw' ? 'Twandikire' : 'Follow Us'}</h4>
              <div className="social-links">
                <a href="#" aria-label="Facebook" className="social-link facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="social-link twitter">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="social-link linkedin">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" aria-label="YouTube" className="social-link youtube">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>{currentLanguage === 'rw' ? 'Amashami' : 'Quick Links'}</h4>
            <ul>
              <li><Link to="/">{currentLanguage === 'rw' ? 'Ahabanza' : 'Home'}</Link></li>
              <li><Link to="/login">{currentLanguage === 'rw' ? 'Kwinjira' : 'Login'}</Link></li>
              <li><Link to="/enroll">{currentLanguage === 'rw' ? 'Kwiyandikisha' : 'Register'}</Link></li>
              <li><Link to="/dashboard">{currentLanguage === 'rw' ? 'Ikibaho' : 'Dashboard'}</Link></li>
            </ul>
          </div>

          {/* Learning Resources */}
          <div className="footer-links">
            <h4>{currentLanguage === 'rw' ? 'Amasomo' : 'Learning'}</h4>
            <ul>
              <li><Link to="/dashboard/games">{currentLanguage === 'rw' ? 'Amasomo yanjye' : 'My Games'}</Link></li>
              <li><Link to="/dashboard/achievements">{currentLanguage === 'rw' ? 'Intsinzi' : 'Achievements'}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-links">
            <h4>{currentLanguage === 'rw' ? 'Ubufasha' : 'Support'}</h4>
            <ul>
              <li><Link to="/help">{currentLanguage === 'rw' ? 'Ubufasha' : 'Help Center'}</Link></li>
              <li><a href="#contact">{currentLanguage === 'rw' ? 'Twandikire' : 'Contact Us'}</a></li>
              <li><Link to="/faq">{currentLanguage === 'rw' ? 'Ibibazo Byibuze' : 'FAQ'}</Link></li>
                <li><Link to="/privacy">{currentLanguage === 'rw' ? 'Politiki y\'Ubwigenge' : 'Privacy Policy'}</Link></li>
                <li><Link to="/cookies">{currentLanguage === 'rw' ? 'Politiki y\'Amakuki' : 'Cookies Policy'}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h4>{currentLanguage === 'rw' ? 'Twandikire' : 'Contact'}</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">
                  <Icon name="email" size={16} />
                </span>
                <span>info@diglearners.rw</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">
                  <Icon name="phone" size={16} />
                </span>
                <span>+250 788 123 456</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">
                  <Icon name="location" size={16} />
                </span>
                <span>{currentLanguage === 'rw' ? 'Kigali, Rwanda' : 'Kigali, Rwanda'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} DigLearners. {currentLanguage === 'rw' 
                ? 'Bose uburenganzira burabitswe.' 
                : 'All rights reserved.'
              }
            </p>
              <div className="footer-bottom-links">
                <Link to="/terms">{currentLanguage === 'rw' ? 'Amabwiriza' : 'Terms'}</Link>
                <Link to="/privacy">{currentLanguage === 'rw' ? 'Ubwigenge' : 'Privacy'}</Link>
                <Link to="/cookies">{currentLanguage === 'rw' ? 'Amakuki' : 'Cookies'}</Link>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
