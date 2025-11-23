import React from 'react';
import { useTranslation } from '../../lib/language';
import PublicFooter from '../../components/layout/PublicFooter';
import './LegalPages.css';

const TermsAndConditions = () => {
  const { t, currentLanguage } = useTranslation();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1>
            {currentLanguage === 'rw' 
              ? 'Amabwiriza n\'Amabwiriza' 
              : 'Terms and Conditions'
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
                ? 'DigLearners ni ikigo cy\'uburezi bwo mu ikoranabuhanga cyashyizweho mu Rwanda. Tugamije gufasha abanyeshuri kwiga ubwoba bwo mu ikoranabuhanga mu nzira y\'umwuga n\'y\'ubwoba.' 
                : 'DigLearners is an educational technology platform based in Rwanda. We are committed to helping students learn digital literacy skills in a safe and professional manner.'
              }
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '2. Kwemera Amabwiriza' 
                : '2. Acceptance of Terms'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Mukoresha DigLearners, mwemera ko mwiyandikishije kandi mukemera amabwiriza yose yanditse aha. Niba mutemera amabwiriza, ntimukoreshe serivisi zacu.' 
                : 'By using DigLearners, you acknowledge that you have read and agree to all terms outlined here. If you do not agree to these terms, please do not use our services.'
              }
            </p>
          </section>

          {/* User Responsibilities */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '3. Ibikurikizwa n\'Abakoresha' 
                : '3. User Responsibilities'
              }
            </h2>
            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Abakoresha bose:' 
                  : 'All Users:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Kugira ubwoba n\'ubwoba mu koresha serivisi zacu' 
                    : 'To use our services responsibly and ethically'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Kutagira ibitekerezo by\'ubwoba cyangwa ibitekerezo by\'ubwoba' 
                    : 'Not to share inappropriate or harmful content'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Kugira ubwoba n\'ubwoba mu koresha serivisi zacu' 
                    : 'To respect other users and maintain a positive learning environment'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Kugira ubwoba n\'ubwoba mu koresha serivisi zacu' 
                    : 'To provide accurate information when registering'
                  }
                </li>
              </ul>
            </div>

            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Abanyeshuri (Abanyeshuri):' 
                  : 'Students:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Kugira ubwoba n\'ubwoba mu koresha serivisi zacu' 
                    : 'To complete assignments honestly and independently'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Kugira ubwoba n\'ubwoba mu koresha serivisi zacu' 
                    : 'To seek help when needed and participate actively in learning'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Kugira ubwoba n\'ubwoba mu koresha serivisi zacu' 
                    : 'To respect teachers and fellow students'
                  }
                </li>
              </ul>
            </div>

            <div className="legal-list">
              <h3>
                {currentLanguage === 'rw' 
                  ? 'Abarezi:' 
                  : 'Teachers:'
                }
              </h3>
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Kugira ubwoba n\'ubwoba mu koresha serivisi zacu' 
                    : 'To provide quality education and support to students'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Kugira ubwoba n\'ubwoba mu koresha serivisi zacu' 
                    : 'To maintain professional standards and ethical conduct'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Kugira ubwoba n\'ubwoba mu koresha serivisi zacu' 
                    : 'To protect student privacy and maintain confidentiality'
                  }
                </li>
              </ul>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '4. Ubwigenge n\'Ukuvugurura Amakuru' 
                : '4. Privacy and Data Protection'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Tugamije kurengera ubwigenge bw\'abanyeshuri bacu. Amakuru yose yacu yandikishijwe mu nzira y\'ubwoba n\'y\'ubwoba. Reba Politiki y\'Ubwigenge yacu kugira ngo ubashe ubwoba bwose.' 
                : 'We are committed to protecting the privacy of our students. All data is handled securely and ethically. Please see our Privacy Policy for complete details.'
              }
            </p>
            <div className="legal-highlight">
              <h4>
                {currentLanguage === 'rw' 
                  ? 'Ubwoba bw\'Abana:' 
                  : 'Child Safety:'
                }
              </h4>
              <p>
                {currentLanguage === 'rw' 
                  ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                  : 'We prioritize the safety and well-being of children using our platform. All content is age-appropriate and educational. We have strict measures in place to protect minors.'
                }
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '5. Uburenganzira bw\'Ubwoba' 
                : '5. Intellectual Property'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Amasomo yose, amashusho, n\'ibindi bikoresho byacu ni uburenganzira bwa DigLearners. Abakoresha bacu bafite uburenganzira bwo gukoresha serivisi zacu mu nzira y\'ubwoba n\'y\'ubwoba.' 
                : 'All lessons, images, and educational materials are the property of DigLearners. Users have the right to use our services for educational purposes only.'
              }
            </p>
          </section>

          {/* Prohibited Activities */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '6. Ibikurikizwa n\'Abakoresha' 
                : '6. Prohibited Activities'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Ibikurikizwa n\'Abakoresha:' 
                : 'The following activities are strictly prohibited:'
              }
            </p>
            <div className="legal-list">
              <ul>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gushyiraho amakuru y\'ubwoba cyangwa y\'ubwoba' 
                    : 'Sharing false or misleading information'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gushyiraho amakuru y\'ubwoba cyangwa y\'ubwoba' 
                    : 'Harassment, bullying, or inappropriate behavior'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gushyiraho amakuru y\'ubwoba cyangwa y\'ubwoba' 
                    : 'Attempting to hack or compromise our systems'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gushyiraho amakuru y\'ubwoba cyangwa y\'ubwoba' 
                    : 'Sharing personal information of other users'
                  }
                </li>
                <li>
                  {currentLanguage === 'rw' 
                    ? 'Gushyiraho amakuru y\'ubwoba cyangwa y\'ubwoba' 
                    : 'Using the platform for commercial purposes without permission'
                  }
                </li>
              </ul>
            </div>
          </section>

          {/* Account Termination */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '7. Gukuraho Konti' 
                : '7. Account Termination'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Dushobora gukuraho konti y\'umukoresha niba atemera amabwiriza yacu cyangwa niba akora ibikurikizwa. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                : 'We reserve the right to terminate accounts that violate our terms or engage in prohibited activities. We will always prioritize the safety and well-being of our users.'
              }
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '8. Gukuraho Uburenganzira' 
                : '8. Limitation of Liability'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'DigLearners ntihagira uburenganzira bwo gukuraho uburenganzira bw\'abakoresha bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                : 'DigLearners is not liable for any damages resulting from the use of our platform. We provide educational services in good faith and expect users to use them responsibly.'
              }
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '9. Guhindura Amabwiriza' 
                : '9. Changes to Terms'
              }
            </h2>
            <p>
              {currentLanguage === 'rw' 
                ? 'Dushobora guhindura amabwiriza yacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                : 'We may update these terms from time to time. Users will be notified of significant changes. Continued use of our services constitutes acceptance of updated terms.'
              }
            </p>
          </section>

          {/* Contact Information */}
          <section className="legal-section">
            <h2>
              {currentLanguage === 'rw' 
                ? '10. Amakuru y\'Ubufasha' 
                : '10. Contact Information'
              }
            </h2>
            <div className="contact-info">
              <p>
                <strong>
                  {currentLanguage === 'rw' 
                    ? 'DigLearners' 
                    : 'DigLearners'
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
                  ? 'Email: legal@diglearners.rw' 
                  : 'Email: legal@diglearners.rw'
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
                ? '11. Icyemezo cy\'Ubwoba' 
                : '11. Ethical Commitment'
              }
            </h2>
            <div className="ethical-principles">
              <div className="ethical-principle">
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Ubwoba bw\'Abana' 
                    : 'Child Safety'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                    : 'We prioritize the safety and well-being of children above all else. All content is age-appropriate and educational.'
                  }
                </p>
              </div>
              <div className="ethical-principle">
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Ubwoba bw\'Abana' 
                    : 'Educational Integrity'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                    : 'We maintain the highest standards of educational integrity and academic honesty.'
                  }
                </p>
              </div>
              <div className="ethical-principle">
                <h3>
                  {currentLanguage === 'rw' 
                    ? 'Ubwoba bw\'Abana' 
                    : 'Digital Inclusion'
                  }
                </h3>
                <p>
                  {currentLanguage === 'rw' 
                    ? 'Tugamije kurengera abana bacu. Tugamije kurengera abana bacu. Tugamije kurengera abana bacu.' 
                    : 'We are committed to making digital education accessible to all students, regardless of background or ability.'
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

export default TermsAndConditions;
