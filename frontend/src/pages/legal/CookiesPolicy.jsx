import React from 'react';
import { useTranslation } from '../../lib/language';
import PublicFooter from '../../components/layout/PublicFooter';
import '../../components/layout/AppLayout.css';
import './LegalPages.css';

const CookiesPolicy = () => {
  const { t, currentLanguage } = useTranslation();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>
          {currentLanguage === 'rw' 
            ? 'Politiki y\'Amakuki' 
            : 'Cookies Policy'
          }
        </h1>
        <p className="legal-intro">
          {currentLanguage === 'rw'
            ? 'Iki cyandikishijwe kirakoreshwa kugira ngo dukore neza DigLearners kandi tukamenye uko dukoresha amakuki.'
            : 'This document explains how DigLearners uses cookies and similar technologies to enhance your learning experience.'
          }
        </p>

        <section className="legal-section">
          <h2>
            {currentLanguage === 'rw'
              ? '1. Amakuki ni iki?'
              : '1. What are Cookies?'
            }
          </h2>
          <p>
            {currentLanguage === 'rw'
              ? 'Amakuki ni dosiye dukomeye dutanga ku mudasobwa wawe mugihe ukoresha urubuga. Amakuki atuma urubuga rukora neza kandi rukamenye ibyo ukunda.'
              : 'Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience and remember your preferences.'
            }
          </p>
        </section>

        <section className="legal-section">
          <h2>
            {currentLanguage === 'rw'
              ? '2. Ni iki dukoresha amakuki?'
              : '2. How We Use Cookies'
            }
          </h2>
          <p>
            {currentLanguage === 'rw'
              ? 'Tukoresha amakuki kugira ngo:'
              : 'We use cookies to:'
            }
          </p>
          <div className="legal-list">
            <ul>
              <li>
                {currentLanguage === 'rw'
                  ? 'Kumenya uko ukoresha urubuga rwacu (analytics)'
                  : 'Understand how you use our website (analytics)'
                }
              </li>
              <li>
                {currentLanguage === 'rw'
                  ? 'Kumenya ibyo ukunda kugira ngo dukore neza'
                  : 'Remember your preferences to improve your experience'
                }
              </li>
              <li>
                {currentLanguage === 'rw'
                  ? 'Gukomeza kumenya wowe mugihe ugaruka'
                  : 'Keep you logged in when you return'
                }
              </li>
              <li>
                {currentLanguage === 'rw'
                  ? 'Gukurikirana imikurire y\'umwana wanyu'
                  : 'Track your child\'s learning progress'
                }
              </li>
              <li>
                {currentLanguage === 'rw'
                  ? 'Gukora neza urubuga rwacu'
                  : 'Make our website work properly'
                }
              </li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>
            {currentLanguage === 'rw'
              ? '3. Ubwoko bw\'amakuki dukoresha'
              : '3. Types of Cookies We Use'
            }
          </h2>
          
          <h3>
            {currentLanguage === 'rw'
              ? 'Amakuki y\'ingirakamaro (Essential Cookies)'
              : 'Essential Cookies'
            }
          </h3>
          <p>
            {currentLanguage === 'rw'
              ? 'Aya makuki akeneye kugira ngo urubuga rukore. Ntibyashoboka kwirinda aya makuki.'
              : 'These cookies are necessary for the website to function. You cannot disable these cookies.'
            }
          </p>

          <h3>
            {currentLanguage === 'rw'
              ? 'Amakuki y\'ubukoresha (Functional Cookies)'
              : 'Functional Cookies'
            }
          </h3>
          <p>
            {currentLanguage === 'rw'
              ? 'Aya makuki atuma urubuga rukora neza kandi rukamenye ibyo ukunda.'
              : 'These cookies help the website work better and remember your preferences.'
            }
          </p>

          <h3>
            {currentLanguage === 'rw'
              ? 'Amakuki y\'ubukoresha (Analytics Cookies)'
              : 'Analytics Cookies'
            }
          </h3>
          <p>
            {currentLanguage === 'rw'
              ? 'Aya makuki atuma dumenya uko ukoresha urubuga kugira ngo dukore neza.'
              : 'These cookies help us understand how you use the website so we can improve it.'
            }
          </p>
        </section>

        <section className="legal-section">
          <h2>
            {currentLanguage === 'rw'
              ? '4. Uko wakoresha amakuki'
              : '4. Managing Cookies'
            }
          </h2>
          <p>
            {currentLanguage === 'rw'
              ? 'Urashobora guhitamo amakuki ukeneye. Mugabo, niba ujya ukirinda amakuki menshi, urubuga rwacu rwose rutakora neza.'
              : 'You can choose which cookies to accept. However, if you disable too many cookies, our website may not work properly.'
            }
          </p>
          <p>
            {currentLanguage === 'rw'
              ? 'Urashobora guhindura amakuki mu mudasobwa wawe wose.'
              : 'You can change your cookie settings in your browser at any time.'
            }
          </p>
        </section>

        <section className="legal-section">
          <h2>
            {currentLanguage === 'rw'
              ? '5. Amakuki y\'abana'
              : '5. Children\'s Cookies'
            }
          </h2>
          <p>
            {currentLanguage === 'rw'
              ? 'Tukoresha amakuki make gusa kugira ngo dukurikirane imikurire y\'abana. Ntitukoresha amakuki y\'ubucuruzi ku bana.'
              : 'We only use minimal cookies to track children\'s learning progress. We do not use advertising cookies for children.'
            }
          </p>
        </section>

        <section className="legal-section">
          <h2>
            {currentLanguage === 'rw'
              ? '6. Ubutabera bw\'amakuki'
              : '6. Cookie Security'
            }
          </h2>
          <p>
            {currentLanguage === 'rw'
              ? 'Amakuki yacu ni meza kandi ntibyashoboka kwandikisha amakuru y\'abantu. Turakoresha amakuki gusa kugira ngo dukore neza.'
              : 'Our cookies are safe and cannot access personal information. We only use cookies to improve functionality.'
            }
          </p>
        </section>

        <section className="legal-section">
          <h2>
            {currentLanguage === 'rw'
              ? '7. Twandikire'
              : '7. Contact Us'
            }
          </h2>
          <p>
            {currentLanguage === 'rw'
              ? 'Niba ufite ibibazo ku makuki, twandikire:'
              : 'If you have questions about cookies, contact us:'
            }
          </p>
          <div className="legal-list">
            <ul>
              <li>
                {currentLanguage === 'rw'
                  ? 'Imeli: info@diglearners.rw'
                  : 'Email: info@diglearners.rw'
                }
              </li>
              <li>
                {currentLanguage === 'rw'
                  ? 'Telefone: +250 788 123 456'
                  : 'Phone: +250 788 123 456'
                }
              </li>
              <li>
                {currentLanguage === 'rw'
                  ? 'Aho turi: Kigali, Rwanda'
                  : 'Location: Kigali, Rwanda'
                }
              </li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>
            {currentLanguage === 'rw'
              ? '8. Ihinduka ry\'iyi politiki'
              : '8. Changes to This Policy'
            }
          </h2>
          <p>
            {currentLanguage === 'rw'
              ? 'Dushobora guhindura iyi politiki. Niba duhindura, tuzabimenyesha mu rubuga rwacu.'
              : 'We may update this policy. If we make changes, we will notify you on our website.'
            }
          </p>
        </section>

        <div className="legal-footer">
          <p>
            {currentLanguage === 'rw'
              ? 'Iki cyandikishijwe cyasohowe ku {new Date().toLocaleDateString("rw-RW")}'
              : `This document was last updated on ${new Date().toLocaleDateString("en-US")}`
            }
          </p>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
};

export default CookiesPolicy;
