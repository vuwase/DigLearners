// Multilingual support for DigLearners
// Supports Kinyarwanda and English
import React from 'react'

export const LANGUAGES = {
  EN: 'en',
  RW: 'rw'
}

export const TRANSLATIONS = {
  [LANGUAGES.EN]: {
    // Navigation
    'nav.home': 'My Dashboard',
    'nav.lessons': 'My Lessons',
    'nav.student': 'Student',
    'nav.teacher': 'Teacher',
    'nav.parent': 'Parent',
    'nav.leaderboard': 'Leaderboard',
    'nav.research': 'Research',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'student.games': 'Play Games',
    'student.achievements': 'My Achievements',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.finish': 'Finish',
    'common.points': 'Points',
    'common.badges': 'Badges',
    'common.level': 'Level',
    
    // Student Dashboard
    'student.welcome': 'Welcome back',
    'student.progress': 'Your Progress',
    'student.lessons_completed': 'Lessons Completed',
    'student.badges_earned': 'Badges Earned',
    'student.total_points': 'Total Points',
    'student.day_streak': 'Day Streak',
    'student.recent_badges': 'Recent Badges',
    'student.new_badges': 'New Badges Earned!',
    'student.level_progress': 'Level Progress',
    'student.to_next_level': 'to next level',
    
    // Levels
    'level.digital_explorer': 'Digital Explorer',
    'level.tech_adventurer': 'Tech Adventurer',
    'level.code_navigator': 'Code Navigator',
    'level.digital_guardian': 'Digital Guardian',
    'level.tech_master': 'Tech Master',
    'level.digital_wizard': 'Digital Wizard',
    
    // Badges
    'badge.first_steps': 'First Steps',
    'badge.first_steps_desc': 'Completed your first lesson!',
    'badge.typing_master': 'Typing Master',
    'badge.typing_master_desc': 'Completed 5 typing lessons',
    'badge.safe_surfer': 'Safe Surfer',
    'badge.safe_surfer_desc': 'Learned about internet safety',
    'badge.code_breaker': 'Code Breaker',
    'badge.code_breaker_desc': 'Solved 10 coding puzzles',
    'badge.weekly_champion': 'Weekly Champion',
    'badge.weekly_champion_desc': 'Top performer this week',
    'badge.perfect_score': 'Perfect Score',
    'badge.perfect_score_desc': 'Got 100% on a lesson',
    
    // Leaderboard
    'leaderboard.title': 'Leaderboard',
    'leaderboard.subtitle': 'Top performers',
    'leaderboard.all_time': 'All Time',
    'leaderboard.this_week': 'This Week',
    'leaderboard.no_data': 'No data available yet. Complete some lessons to appear on the leaderboard!',
    'leaderboard.keep_learning': 'Keep Learning!',
    'leaderboard.motivation_all': 'Complete more lessons and earn badges to climb the leaderboard!',
    'leaderboard.motivation_weekly': 'Stay active this week to maintain your position on the weekly leaderboard!',
    
    // Lessons
    'lesson.typing_basics': 'Typing Basics',
    'lesson.safe_browsing': 'Safe Browsing',
    'lesson.block_puzzles': 'Block Puzzles',
    'lesson.start_lesson': 'Start Lesson',
    'lesson.continue_lesson': 'Continue Lesson',
    'lesson.lesson_complete': 'Lesson Complete!',
    'lesson.congratulations': 'Congratulations!',
    
    // Demo Actions
    'demo.complete_lesson': 'Complete Lesson',
    'demo.typing_lesson': 'Typing Lesson',
    'demo.coding_puzzle': 'Coding Puzzle',
    'demo.perfect_score': 'Perfect Score',
    
    // Error Messages
    'error.loading_progress': 'Unable to load your progress. Please try again.',
    'error.generic': 'Something went wrong. Please try again.',
    
    // Accessibility
    'accessibility.large_text': 'Large Text',
    'accessibility.high_contrast': 'High Contrast',
    'accessibility.audio_feedback': 'Audio Feedback'
  },
  
  [LANGUAGES.RW]: {
    // Navigation
    'nav.home': 'Akarubaho Kanjye',
    'nav.lessons': 'Amasomo Yanjye',
    'nav.student': 'Umunyeshuri',
    'nav.teacher': 'Umwarimu',
    'nav.parent': 'Umubyeyi',
    'nav.leaderboard': 'Urutonde',
    'nav.research': 'Ubushakashatsi',
    'nav.admin': 'Umuyobozi',
    'nav.login': 'Winjira',
    'nav.register': 'Iyandikishe',
    'nav.logout': 'Sohoka',
    'student.games': 'Kina Imikino',
    'student.achievements': 'Intsinzi Zanjye',
    
    // Common
    'common.loading': 'Birakora...',
    'common.error': 'Ikosa',
    'common.success': 'Byakunze',
    'common.save': 'Bika',
    'common.cancel': 'Hagarika',
    'common.back': 'Subira',
    'common.next': 'Ibikurikira',
    'common.finish': 'Gusohoza',
    'common.points': 'Amapointe',
    'common.badges': 'Ikimenyetso',
    'common.level': 'Urwego',
    
    // Student Dashboard
    'student.welcome': 'Murakaza neza',
    'student.progress': 'Imbere yanyu',
    'student.lessons_completed': 'Amasomo Yarangije',
    'student.badges_earned': 'Ikimenyetso Byabonye',
    'student.total_points': 'Amapointe Yose',
    'student.day_streak': 'Iminsi Yose',
    'student.recent_badges': 'Ikimenyetso Vya Vuba',
    'student.new_badges': 'Ikimenyetso Gishya Byabonye!',
    'student.level_progress': 'Imbere y\'Urwego',
    'student.to_next_level': 'kugera ku rwego rukurikira',
    
    // Levels
    'level.digital_explorer': 'Umushakisha wa Digital',
    'level.tech_adventurer': 'Umukinnyi wa Tech',
    'level.code_navigator': 'Umuyobora wa Code',
    'level.digital_guardian': 'Umurinzi wa Digital',
    'level.tech_master': 'Umuhanga wa Tech',
    'level.digital_wizard': 'Umurozi wa Digital',
    
    // Badges
    'badge.first_steps': 'Intambwe za Mbere',
    'badge.first_steps_desc': 'Warangije isomo rya mbere!',
    'badge.typing_master': 'Umuhanga wa Typing',
    'badge.typing_master_desc': 'Warangije amasomo 5 ya typing',
    'badge.safe_surfer': 'Umushakisha Uzira',
    'badge.safe_surfer_desc': 'Wize ibyerekeye ukuzira kw\'internet',
    'badge.code_breaker': 'Umutakura wa Code',
    'badge.code_breaker_desc': 'Wakemuye ibisubizo 10 bya code',
    'badge.weekly_champion': 'Uwatsinze mu Cyumweru',
    'badge.weekly_champion_desc': 'Uwatsinze mu cyumweru',
    'badge.perfect_score': 'Icyuzuzo Cyuzuye',
    'badge.perfect_score_desc': 'Wabonye 100% mu isomo',
    
    // Leaderboard
    'leaderboard.title': 'Urutonde',
    'leaderboard.subtitle': 'Abatsinze',
    'leaderboard.all_time': 'Igihe Cyose',
    'leaderboard.this_week': 'Iki Cyumweru',
    'leaderboard.no_data': 'Nta makuru ahari. Rangiza amasomo kugira ngo ugaragare ku rutonde!',
    'leaderboard.keep_learning': 'Komeza kwiga!',
    'leaderboard.motivation_all': 'Rangiza amasomo menshi kandi ubone ikimenyetso kugira ngo ugaragare ku rutonde!',
    'leaderboard.motivation_weekly': 'Komeza ukora mu cyumweru kugira ngo ugaragare ku rutonde rw\'icyumweru!',
    
    // Lessons
    'lesson.typing_basics': 'Intangiriro za Typing',
    'lesson.safe_browsing': 'Gushakisha Uzira',
    'lesson.block_puzzles': 'Ibisubizo bya Block',
    'lesson.start_lesson': 'Tangira Isomo',
    'lesson.continue_lesson': 'Komeza Isomo',
    'lesson.lesson_complete': 'Isomo Ryarangije!',
    'lesson.congratulations': 'Twagushimye!',
    
    // Demo Actions
    'demo.complete_lesson': 'Rangiza Isomo',
    'demo.typing_lesson': 'Isomo rya Typing',
    'demo.coding_puzzle': 'Ibisubizo bya Code',
    'demo.perfect_score': 'Icyuzuzo Cyuzuye',
    
    // Error Messages
    'error.loading_progress': 'Ntibishoboka gusubira imbere yanyu. Ongera ugerageze.',
    'error.generic': 'Hari ikosa. Ongera ugerageze.',
    
    // Accessibility
    'accessibility.large_text': 'Inyandiko Nini',
    'accessibility.high_contrast': 'Gutandukanya Nini',
    'accessibility.audio_feedback': 'Gusubira mu Majwi'
  }
}

