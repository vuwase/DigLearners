import React, { useState, useEffect } from 'react';
import { useTranslation } from '../lib/language';
import './CookiesBanner.css';

const CookiesBanner = () => {
  const { t, currentLanguage } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    functional: true,
    analytics: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('diglearners-cookies-accepted');
    const cookiePrefs = localStorage.getItem('diglearners-cookie-preferences');
    
    if (cookieChoice === null) {
      setShowBanner(true);
    } else {
      setCookiesAccepted(cookieChoice === 'true');
    }
    
    if (cookiePrefs) {
      setCookiePreferences(JSON.parse(cookiePrefs));
    }
  }, []);

  const acceptCookies = () => {
    // Accept all cookies
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true
    };
    
    localStorage.setItem('diglearners-cookies-accepted', 'true');
    localStorage.setItem('diglearners-cookie-preferences', JSON.stringify(allAccepted));
    setCookiePreferences(allAccepted);
    setCookiesAccepted(true);
    setShowBanner(false);
    
    // Show success message
    showCookieMessage(
      currentLanguage === 'rw' 
        ? 'Amakuki yemewe! Urubuga rwacu ruzakora neza.' 
        : 'Cookies accepted! Our website will work optimally.'
    );
  };

  const rejectCookies = () => {
    // Only accept essential cookies
    const essentialOnly = {
      essential: true,
      functional: false,
      analytics: false
    };
    
    localStorage.setItem('diglearners-cookies-accepted', 'false');
    localStorage.setItem('diglearners-cookie-preferences', JSON.stringify(essentialOnly));
    setCookiePreferences(essentialOnly);
    setCookiesAccepted(false);
    setShowBanner(false);
    
    // Show info message
    showCookieMessage(
      currentLanguage === 'rw'
        ? 'Amakuki y\'ingirakamaro gusa yemewe. Urubuga ruzakora ariko ntirukore neza.'
        : 'Only essential cookies accepted. Website will work but may not be optimal.'
    );
  };

  const customizeCookies = () => {
    setShowCustomizeModal(true);
  };

  const saveCustomPreferences = () => {
    localStorage.setItem('diglearners-cookies-accepted', 'custom');
    localStorage.setItem('diglearners-cookie-preferences', JSON.stringify(cookiePreferences));
    setCookiesAccepted(true);
    setShowBanner(false);
    setShowCustomizeModal(false);
    
    showCookieMessage(
      currentLanguage === 'rw'
        ? 'Amakuki yahitamo yabitswe!'
        : 'Cookie preferences saved!'
    );
  };

  const showCookieMessage = (message) => {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #0ea5a4;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-size: 0.9rem;
      max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 4000);
  };

  if (!showBanner && !showCustomizeModal) {
    return null;
  }

  return (
    <>
      {showBanner && (
        <div className="cookies-banner">
          <div className="cookies-banner-content">
            <div className="cookies-banner-text">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Amakuki' 
                  : 'Cookies'
                }
              </h3>
              <p>
                {currentLanguage === 'rw'
                  ? 'Tukoresha amakuki kugira ngo dukore neza DigLearners. Turakoresha amakuki gusa kugira ngo dukore neza kandi tukamenye ibyo ukunda.'
                  : 'We use cookies to make DigLearners work better. We only use cookies to improve functionality and remember your preferences.'
                }
              </p>
            </div>
            
            <div className="cookies-banner-actions">
              <button 
                className="cookies-btn cookies-btn-customize"
                onClick={customizeCookies}
              >
                {currentLanguage === 'rw' ? 'Hitamo' : 'Customize'}
              </button>
              
              <button 
                className="cookies-btn cookies-btn-reject"
                onClick={rejectCookies}
              >
                {currentLanguage === 'rw' ? 'Wanga' : 'Reject'}
              </button>
              
              <button 
                className="cookies-btn cookies-btn-accept"
                onClick={acceptCookies}
              >
                {currentLanguage === 'rw' ? 'Emera' : 'Accept All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCustomizeModal && (
        <div className="cookies-modal-overlay">
          <div className="cookies-modal">
            <div className="cookies-modal-header">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Hitamo Amakuki' 
                  : 'Cookie Preferences'
                }
              </h3>
              <button 
                className="cookies-modal-close"
                onClick={() => setShowCustomizeModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="cookies-modal-content">
              <div className="cookie-category">
                <div className="cookie-category-header">
                  <h4>
                    {currentLanguage === 'rw' 
                      ? 'Amakuki y\'ingirakamaro' 
                      : 'Essential Cookies'
                    }
                  </h4>
                  <span className="cookie-required">
                    {currentLanguage === 'rw' ? 'Akeneye' : 'Required'}
                  </span>
                </div>
                <p>
                  {currentLanguage === 'rw'
                    ? 'Aya makuki akeneye kugira ngo urubuga rukore. Ntibyashoboka kwirinda.'
                    : 'These cookies are necessary for the website to function. Cannot be disabled.'
                  }
                </p>
                <label className="cookie-toggle disabled">
                  <input type="checkbox" checked={true} disabled />
                  <span className="cookie-toggle-slider"></span>
                </label>
              </div>

              <div className="cookie-category">
                <div className="cookie-category-header">
                  <h4>
                    {currentLanguage === 'rw' 
                      ? 'Amakuki y\'ubukoresha' 
                      : 'Functional Cookies'
                    }
                  </h4>
                </div>
                <p>
                  {currentLanguage === 'rw'
                    ? 'Aya makuki atuma urubuga rukora neza kandi rukamenye ibyo ukunda.'
                    : 'These cookies help the website work better and remember your preferences.'
                  }
                </p>
                <label className="cookie-toggle">
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.functional}
                    onChange={(e) => setCookiePreferences({
                      ...cookiePreferences,
                      functional: e.target.checked
                    })}
                  />
                  <span className="cookie-toggle-slider"></span>
                </label>
              </div>

              <div className="cookie-category">
                <div className="cookie-category-header">
                  <h4>
                    {currentLanguage === 'rw' 
                      ? 'Amakuki y\'ubukoresha' 
                      : 'Analytics Cookies'
                    }
                  </h4>
                </div>
                <p>
                  {currentLanguage === 'rw'
                    ? 'Aya makuki atuma dumenya uko ukoresha urubuga kugira ngo dukore neza.'
                    : 'These cookies help us understand how you use the website to improve it.'
                  }
                </p>
                <label className="cookie-toggle">
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.analytics}
                    onChange={(e) => setCookiePreferences({
                      ...cookiePreferences,
                      analytics: e.target.checked
                    })}
                  />
                  <span className="cookie-toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div className="cookies-modal-actions">
              <button 
                className="cookies-btn cookies-btn-cancel"
                onClick={() => setShowCustomizeModal(false)}
              >
                {currentLanguage === 'rw' ? 'Guhagarika' : 'Cancel'}
              </button>
              <button 
                className="cookies-btn cookies-btn-save"
                onClick={saveCustomPreferences}
              >
                {currentLanguage === 'rw' ? 'Bika' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookiesBanner;
