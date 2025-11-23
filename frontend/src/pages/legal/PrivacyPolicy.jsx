import React from 'react';
import { useTranslation } from '../../lib/language';
import PublicFooter from '../../components/layout/PublicFooter';
import './LegalPages.css';

const PrivacyPolicy = () => {
  const { t, currentLanguage } = useTranslation();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1>
            {currentLanguage === 'rw' 
              ? 'Politiki y\'Ubwigenge' 
              : 'Privacy Policy'
            }
          </h1>
          <p className="legal-subtitle">
            {currentLanguage === 'rw' 
              ? 'Kuva ku wa 1 Mutarama 2024' 
              : 'Effective as of January 1, 2024'
            }
          </p>
        </header>

        <div className="legal-content">
          {/* Introduction */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '1. Intangiriro' 
                : '1. Introduction'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'DigLearners ni ikigo cy\'uburezi bwo mu ikoranabuhanga cyashyizweho mu Rwanda. Tugamije kurengera ubwigenge bw\'abanyeshuri bacu n\'ababyeyi babo. Tugamije kurengera abana bacu.' 
                : 'DigLearners is committed to protecting the privacy and safety of our students and their families. This policy outlines how we collect, use, and protect personal information.'
              }
            </p>
          </section>

          {/* Information We Collect */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '2. Amakuru Dukusanya' 
                : '2. Information We Collect'
              }
            </h2>
            
            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Amakuru y\'Ubwoba:' 
                  : 'Personal Information:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Amazina y\'abanyeshuri n\'ababyeyi babo' 
                    : 'Student and parent/guardian names'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Imeli n\'imeli y\'ababyeyi' 
                    : 'Email addresses for communication'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Amashuri y\'abanyeshuri' 
                    : 'School information for educational purposes'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Amakuru y\'ubwoba bw\'abanyeshuri' 
                    : 'Age-appropriate learning preferences'
                  }
                </li>
              </ul>
            </div>

            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Amakuru y\'Ubwoba:' 
                  : 'Learning Data:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Intambwe y\'ubwoba bw\'abanyeshuri' 
                    : 'Student progress and achievements'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Amasomo yarangiye n\'amakuru y\'ubwoba' 
                    : 'Completed lessons and scores'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Amakuru y\'ubwoba bw\'abanyeshuri' 
                    : 'Learning preferences and difficulties'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Amakuru y\'ubwoba bw\'abanyeshuri' 
                    : 'Time spent on educational activities'
                  }
                </li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '3. Uko Dukoresha Amakuru' 
                : '3. How We Use Information'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                : 'We use collected information solely for educational purposes and to improve our services.'
              }
            </p>
            
            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Ubwoba bw\'Abana:' 
                  : 'Educational Purposes:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'To provide personalized learning experiences'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'To track progress and provide feedback'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'To communicate with parents and teachers'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'To ensure child safety and appropriate content'
                  }
                </li>
              </ul>
            </div>
          </section>

          {/* Child Safety and Protection */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '4. Ubwoba bw\'Abana n\'Ukuvugurura' 
                : '4. Child Safety and Protection'
              }
            </h2>
            <div className="legal-highlight">
              <h4>
                {currentLanguage === 'rw' 
                  ? 'Ubwoba bw\'Abana:' 
                  : 'Child Safety Priority:'
                }
              </h4>
              <p>
                {currentLanguage === 'rw' 
                  ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                  : 'The safety and well-being of children is our highest priority. We have implemented comprehensive safety measures.'
                }
              </p>
            </div>

            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Ubwoba bw\'Abana:' 
                  : 'Safety Measures:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'All content is age-appropriate and educational'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Strict monitoring of user interactions'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Parental controls and oversight features'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Regular safety audits and content reviews'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Immediate reporting system for safety concerns'
                  }
                </li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '5. Ukuvugurura Amakuru' 
                : '5. Data Security'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                : 'We implement industry-standard security measures to protect all user data.'
              }
            </p>
            
            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Ubwoba bw\'Abana:' 
                  : 'Security Measures:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Encrypted data transmission and storage'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Regular security updates and monitoring'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Limited access to personal information'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Secure authentication and authorization'
                  }
                </li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '6. Gushyiraho Amakuru' 
                : '6. Information Sharing'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                : 'We do not sell, trade, or share personal information with third parties except in specific circumstances.'
              }
            </p>
            
            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Ubwoba bw\'Abana:' 
                  : 'Limited Sharing:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'With parents/guardians for educational progress'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'With teachers for educational support'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'With authorities if required by law'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Never with commercial third parties'
                  }
                </li>
              </ul>
            </div>
          </section>

          {/* Parental Rights */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '7. Uburenganzira bw\'Ababyeyi' 
                : '7. Parental Rights'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                : 'Parents and guardians have specific rights regarding their children\'s information.'
              }
            </p>
            
            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Ubwoba bw\'Abana:' 
                  : 'Parental Rights:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Access to their child\'s learning progress'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Control over information sharing'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Request for data deletion'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Notification of any data breaches'
                  }
                </li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '8. Gukomeza Amakuru' 
                : '8. Data Retention'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                : 'We retain student data only as long as necessary for educational purposes.'
              }
            </p>
            
            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Ubwoba bw\'Abana:' 
                  : 'Retention Periods:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Active student data: Until graduation or withdrawal'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Inactive accounts: 2 years maximum'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Safety records: As required by law'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Anonymous analytics: Indefinitely for research'
                  }
                </li>
              </ul>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '9. Cookies n\'Ubwoba' 
                : '9. Cookies and Tracking'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                : 'We use minimal cookies and tracking for educational purposes only.'
              }
            </p>
            
            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Ubwoba bw\'Abana:' 
                  : 'Cookie Usage:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Essential cookies for platform functionality'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Learning progress tracking'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'No advertising or commercial tracking'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga' 
                    : 'Parental consent for all tracking'
                  }
                </li>
              </ul>
            </div>
          </section>

          {/* International Transfers */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '10. Gushyiraho Amakuru mu Bindi Bihugu' 
                : '10. International Data Transfers'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                : 'We prioritize keeping student data within Rwanda and only transfer data when absolutely necessary for educational services.'
              }
            </p>
          </section>

          {/* Contact Information */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '11. Amakuru y\'Ubufasha' 
                : '11. Contact Information'
              }
            </h2>
            <div className="contact-info">
              <p>
                <strong>
                  {currentLanguage === 'rw' 
                    ? 'DigLearners - Ubwoba bw\'Abana' 
                    : 'DigLearners - Privacy Team'
                  }
                </strong>
              </p>
              <p>
                {currentLanguage === 'rw' 
                  ? 'Kigali, Rwanda' 
                  : 'Kigali, Rwanda'
                }
              </p>
              <p>
                {currentLanguage === 'rw' 
                  ? 'Email: privacy@diglearners.rw' 
                  : 'Email: privacy@diglearners.rw'
                }
              </p>
              <p>
                {currentLanguage === 'rw' 
                  ? 'Telefone: +250 788 123 456' 
                  : 'Phone: +250 788 123 456'
                }
              </p>
            </div>
          </section>

          {/* Ethical Commitment */}
          <section className="legal-section ethical-commitment">
            <h2>
              {currentLanguage === 'rw' 
                ? '12. Icyemezo cy\'Ubwoba' 
                : '12. Ethical Commitment'
              }
            </h2>
            <div className="ethical-principles">
              <div className="ethical-principle">
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Ubwoba bw\'Abana' 
                    : 'Child-Centric Design'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                    : 'Every decision we make prioritizes the safety, privacy, and well-being of children.'
                  }
                </p>
              </div>
              <div className="ethical-principle">
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Ubwoba bw\'Abana' 
                    : 'Transparency'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                    : 'We are transparent about our data practices and provide clear information to parents and students.'
                  }
                </p>
              </div>
              <div className="ethical-principle">
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Ubwoba bw\'Abana' 
                    : 'Minimal Data Collection'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                    : 'We collect only the minimum data necessary for educational purposes and child safety.'
                  }
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
};

export default PrivacyPolicy;
