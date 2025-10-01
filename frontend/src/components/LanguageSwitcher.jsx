import React from 'react'
import { languageManager, LANGUAGES } from '../lib/language'

export default function LanguageSwitcher({ className = '' }) {
  const [currentLanguage, setCurrentLanguage] = React.useState(languageManager.getCurrentLanguage())
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const unsubscribe = languageManager.subscribe(setCurrentLanguage)
    return unsubscribe
  }, [])

  const handleLanguageChange = (language) => {
    languageManager.setLanguage(language)
    setIsOpen(false)
  }

  const availableLanguages = languageManager.getAvailableLanguages()

  return (
    <div className={`language-switcher ${className}`}>
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
      >
        <span className="language-flag">
          {currentLanguage === LANGUAGES.EN ? '🇬🇧' : '🇷🇼'}
        </span>
        <span className="language-name">
          {languageManager.getLanguageName(currentLanguage)}
        </span>
        <span className="dropdown-arrow">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {availableLanguages.map(({ key, value, name }) => (
            <button
              key={value}
              className={`language-option ${currentLanguage === value ? 'active' : ''}`}
              onClick={() => handleLanguageChange(value)}
            >
              <span className="language-flag">
                {value === LANGUAGES.EN ? '🇬🇧' : '🇷🇼'}
              </span>
              <span className="language-name">{name}</span>
              {currentLanguage === value && (
                <span className="checkmark">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
