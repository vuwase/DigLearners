// Live Bot Assistant for Kids
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSound } from '../../lib/soundEffects'
import './LiveBot.css'

const normalizeMessage = (message = '') =>
  message
    .toLowerCase()
    .replace(/[^a-z0-9\s?!.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokenizeMessage = (message = '') => normalizeMessage(message).split(' ').filter(Boolean)

const knowledgeBase = [
  {
    intent: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    sampleQuestions: ['who are you', 'what can you do'],
    response:
      "Hey superstar! I'm DigiBot, your friendly learning buddy. I can guide you through lessons, games, dashboards, and anything else you're curious about!",
    followUp: 'Try asking me about your dashboard, earning badges, or how to finish a tricky lesson.'
  },
  {
    intent: 'lessons_help',
    keywords: ['lesson', 'complete lesson', 'finish lesson', 'learning activity', 'module', 'activity help'],
    sampleQuestions: ['how do i complete a lesson', 'lesson instructions'],
    response:
      'Lessons are set up like adventures! Read the instructions, complete each activity card, then press the big Run Code or Submit button. If you get stuck, use the hint button or break the task into tiny steps.',
    followUp: 'Want suggestions for a specific lesson or to see your progress?' 
  },
  {
    intent: 'teacher_dashboard',
    keywords: ['teacher dashboard', 'teacher home', 'teaching overview', 'manage students', 'teacher view'],
    sampleQuestions: ['what is on the teacher dashboard', 'how do teachers use the dashboard'],
    response:
      "The teacher dashboard shows your draft lessons, total students, assignments, and class progress in one place. Use the quick cards to jump into creating work, scheduling, analytics, or managing your learners right away.",
    followUp: 'Ask me how to register students or create a new gamified lesson if you need a hand.'
  },
  {
    intent: 'student_dashboard',
    keywords: ['student dashboard', 'my dashboard', 'learner dashboard', 'student home'],
    sampleQuestions: ['where do i see my progress', 'what does the student dashboard show'],
    response:
      'The student dashboard shows your level, points, streak, and badges. Each stat card highlights lessons finished, stars earned, and your current streak so you always know how awesome you are doing!',
    followUp: 'Need tips on earning more points or unlocking new badges?' 
  },
  {
    intent: 'points_badges',
    keywords: ['points', 'stars', 'badges', 'rewards', 'trophies'],
    sampleQuestions: ['how to earn badges', 'how to get more stars'],
    response:
      'You earn stars, points, and shiny badges by completing lessons, hitting streaks, and finishing special challenges. Teachers can also reward you for bonus activities, so keep exploring different games!',
    followUp: 'Want ideas on which activity gives the biggest point boost today?'
  },
  {
    intent: 'register_student',
    keywords: ['register student', 'add student', 'student signup', 'student registration', 'new learner'],
    sampleQuestions: ['how do i register a student', 'how to add a learner'],
    response:
      'To register a student, open Student Management on the teacher dashboard, click “+ Register New Student”, fill in their full name, grade, and optional age, then submit. You’ll get a friendly code to share if needed.',
    followUp: 'Need help editing a student later or checking their progress?'
  },
  {
    intent: 'assignments',
    keywords: ['assignment', 'homework', 'tasks', 'worksheets', 'work'],
    sampleQuestions: ['how do i create an assignment', 'where are assignments'],
    response:
      'Assignments live in the dashboard cards. Pick “Create Work” to build lessons or “Assignments” to monitor submissions and reviews. You can set points, add instructions, and track which students have finished.',
    followUp: 'Ask me how to see pending reviews or send a reminder to your class.'
  },
  {
    intent: 'analytics_progress',
    keywords: ['progress', 'analytics', 'reports', 'monitoring', 'track', 'average progress'],
    sampleQuestions: ['how do i see class progress', 'where are analytics'],
    response:
      'Progress tracking is built into the dashboard. Use the analytics card for high-level trends, or open Student Management to see individual streaks, points, and completed lessons grouped by grade.',
    followUp: 'Want tips on spotting who might need a quick boost or celebration?'
  },
  {
    intent: 'schedule_deadlines',
    keywords: ['schedule', 'calendar', 'deadlines', 'upcoming', 'reminders'],
    sampleQuestions: ['how do i plan my schedule', 'where do i see deadlines'],
    response:
      'Open the Schedule card to check upcoming deadlines and organize your teaching week. You can line up lessons, view due dates, and make sure students know what is coming next.',
    followUp: 'Need help balancing lesson releases or spacing out assignments?'
  },
  {
    intent: 'login_help',
    keywords: ['login', 'sign in', 'password', 'log in', 'cant log in', 'sign-in'],
    sampleQuestions: ['i cannot log in', 'forgot my password'],
    response:
      'If logging in is tricky, double-check your email and password, then try the password reset link if it’s available. Teachers can also reset student access codes from the Student Management panel.',
    followUp: 'Still stuck? Let a teacher or admin know so they can verify your account details.'
  },
  {
    intent: 'games_fun',
    keywords: ['game', 'play', 'coding', 'puzzle', 'typing', 'cat game', 'code quest'],
    sampleQuestions: ['what games can i play', 'tell me about code quest'],
    response:
      'There are loads of games! Try Code Quest to guide the kitty with code blocks, Typing Adventures for speedy fingers, or Safe Internet Explorer to learn online safety while playing.',
    followUp: 'Say the name of a game and I can give you bonus tips or strategies!'
  },
  {
    intent: 'thanks',
    keywords: ['thank you', 'thanks', 'you rock', 'appreciate'],
    sampleQuestions: ['thanks bot'],
    response:
      'Aww, thank you! Helping you learn is my favorite thing. Keep being curious and amazing!',
    followUp: 'Let me know what we should explore next together.'
  },
  {
    intent: 'goodbye',
    keywords: ['bye', 'goodbye', 'see you', 'later'],
    sampleQuestions: ['bye for now'],
    response:
      'Bye for now! Keep shining bright and come back anytime you want to learn or share something new.',
    followUp: 'I’ll be right here when you need another learning buddy high-five.'
  }
]

const fallbackResponses = [
  "That's a great question! Tell me whether it’s about lessons, games, dashboards, or something else so I can give super-specific help.",
  "I love your curiosity! Let me know if you want tips for students, teachers, or a particular game, and I’ll zoom right in.",
  "Hmm, I want to get this perfect. Try asking about progress, badges, schedules, or any feature you see on the dashboard."
]

const suggestionTopics = ['registering students', 'tracking progress', 'finding new games', 'earning badges', 'planning schedules', 'checking assignments']

const MATCH_THRESHOLD = 1.4
const questionWords = ['how', 'what', 'where', 'when', 'why', 'who', 'can', 'do', 'does', 'is', 'are', 'will', 'should']

const calculateEntryScore = (entry, normalizedMessage, tokens) => {
  let score = 0

  entry.keywords.forEach((keyword) => {
    const trimmedKeyword = keyword.trim()
    if (!trimmedKeyword) return

    if (normalizedMessage.includes(trimmedKeyword)) {
      score += trimmedKeyword.split(' ').length > 1 ? 2.2 : 1.2
      return
    }

    const keywordTokens = trimmedKeyword.split(' ')
    if (keywordTokens.every((token) => tokens.includes(token))) {
      score += keywordTokens.length > 1 ? 1.8 : 1
      return
    }

    if (keywordTokens.length === 1 && tokens.some((token) => token.startsWith(keywordTokens[0]))) {
      score += 0.6
    }
  })

  entry.sampleQuestions?.forEach((sample) => {
    if (normalizedMessage.includes(sample)) {
      score += 2.5
    }
  })

  if (entry.priority) {
    score += entry.priority
  }

  return score
}

const LiveBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const messagesEndRef = useRef(null)
  const synthRef = useRef(null)
  const { playClick, playSuccess } = useSound()

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Get a kid-like voice (high-pitched, child-like)
  const getKidVoice = () => {
    if (!synthRef.current) return null
    
    const voices = synthRef.current.getVoices()
    
    // Try to find child-like or high-pitched voices
    const kidVoices = [
      'Google UK English Female', // Often higher pitched
      'Microsoft Zira - English (United States)', // Female, can sound younger
      'Samantha', // Mac female voice - can be adjusted to sound like kid
      'Victoria', // Mac voice
      'Karen', // Australian female
      'Fiona', // Scottish female
      'Tessa', // South African female
      'Veena' // Indian English female
    ]
    
    // First try to find kid-sounding voices
    for (const kidVoice of kidVoices) {
      const voice = voices.find(v => v.name.includes(kidVoice))
      if (voice) return voice
    }
    
    // Fallback: find any female voice (typically higher pitch)
    const femaleVoice = voices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('victoria') ||
      v.name.toLowerCase().includes('karen')
    )
    if (femaleVoice) return femaleVoice
    
    // Last resort: use default voice
    return voices.find(v => v.default) || voices[0] || null
  }

  // Speak text with kid-like voice (memoized to avoid recreating on each render)
  const speakText = useCallback((text) => {
    if (!voiceEnabled || !synthRef.current) {
      console.log('[LiveBot] Voice disabled or synth not available')
      return
    }
    
    // Stop any current speech
    synthRef.current.cancel()
    
    // Wait a bit to ensure voices are loaded
    const speakWithKidVoice = () => {
      const voices = synthRef.current.getVoices()
      console.log('[LiveBot] Available voices when speaking:', voices.length)
      
      if (voices.length === 0) {
        console.warn('[LiveBot] No voices loaded yet, retrying...')
        setTimeout(speakWithKidVoice, 200)
        return
      }
      
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Get kid voice directly from voices array
      const kidVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('karen') ||
        v.name.toLowerCase().includes('fiona')
      ) || voices.find(v => v.default) || voices[0]
      
      if (kidVoice) {
        utterance.voice = kidVoice
        utterance.voiceURI = kidVoice.voiceURI
        console.log('[LiveBot] ✅ Using kid voice:', kidVoice.name)
      } else {
        console.warn('[LiveBot] No kid voice found, using default')
      }
      
      // Make it sound like a kid - MUCH higher pitch, faster, excited tone
      utterance.rate = 1.35 // Faster (kids talk faster when excited) - range 0.1 to 10
      utterance.pitch = 1.9 // Very high pitch to sound like a kid (0 to 2, default is 1, max is 2)
      utterance.volume = 1.0 // Maximum volume (kids can be loud!)
      utterance.lang = 'en-US'
      
      // Add some expression
      utterance.onstart = () => {
        console.log('[LiveBot] ✅ Speaking with kid voice:', text)
        console.log('[LiveBot] Voice:', kidVoice?.name || 'default')
        console.log('[LiveBot] Settings - Pitch:', utterance.pitch, 'Rate:', utterance.rate, 'Volume:', utterance.volume)
      }
      
      utterance.onerror = (error) => {
        console.error('[LiveBot] Speech error:', error)
      }
      
      utterance.onend = () => {
        console.log('[LiveBot] Finished speaking')
      }
      
      try {
        synthRef.current.speak(utterance)
      } catch (error) {
        console.error('[LiveBot] Error speaking:', error)
      }
    }
    
    // Try immediately, then retry if voices not loaded
    if (synthRef.current.getVoices().length === 0) {
      setTimeout(speakWithKidVoice, 300)
    } else {
      speakWithKidVoice()
    }
  }, [voiceEnabled])

  useEffect(() => {
    // Load voices when component mounts - wait for voices to be available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          console.log('[LiveBot] Voices loaded:', voices.length)
          console.log('[LiveBot] Available voices:', voices.map(v => v.name))
          
          // Force a re-render to ensure voices are available for speakText
          const kidVoice = voices.find(v => 
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('victoria')
          )
          if (kidVoice) {
            console.log('[LiveBot] Using kid voice:', kidVoice.name)
          }
        }
      }
      
      // Load immediately
      loadVoices()
      
      // Chrome loads voices asynchronously, so listen for the event
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
      
      // Also try after a delay in case voices aren't ready
      setTimeout(loadVoices, 1000)
    }
  }, [])

  useEffect(() => {
    // Add welcome message when bot opens
    if (isOpen && messages.length === 0) {
      const welcomeMsg = "Hi! I'm DigiBot! 🎉 How can I help you learn today?"
      addBotMessage(welcomeMsg)
      // Speak the welcome message
      setTimeout(() => speakText(welcomeMsg), 500)
    }
  }, [isOpen, messages.length, speakText])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { type: 'bot', text, timestamp: Date.now() }])
  }

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text, timestamp: Date.now() }])
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    playClick()
    addUserMessage(inputValue)
    const userMessage = inputValue.toLowerCase()
    setInputValue('')
    setIsTyping(true)

    // Simulate bot thinking
    setTimeout(() => {
      setIsTyping(false)
      const response = getBotResponse(userMessage)
      addBotMessage(response)
      playSuccess()
      // Speak the bot's response with funny voice
      setTimeout(() => speakText(response), 300)
    }, 1000)
  }

  const getBotResponse = (rawMessage) => {
    const normalized = normalizeMessage(rawMessage)

    if (!normalized) {
      return "Could you please say that again using a few more words? I want to make sure I didn't miss anything."
    }

    const tokens = tokenizeMessage(rawMessage)

    const match = knowledgeBase.reduce(
      (best, entry) => {
        const score = calculateEntryScore(entry, normalized, tokens)
        if (score > best.score) {
          return { entry, score }
        }
        return best
      },
      { entry: null, score: 0 }
    )

    if (match.entry && match.score >= MATCH_THRESHOLD) {
      const { response, followUp } = match.entry
      return followUp ? `${response}\n\n${followUp}` : response
    }

    if (questionWords.some((word) => normalized.startsWith(word))) {
      return "I'm thinking it through! Let me know if this is about lessons, dashboards, games, or account help so I can give you the best answer."
    }

    const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    const picks = [...suggestionTopics].sort(() => 0.5 - Math.random()).slice(0, 2)
    const suggestionText = picks.join(' or ')
    return `${fallback}\n\nTry asking about ${suggestionText}.`
  }

  const quickQuestions = [
    'How do I register a student?',
    'Where do I see my progress?',
    'Tips for earning more badges',
    'How do assignments work?'
  ]

  // Cleanup: stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  return (
    <>
      <button
        className={`live-bot-button ${isOpen ? 'open' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen)
          playClick()
          if (!isOpen && synthRef.current) {
            // Stop any ongoing speech when opening
            synthRef.current.cancel()
          }
        }}
        aria-label="Open chat bot"
      >
        <span className="bot-icon">🤖</span>
        <span className="bot-pulse"></span>
      </button>

      {isOpen && (
        <div className="live-bot-container">
          <div className="live-bot-header">
            <div className="bot-avatar">🤖</div>
            <div className="bot-info">
              <h3>DigiBot</h3>
              <p>Your Learning Assistant</p>
            </div>
            <div className="bot-controls">
              <button
                className={`voice-toggle ${voiceEnabled ? 'enabled' : 'disabled'}`}
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled)
                  playClick()
                  if (synthRef.current) {
                    synthRef.current.cancel() // Stop current speech
                  }
                }}
                title={voiceEnabled ? 'Turn off voice' : 'Turn on voice'}
                aria-label="Toggle voice"
              >
                {voiceEnabled ? '🔊' : '🔇'}
              </button>
              <button
                className="close-bot"
                onClick={() => {
                  setIsOpen(false)
                  playClick()
                  if (synthRef.current) {
                    synthRef.current.cancel() // Stop speech when closing
                  }
                }}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          <div className="live-bot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.text}
                </div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-questions">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => {
                  setInputValue(question)
                  playClick()
                  // Auto-send quick questions
                  setTimeout(() => {
                    const fakeEvent = { preventDefault: () => {} }
                    handleSend(fakeEvent)
                  }, 100)
                }}
              >
                {question}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="live-bot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything... 🎓"
              className="bot-input-field"
            />
            <button type="submit" className="bot-send-button">
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default LiveBot

