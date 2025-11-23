import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import PublicFooter from '../../components/layout/PublicFooter';
import Icon from '../../components/icons/Icon';
import './SupportPages.css';

const FAQ = () => {
  const { t, currentLanguage } = useTranslation();
  const [openItem, setOpenItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    {
      question: currentLanguage === 'rw' ? 'Ningera nkoresha DigLearners?' : 'How do I use DigLearners?',
      answer: currentLanguage === 'rw' 
        ? 'DigLearners ni ikigo cy\'amahugurwa y\'ubwoba. Tangira ukora konti, uhitamo ubwoko bwawe, hanyuma utangire amahugurwa.'
        : 'DigLearners is a digital literacy platform. Start by creating an account, choose your role, then begin your lessons.',
      category: 'general'
    },
    {
      question: currentLanguage === 'rw' ? 'Ningera nkora konti?' : 'How do I create an account?',
      answer: currentLanguage === 'rw' 
        ? 'Kanda ku "Register" hejuru, ujuzemo amakuru yawe, hanyuma ukore konti yawe.'
        : 'Click "Register" at the top, fill in your information, then create your account.',
      category: 'account'
    },
    {
      question: currentLanguage === 'rw' ? 'Ningera nkora amahugurwa?' : 'How do I complete lessons?',
      answer: currentLanguage === 'rw' 
        ? 'Gira amahugurwa yawe, ukore ibyo byasabwa, hanyuma ukore "Complete" kugira ngo urakure ibyuzuzo.'
        : 'Access your lessons, complete the required tasks, then click "Complete" to earn points.',
      category: 'lessons'
    },
    {
      question: currentLanguage === 'rw' ? 'Ningera nkuraho ibyuzuzo?' : 'How do I earn points?',
      answer: currentLanguage === 'rw' 
        ? 'Urakuraho ibyuzuzo ukora amahugurwa, ukora neza, kandi ukora ibikorwa by\'ukuri.'
        : 'Earn points by completing lessons, getting good scores, and participating in activities.',
      category: 'points'
    },
    {
      question: currentLanguage === 'rw' ? 'Ningera nkoresha ibyuzuzo?' : 'How do I use points?',
      answer: currentLanguage === 'rw' 
        ? 'Ibyuzuzo byawe biragaragara mu dashboard yawe. Bikoreshwa kugira ngo urakure ibyuzuzo n\'ibyuzuzo.'
        : 'Your points are displayed in your dashboard. They are used to track progress and earn achievements.',
      category: 'points'
    },
    {
      question: currentLanguage === 'rw' ? 'Ningera nkoresha ibyuzuzo?' : 'What if I forget my password?',
      answer: currentLanguage === 'rw' 
        ? 'Kanda ku "Forgot Password" mu page y\'inyandiko, ujuzemo imeli yawe, hanyuma ukurikire amabwiriza.'
        : 'Click "Forgot Password" on the login page, enter your email, then follow the instructions.',
      category: 'account'
    },
    {
      question: currentLanguage === 'rw' ? 'Ningera nkuraho ibyuzuzo?' : 'How do I track my progress?',
      answer: currentLanguage === 'rw' 
        ? 'Gira mu dashboard yawe, urakuraho amashakiro y\'intambwe yawe, ibyuzuzo, n\'ibyuzuzo.'
        : 'Go to your dashboard to see your progress, points, and achievements.',
      category: 'progress'
    },
    {
      question: currentLanguage === 'rw' ? 'Ningera nkuraho ibyuzuzo?' : 'How do I get help?',
      answer: currentLanguage === 'rw' 
        ? 'Twandikire kuri support@diglearners.rw cyangwa hamagara +250 788 123 456.'
        : 'Email us at support@diglearners.rw or call +250 788 123 456.',
      category: 'support'
    }
  ];

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  const filteredFAQs = faqData.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    { key: 'all', label: currentLanguage === 'rw' ? 'Byose' : 'All' },
    { key: 'general', label: currentLanguage === 'rw' ? 'Byose' : 'General' },
    { key: 'account', label: currentLanguage === 'rw' ? 'Konti' : 'Account' },
    { key: 'lessons', label: currentLanguage === 'rw' ? 'Amahugurwa' : 'Lessons' },
    { key: 'points', label: currentLanguage === 'rw' ? 'Ibyuzuzo' : 'Points' },
    { key: 'progress', label: currentLanguage === 'rw' ? 'Intambwe' : 'Progress' },
    { key: 'support', label: currentLanguage === 'rw' ? 'Ubufasha' : 'Support' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categoryFilteredFAQs = selectedCategory === 'all' 
    ? filteredFAQs 
    : filteredFAQs.filter(item => item.category === selectedCategory);

  return (
    <div className="support-page">
      <div className="support-container">
        <header className="support-header">
          <h1>
            {currentLanguage === 'rw' 
              ? 'Ibibazo Byibuze' 
              : 'Frequently Asked Questions'
            }
          </h1>
          <p className="support-subtitle">
            {currentLanguage === 'rw' 
              ? 'Gusubiza ibibazo byose' 
              : 'Find answers to common questions'
            }
          </p>
        </header>

        <div className="support-content">
          {/* Search and Filter Section */}
          <section className="faq-search-section">
            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder={currentLanguage === 'rw' ? 'Shakisha ibibazo...' : 'Search questions...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">
                  <Icon name="search" size={20} />
                </span>
              </div>
            </div>
            
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.key}
                  className={`category-btn ${selectedCategory === category.key ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </section>

          <section className="faq-section">
            <div className="faq-list">
              {categoryFilteredFAQs.map((item, index) => (
                <div key={index} className="faq-item">
                  <button 
                    className="faq-question"
                    onClick={() => toggleItem(index)}
                  >
                    <span>{item.question}</span>
                    <span className="faq-icon">
                      {openItem === index ? '−' : '+'}
                    </span>
                  </button>
                  {openItem === index && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="support-section">
            <h2>
              {currentLanguage === 'rw' 
                ? 'Ntibyuzuzo?' 
                : 'Still Need Help?'
              }
            </h2>
            <div className="contact-info">
              <p>
                {currentLanguage === 'rw' 
                  ? 'Ntibyuzuzo? Twandikire kuri support@diglearners.rw cyangwa hamagara +250 788 123 456'
                  : 'Still need help? Email us at support@diglearners.rw or call +250 788 123 456'
                }
              </p>
              <div className="contact-buttons">
                <a href="mailto:support@diglearners.rw" className="contact-btn">
                  <Icon name="email" size={16} style={{ marginRight: '8px' }} />
                  {currentLanguage === 'rw' ? 'Twandikire' : 'Email Us'}
                </a>
                <a href="tel:+250788123456" className="contact-btn">
                  <Icon name="phone" size={16} style={{ marginRight: '8px' }} />
                  {currentLanguage === 'rw' ? 'Hamagara' : 'Call Us'}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
};

export default FAQ;
