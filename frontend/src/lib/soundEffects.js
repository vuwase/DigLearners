// Sound Effects Utility for Kid-Friendly Interactions
class SoundManager {
  constructor() {
    this.audioContext = null
    this.soundsEnabled = true
    this.volume = 0.5
    
    // Initialize audio context when user interacts
    this.initAudioContext()
  }

  initAudioContext() {
    try {
      // Create audio context on first interaction
      if (typeof window !== 'undefined' && window.AudioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      }
    } catch (e) {
      console.warn('Audio context not available:', e)
    }
  }

  // Ensure audio context is ready (required for browser autoplay policies)
  async ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext()
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  // Play a beep sound
  playBeep(frequency = 440, duration = 100, type = 'sine') {
    if (!this.soundsEnabled) return
    
    this.ensureAudioContext().then(() => {
      if (this.audioContext) {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)
        
        oscillator.frequency.value = frequency
        oscillator.type = type
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000)
        
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + duration / 1000)
      }
    }).catch(() => {
      // Silently fail if audio can't be played
    })
  }

  // Play click sound
  playClick() {
    this.playBeep(800, 50, 'square')
  }

  // Play success sound
  playSuccess() {
    this.playBeep(523, 100, 'sine')
    setTimeout(() => this.playBeep(659, 100, 'sine'), 100)
    setTimeout(() => this.playBeep(784, 200, 'sine'), 200)
  }

  // Play error sound
  playError() {
    this.playBeep(200, 300, 'sawtooth')
  }

  // Play button hover sound
  playHover() {
    this.playBeep(600, 30, 'sine')
  }

  // Play block selection sound
  playBlockSelect() {
    this.playBeep(440, 80, 'triangle')
  }

  // Play completion sound
  playCompletion() {
    // Play a fun melody
    const notes = [523, 659, 784, 988, 784, 659, 523]
    notes.forEach((freq, index) => {
      setTimeout(() => this.playBeep(freq, 150, 'sine'), index * 120)
    })
  }

  // Play level up sound
  playLevelUp() {
    this.playBeep(440, 100, 'sine')
    setTimeout(() => this.playBeep(554, 100, 'sine'), 100)
    setTimeout(() => this.playBeep(659, 200, 'sine'), 200)
  }

  // Play next button sound
  playNextButton() {
    this.playBeep(600, 80, 'sine')
    setTimeout(() => this.playBeep(700, 80, 'sine'), 80)
  }

  // Play notification sound
  playNotification() {
    this.playBeep(523, 100, 'sine')
  }

  // Play bot message sound
  playBotMessage() {
    this.playBeep(400, 60, 'triangle')
  }

  // Toggle sounds on/off
  toggleSounds() {
    this.soundsEnabled = !this.soundsEnabled
    if (this.soundsEnabled) {
      this.playSuccess()
    }
    return this.soundsEnabled
  }

  // Set volume (0 to 1)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }
}

// Create singleton instance
const soundManager = new SoundManager()

// Export React hook for easy use
export const useSound = () => {
  return {
    playClick: () => soundManager.playClick(),
    playSuccess: () => soundManager.playSuccess(),
    playError: () => soundManager.playError(),
    playHover: () => soundManager.playHover(),
    playBlockSelect: () => soundManager.playBlockSelect(),
    playCompletion: () => soundManager.playCompletion(),
    playLevelUp: () => soundManager.playLevelUp(),
    playNextButton: () => soundManager.playNextButton(),
    playNotification: () => soundManager.playNotification(),
    playBotMessage: () => soundManager.playBotMessage(),
    toggleSounds: () => soundManager.toggleSounds(),
    soundsEnabled: soundManager.soundsEnabled
  }
}

// Export direct access
export default soundManager

