// Gamification system for DigLearners
import { openDB } from 'idb'

const DB_NAME = 'diglearners-db'
const DB_VERSION = 2

// Badge definitions
export const BADGES = {
  FIRST_LESSON: {
    id: 'first_lesson',
    name: 'First Steps',
    description: 'Completed your first lesson!',
    icon: 'target',
    points: 10,
    requirement: { type: 'lessons_completed', count: 1 }
  },
  TYPING_MASTER: {
    id: 'typing_master',
    name: 'Typing Master',
    description: 'Completed 5 typing lessons',
    icon: 'computer',
    points: 50,
    requirement: { type: 'typing_lessons', count: 5 }
  },
  SAFE_SURFER: {
    id: 'safe_surfer',
    name: 'Safe Surfer',
    description: 'Learned about internet safety',
    icon: 'shield',
    points: 30,
    requirement: { type: 'safety_lessons', count: 3 }
  },
  CODE_BREAKER: {
    id: 'code_breaker',
    name: 'Code Breaker',
    description: 'Solved 10 coding puzzles',
    icon: 'puzzle',
    points: 100,
    requirement: { type: 'coding_puzzles', count: 10 }
  },
  WEEKLY_CHAMPION: {
    id: 'weekly_champion',
    name: 'Weekly Champion',
    description: 'Top performer this week',
    icon: 'achievement',
    points: 200,
    requirement: { type: 'weekly_leaderboard', position: 1 }
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Got 100% on a lesson',
    icon: 'star',
    points: 25,
    requirement: { type: 'perfect_score', count: 1 }
  }
}

// Level definitions
export const LEVELS = [
  { level: 1, name: 'Digital Explorer', pointsRequired: 0, color: '#4CAF50' },
  { level: 2, name: 'Tech Adventurer', pointsRequired: 100, color: '#2196F3' },
  { level: 3, name: 'Code Navigator', pointsRequired: 250, color: '#FF9800' },
  { level: 4, name: 'Digital Guardian', pointsRequired: 500, color: '#9C27B0' },
  { level: 5, name: 'Tech Master', pointsRequired: 1000, color: '#F44336' },
  { level: 6, name: 'Digital Wizard', pointsRequired: 2000, color: '#795548' }
]

class GamificationManager {
  constructor() {
    this.db = null
    this.initDB()
  }

