import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import PublicFooter from '../../components/layout/PublicFooter';
import Icon from '../../components/icons/Icon';
import './SupportPages.css';

const HelpCenter = () => {
  const { t, currentLanguage } = useTranslation();
  const [activeSection, setActiveSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="support-page">
      <div className="support-container">
        <header className="support-header">
          <h1>
            {currentLanguage === 'rw' 
              ? 'Ubufasha' 
              : 'Help Center'
            }
          </h1>
          <p className="support-subtitle">
            {currentLanguage === 'rw' 
              ? 'Tubafasha gufata amahugurwa yacu' 
              : 'Get the support you need to succeed'
            }
          </p>
        </header>

        <div className="support-content">
          {/* Search Section */}
          <section className="help-search-section">
            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder={currentLanguage === 'rw' ? 'Shakisha ubufasha...' : 'Search for help...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">
                  <Icon name="search" size={20} />
                </span>
              </div>
              <p className="search-hint">
                {currentLanguage === 'rw' 
                  ? 'Shakisha ibibazo, amahugurwa, cyangwa ubufasha' 
                  : 'Search for questions, lessons, or support topics'
                }
              </p>
            </div>
          </section>

          {/* Quick Help Section */}
          <section className="support-section">
            <h2>
              {currentLanguage === 'rw' 
                ? 'Ubufasha Bwihuse' 
                : 'Quick Help'
              }
            </h2>
            <div className="help-grid">
              <div className="help-card">
                <div className="help-icon">
                  <Icon name="play" size={32} />
                </div>
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Gutangira' 
                    : 'Getting Started'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Menya uburyo bwo gukoresha DigLearners' 
                    : 'Learn how to use DigLearners effectively'
                  }
                </p>
                <a href="#getting-started" className="help-link">
                  {currentLanguage === 'rw' ? 'Menya byinshi' : 'Learn More'}
                </a>
              </div>

              <div className="help-card">
                <div className="help-icon">
                  <Icon name="book" size={24} />
                </div>
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Amahugurwa' 
                    : 'Lessons'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Menya uburyo bwo gukora amahugurwa' 
                    : 'How to complete lessons and track progress'
                  }
                </p>
                <a href="#lessons" className="help-link">
                  {currentLanguage === 'rw' ? 'Menya byinshi' : 'Learn More'}
                </a>
              </div>

              <div className="help-card">
                <div className="help-icon">
                  <Icon name="achievement" size={24} />
                </div>
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Intsinzi' 
                    : 'Achievements'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Menya uburyo bwo gukuraho ibyuzuzo' 
                    : 'How to earn badges and points'
                  }
                </p>
                <a href="#achievements" className="help-link">
                  {currentLanguage === 'rw' ? 'Menya byinshi' : 'Learn More'}
                </a>
              </div>

              <div className="help-card">
                <div className="help-icon">🔧</div>
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Guhindura' 
                    : 'Troubleshooting'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Gusubiza ibibazo byose' 
                    : 'Fix common issues and problems'
                  }
                </p>
                <a href="#troubleshooting" className="help-link">
                  {currentLanguage === 'rw' ? 'Menya byinshi' : 'Learn More'}
                </a>
              </div>
            </div>
          </section>

          {/* Getting Started Guide */}
          <section className="support-section" id="getting-started">
            <h2>
              {currentLanguage === 'rw' 
                ? 'Uburyo bwo Gutangira' 
                : 'Getting Started Guide'
              }
            </h2>
            <div className="guide-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>
                    {currentLanguage === 'rw' 
                      ? 'Kwiyandikisha' 
                      : 'Create Your Account'
                    }
                  </h3>
                  <p>
                    {currentLanguage === 'rw' 
                      ? 'Kora konti yawe kugira ngo utangire amahugurwa' 
                      : 'Sign up for a free account to start learning'
                    }
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>
                    {currentLanguage === 'rw' 
                      ? 'Guhitamo Ubwoko' 
                      : 'Choose Your Role'
                    }
                  </h3>
                  <p>
                    {currentLanguage === 'rw' 
                      ? 'Hitamo ubwoko bwawe: Umwana, Umwarimu, cyangwa Umubyeyi' 
                      : 'Select your role: Student, Teacher, or Parent'
                    }
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>
                    {currentLanguage === 'rw' 
                      ? 'Gutangira Amahugurwa' 
                      : 'Start Learning'
                    }
                  </h3>
                  <p>
                    {currentLanguage === 'rw' 
                      ? 'Tangira amahugurwa yawe kandi urakure ubumenyi' 
                      : 'Begin your lessons and start building skills'
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="support-section">
            <h2>
              {currentLanguage === 'rw' 
                ? 'Twandikire' 
                : 'Contact Support'
              }
            </h2>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">
                  <Icon name="email" size={24} />
                </div>
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Imeli' 
                    : 'Email Support'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Twandikire kuri support@diglearners.rw' 
                    : 'Email us at support@diglearners.rw'
                  }
                </p>
                <a href="mailto:support@diglearners.rw" className="contact-link">
                  {currentLanguage === 'rw' ? 'Twandikire' : 'Send Email'}
                </a>
              </div>

              <div className="contact-method">
                <div className="contact-icon">
                  <Icon name="phone" size={24} />
                </div>
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Telefone' 
                    : 'Phone Support'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Hamagara +250 788 123 456' 
                    : 'Call us at +250 788 123 456'
                  }
                </p>
                <a href="tel:+250788123456" className="contact-link">
                  {currentLanguage === 'rw' ? 'Hamagara' : 'Call Now'}
                </a>
              </div>

              <div className="contact-method">
                <div className="contact-icon">
                  <Icon name="message" size={24} />
                </div>
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Icyerekezo' 
                    : 'Live Chat'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Vugana n\'abantu bacu mu gihe cyose' 
                    : 'Chat with our team anytime'
                  }
                </p>
                <button className="contact-link">
                  {currentLanguage === 'rw' ? 'Tangira Icyerekezo' : 'Start Chat'}
                </button>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="support-section">
            <h2>
              {currentLanguage === 'rw' 
                ? 'Amashakiro' 
                : 'Resources'
              }
            </h2>
            <div className="resources-grid">
              <div className="resource-card">
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Amashakiro y\'Amahugurwa' 
                    : 'Learning Resources'
                  }
                </h3>
                <ul>
                  <li>
                    {currentLanguage === 'rw' 
                      ? 'Uburyo bwo gukoresha DigLearners' 
                      : 'DigLearners User Guide'
                    }
                  </li>
                  <li>
                    {currentLanguage === 'rw' 
                      ? 'Amahugurwa y\'Ubwoba' 
                      : 'Digital Literacy Lessons'
                    }
                  </li>
                  <li>
                    {currentLanguage === 'rw' 
                      ? 'Amahugurwa y\'Ubwoba' 
                      : 'Safe Browsing Tips'
                    }
                  </li>
                </ul>
              </div>

              <div className="resource-card">
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Ubufasha bwa Tekinoloji' 
                    : 'Technical Support'
                  }
                </h3>
                <ul>
                  <li>
                    {currentLanguage === 'rw' 
                      ? 'Gusubiza Ibibazo by\'Ubwoba' 
                      : 'Browser Compatibility'
                    }
                  </li>
                  <li>
                    {currentLanguage === 'rw' 
                      ? 'Gusubiza Ibibazo by\'Ubwoba' 
                      : 'Internet Connection Issues'
                    }
                  </li>
                  <li>
                    {currentLanguage === 'rw' 
                      ? 'Gusubiza Ibibazo by\'Ubwoba' 
                      : 'Account Recovery'
                    }
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
};

export default HelpCenter;
