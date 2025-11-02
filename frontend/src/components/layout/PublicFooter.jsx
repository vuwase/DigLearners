import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../lib/language';
import Icon from '../icons/Icon';
import './PublicFooter.css';

const PublicFooter = () => {
  const { t, currentLanguage } = useTranslation();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="public-footer">
      <div className="public-footer-container">
        {/* Main Footer Content */}
        <div className="public-footer-main">
          {/* Brand Section */}
          <div className="public-footer-brand">
            <div className="public-footer-logo">
              <h3>DigLearners</h3>
              <p className="public-footer-tagline">
                {currentLanguage === 'rw' 
                  ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                  : 'Empowering digital literacy in Rwanda'
                }
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="public-footer-links">
            <h4>{currentLanguage === 'rw' ? 'Amashami' : 'Quick Links'}</h4>
            <ul>
              <li><Link to="/">{currentLanguage === 'rw' ? 'Ahabanza' : 'Home'}</Link></li>
              <li><Link to="/login">{currentLanguage === 'rw' ? 'Kwinjira' : 'Login'}</Link></li>
              <li><Link to="/enroll">{currentLanguage === 'rw' ? 'Kwiyandikisha' : 'Register'}</Link></li>
            </ul>
          </div>

          {/* Learning Modules */}
          <div className="public-footer-links">
            <h4>{currentLanguage === 'rw' ? 'Amasomo' : 'Learning Modules'}</h4>
            <ul>
              <li><a href="#typing">{currentLanguage === 'rw' ? 'Gusoma no kwandika' : 'Typing Skills'}</a></li>
              <li><a href="#browsing">{currentLanguage === 'rw' ? 'Gushakisha mu murongo' : 'Safe Browsing'}</a></li>
              <li><a href="#coding">{currentLanguage === 'rw' ? 'Gukora code' : 'Block Coding'}</a></li>
              <li><a href="#digital">{currentLanguage === 'rw' ? 'Ubwoba bwo mu ikoranabuhanga' : 'Digital Literacy'}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="public-footer-links">
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
          <div className="public-footer-contact">
            <h4>{currentLanguage === 'rw' ? 'Twandikire' : 'Contact'}</h4>
            <div className="public-contact-info">
              <div className="public-contact-item">
                <span className="public-contact-icon">
                  <Icon name="email" size={16} />
                </span>
                <span>info@diglearners.rw</span>
              </div>
              <div className="public-contact-item">
                <span className="public-contact-icon">
                  <Icon name="phone" size={16} />
                </span>
                <span>+250 788 123 456</span>
              </div>
              <div className="public-contact-item">
                <span className="public-contact-icon">
                  <Icon name="location" size={16} />
                </span>
                <span>{currentLanguage === 'rw' ? 'Kigali, Rwanda' : 'Kigali, Rwanda'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="public-footer-bottom">
          <div className="public-footer-bottom-content">
            <p className="public-copyright">
              &copy; {currentYear} DigLearners. {currentLanguage === 'rw' 
                ? 'Bose uburenganzira burabitswe.' 
                : 'All rights reserved.'
              }
            </p>
              <div className="public-footer-bottom-links">
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

export default PublicFooter;