  async initDB() {
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('userProgress')) {
          db.createObjectStore('userProgress', { keyPath: 'userId' })
        }
        if (!db.objectStoreNames.contains('badges')) {
          db.createObjectStore('badges', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id', autoIncrement: true })
        }
      }
    })
  }

  // Get user progress
  async getUserProgress(userId) {
    const tx = this.db.transaction('userProgress', 'readonly')
    const store = tx.objectStore('userProgress')
    const progress = await store.get(userId)
    
    if (!progress) {
      return {
        userId,
        totalPoints: 0,
        level: 1,
        badges: [],
        lessonsCompleted: 0,
        typingLessons: 0,
        safetyLessons: 0,
        codingPuzzles: 0,
        perfectScores: 0,
        streak: 0,
        lastActivity: null
      }
    }
    
    return progress
  }

  // Update user progress
  async updateProgress(userId, activity) {
    const progress = await this.getUserProgress(userId)
    const now = new Date()
    
    // Update activity counts
    switch (activity.type) {
      case 'lesson_completed':
        progress.lessonsCompleted++
        progress.totalPoints += activity.points || 10
        break
      case 'typing_lesson':
        progress.typingLessons++
        progress.totalPoints += activity.points || 15
        break
      case 'safety_lesson':
        progress.safetyLessons++
        progress.totalPoints += activity.points || 20
        break
      case 'coding_puzzle':
        progress.codingPuzzles++
        progress.totalPoints += activity.points || 25
        break
      case 'perfect_score':
        progress.perfectScores++
        progress.totalPoints += activity.points || 30
        break
    }

    // Update streak
    if (progress.lastActivity) {
      const lastDate = new Date(progress.lastActivity)
      const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24))
      if (daysDiff === 1) {
        progress.streak++
      } else if (daysDiff > 1) {
        progress.streak = 1
      }
    } else {
      progress.streak = 1
    }

    progress.lastActivity = now.toISOString()

    // Calculate new level
    const newLevel = this.calculateLevel(progress.totalPoints)
    progress.level = newLevel

    // Check for new badges
    const newBadges = await this.checkBadges(progress)
    progress.badges = [...new Set([...progress.badges, ...newBadges])]

    // Save progress
    const tx = this.db.transaction('userProgress', 'readwrite')
    const store = tx.objectStore('userProgress')
    await store.put(progress)
    await tx.done

    return { progress, newBadges }
  }

  // Calculate user level based on points
  calculateLevel(points) {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].pointsRequired) {
        return LEVELS[i].level
      }
    }
    return 1
  }

  // Check for new badges
  async checkBadges(progress) {
    const newBadges = []
    
    for (const badgeId in BADGES) {
      const badge = BADGES[badgeId]
      if (progress.badges.includes(badge.id)) continue

      let earned = false
      switch (badge.requirement.type) {
        case 'lessons_completed':
          earned = progress.lessonsCompleted >= badge.requirement.count
          break
        case 'typing_lessons':
          earned = progress.typingLessons >= badge.requirement.count
          break
        case 'safety_lessons':
          earned = progress.safetyLessons >= badge.requirement.count
          break
        case 'coding_puzzles':
          earned = progress.codingPuzzles >= badge.requirement.count
          break
        case 'perfect_score':
          earned = progress.perfectScores >= badge.requirement.count
          break
      }

      if (earned) {
        newBadges.push(badge)
        // Store achievement
        const tx = this.db.transaction('achievements', 'readwrite')
        const store = tx.objectStore('achievements')
        await store.add({
          userId: progress.userId,
          badgeId: badge.id,
          earnedAt: new Date().toISOString(),
          points: badge.points
        })
        await tx.done
      }
    }

    return newBadges
  }

  // Get leaderboard data
  async getLeaderboard(limit = 10) {
    const tx = this.db.transaction('userProgress', 'readonly')
    const store = tx.objectStore('userProgress')
    const allProgress = await store.getAll()
    
    return allProgress
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit)
      .map((progress, index) => ({
        ...progress,
        rank: index + 1
      }))
  }

  // Get weekly leaderboard
  async getWeeklyLeaderboard(limit = 10) {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const tx = this.db.transaction('achievements', 'readonly')
    const store = tx.objectStore('achievements')
    const achievements = await store.getAll()
    
    // Filter achievements from last week
    const weeklyAchievements = achievements.filter(achievement => 
      new Date(achievement.earnedAt) >= oneWeekAgo
    )
    
    // Calculate weekly points per user
    const weeklyPoints = {}
    weeklyAchievements.forEach(achievement => {
      if (!weeklyPoints[achievement.userId]) {
        weeklyPoints[achievement.userId] = 0
      }
      weeklyPoints[achievement.userId] += achievement.points
    })
    
    // Get user progress for names
    const userProgress = await this.getUserProgress('all')
    const leaderboard = Object.entries(weeklyPoints)
      .map(([userId, points]) => ({
        userId,
        points,
        ...userProgress
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))
    
    return leaderboard
  }

  // Get level info
  getLevelInfo(level) {
    return LEVELS.find(l => l.level === level) || LEVELS[0]
  }

  // Get next level info
  getNextLevelInfo(currentLevel) {
    const nextLevel = LEVELS.find(l => l.level === currentLevel + 1)
    return nextLevel || null
  }

  // Calculate progress to next level
  getProgressToNextLevel(currentPoints, currentLevel) {
    const nextLevel = this.getNextLevelInfo(currentLevel)
    if (!nextLevel) return { progress: 100, pointsNeeded: 0 }
    
    const pointsNeeded = nextLevel.pointsRequired - currentPoints
    const totalPointsNeeded = nextLevel.pointsRequired - LEVELS[currentLevel - 1].pointsRequired
    const progress = Math.max(0, Math.min(100, ((totalPointsNeeded - pointsNeeded) / totalPointsNeeded) * 100))
    
    return { progress, pointsNeeded }
  }
}

export const gamificationManager = new GamificationManager()