class LanguageManager {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || LANGUAGES.EN
    this.listeners = []
  }

  getStoredLanguage() {
    try {
      return localStorage.getItem('diglearners-language') || LANGUAGES.EN
    } catch {
      return LANGUAGES.EN
    }
  }

  setLanguage(language) {
    if (!Object.values(LANGUAGES).includes(language)) {
      console.warn('Invalid language:', language)
      return
    }
    
    this.currentLanguage = language
    try {
      localStorage.setItem('diglearners-language', language)
    } catch (error) {
      console.warn('Could not save language preference:', error)
    }
    
    this.notifyListeners()
  }

  getCurrentLanguage() {
    return this.currentLanguage
  }

  translate(key, fallback = key) {
    const translation = TRANSLATIONS[this.currentLanguage]?.[key]
    return translation || fallback
  }

  // Subscribe to language changes
  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentLanguage))
  }

  // Get all available languages
  getAvailableLanguages() {
    return Object.entries(LANGUAGES).map(([key, value]) => ({
      key,
      value,
      name: this.getLanguageName(value)
    }))
  }

  getLanguageName(languageCode) {
    const names = {
      [LANGUAGES.EN]: 'English',
      [LANGUAGES.RW]: 'Kinyarwanda'
    }
    return names[languageCode] || languageCode
  }

  // Check if RTL (Right-to-Left) language
  isRTL() {
    return false // Both English and Kinyarwanda are LTR
  }
}

export const languageManager = new LanguageManager()

// React hook for using translations
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = React.useState(languageManager.getCurrentLanguage())
  
  React.useEffect(() => {
    const unsubscribe = languageManager.subscribe(setCurrentLanguage)
    return unsubscribe
  }, [])
  
  const t = (key, fallback) => languageManager.translate(key, fallback)
  const setLanguage = (language) => languageManager.setLanguage(language)
  
  return { t, setLanguage, currentLanguage }
}

// Higher-order component for translation
export function withTranslation(WrappedComponent) {
  return function TranslatedComponent(props) {
    const { t, setLanguage, currentLanguage } = useTranslation()
    return React.createElement(WrappedComponent, { ...props, t, setLanguage, currentLanguage })
  }
}
