// Mock data service for DigLearners platform
// This provides realistic data for development and testing

export const mockLessons = [
  {
    id: 1,
    title: "Introduction to Digital Literacy",
    description: "Learn the basics of using computers and digital devices",
    moduleType: "introduction",
    difficulty: "beginner",
    estimatedTime: "15 minutes",
    points: 20,
    prerequisites: [],
    content: "Welcome to your digital literacy journey! In this lesson, you'll learn about computers, tablets, and how to use them safely.",
    objectives: [
      "Understand what a computer is",
      "Learn basic computer parts",
      "Practice using a mouse and keyboard"
    ],
    isCompleted: true,
    completedAt: "2024-01-15T10:30:00Z",
    score: 95
  },
  {
    id: 2,
    title: "Mouse and Keyboard Basics",
    description: "Master the fundamental skills of using a mouse and keyboard",
    moduleType: "typing",
    difficulty: "beginner",
    estimatedTime: "20 minutes",
    points: 25,
    prerequisites: [1],
    content: "Practice using the mouse to click, drag, and scroll. Learn keyboard shortcuts and typing techniques.",
    objectives: [
      "Click and double-click accurately",
      "Drag and drop objects",
      "Type with proper finger placement"
    ],
    isCompleted: true,
    completedAt: "2024-01-16T14:20:00Z",
    score: 88
  },
  {
    id: 3,
    title: "Internet Safety for Kids",
    description: "Learn how to stay safe while browsing the internet",
    moduleType: "safety",
    difficulty: "beginner",
    estimatedTime: "25 minutes",
    points: 30,
    prerequisites: [1, 2],
    content: "Discover important safety rules for using the internet. Learn about passwords, personal information, and safe websites.",
    objectives: [
      "Create strong passwords",
      "Identify safe websites",
      "Understand online privacy"
    ],
    isCompleted: false,
    score: null
  },
  {
    id: 4,
    title: "First Coding Adventure",
    description: "Start your programming journey with visual blocks",
    moduleType: "coding",
    difficulty: "beginner",
    estimatedTime: "30 minutes",
    points: 35,
    prerequisites: [1, 2],
    content: "Learn the basics of programming using colorful blocks. Create your first program to make a character move!",
    objectives: [
      "Understand what programming is",
      "Use visual programming blocks",
      "Create a simple sequence"
    ],
    isCompleted: false,
    score: null
  },
  {
    id: 5,
    title: "Advanced Typing Skills",
    description: "Improve your typing speed and accuracy",
    moduleType: "typing",
    difficulty: "intermediate",
    estimatedTime: "35 minutes",
    points: 40,
    prerequisites: [2],
    content: "Practice typing with both hands, learn new keys, and increase your typing speed.",
    objectives: [
      "Type with both hands",
      "Learn number and symbol keys",
      "Increase typing speed to 20 WPM"
    ],
    isCompleted: false,
    score: null
  },
  {
    id: 6,
    title: "Creating Digital Stories",
    description: "Use technology to tell your own stories",
    moduleType: "creative",
    difficulty: "intermediate",
    estimatedTime: "40 minutes",
    points: 45,
    prerequisites: [1, 2, 3],
    content: "Combine text, images, and sounds to create your own digital story.",
    objectives: [
      "Plan a digital story",
      "Add text and images",
      "Record audio narration"
    ],
    isCompleted: false,
    score: null
  }
]

export const mockUserProgress = {
  userId: "student-001",
  username: "Alex K.",
  level: 3,
  totalPoints: 245,
  streak: 7,
  lessonsCompleted: 2,
  typingLessons: 1,
  safetyLessons: 0,
  codingPuzzles: 0,
  perfectScores: 1,
  badges: ["first_lesson", "typing_master"],
  lastActivity: "2024-01-16T14:20:00Z",
  weeklyProgress: {
    lessonsCompleted: 2,
    timeSpent: 35,
    pointsEarned: 45
  },
  monthlyProgress: {
    lessonsCompleted: 8,
    timeSpent: 180,
    pointsEarned: 245
  }
}

export const mockBadges = [
  {
    id: "first_lesson",
    name: "First Steps",
    description: "Completed your first lesson!",
    icon: "target",
    points: 10,
    category: "achievement",
    isEarned: true,
    earnedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "typing_master",
    name: "Typing Master",
    description: "Completed 5 typing lessons",
    icon: "computer",
    points: 50,
    category: "achievement",
    isEarned: true,
    earnedAt: "2024-01-16T14:20:00Z"
  },
  {
    id: "safe_surfer",
    name: "Safe Surfer",
    description: "Learned about internet safety",
    icon: "shield",
    points: 30,
    category: "achievement",
    isEarned: false,
    earnedAt: null
  },
  {
    id: "code_breaker",
    name: "Code Breaker",
    description: "Solved 10 coding puzzles",
    icon: "puzzle",
    points: 100,
    category: "achievement",
    isEarned: false,
    earnedAt: null
  },
  {
    id: "weekly_champion",
    name: "Weekly Champion",
    description: "Top performer this week",
    icon: "achievement",
    points: 200,
    category: "special",
    isEarned: false,
    earnedAt: null
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Got 100% on a lesson",
    icon: "star",
    points: 25,
    category: "achievement",
    isEarned: true,
    earnedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "streak_master",
    name: "Streak Master",
    description: "7-day learning streak",
    icon: "lightning",
    points: 75,
    category: "milestone",
    isEarned: true,
    earnedAt: "2024-01-16T14:20:00Z"
  },
  {
    id: "digital_explorer",
    name: "Digital Explorer",
    description: "Completed Introduction module",
    icon: "globe",
    points: 40,
    category: "milestone",
    isEarned: true,
    earnedAt: "2024-01-15T10:30:00Z"
  }
]

export const mockAssignments = [
  {
    id: 1,
    title: "Complete Internet Safety Module",
    description: "Finish all lessons in the Internet Safety module to learn about online safety",
    teacher: "Mrs. Mukamana",
    dueDate: "2024-01-25T23:59:00Z",
    points: 50,
    status: "assigned",
    progress: 0,
    lessons: [3],
    createdAt: "2024-01-18T09:00:00Z"
  },
  {
    id: 2,
    title: "Practice Typing Skills",
    description: "Complete 3 typing lessons to improve your keyboard skills",
    teacher: "Mrs. Mukamana",
    dueDate: "2024-01-30T23:59:00Z",
    points: 75,
    status: "in_progress",
    progress: 33,
    lessons: [2, 5],
    createdAt: "2024-01-18T09:00:00Z"
  },
  {
    id: 3,
    title: "Create Your First Program",
    description: "Complete the coding adventure and create a simple program",
    teacher: "Mr. Nkurunziza",
    dueDate: "2024-02-05T23:59:00Z",
    points: 100,
    status: "assigned",
    progress: 0,
    lessons: [4],
    createdAt: "2024-01-20T10:00:00Z"
  }
]

export const mockLeaderboard = [
  {
    rank: 1,
    studentId: "student-001",
    name: "Alex K.",
    avatar: "Boy",
    points: 245,
    level: 3,
    lessonsCompleted: 2,
    streak: 7,
    badges: 3
  },
  {
    rank: 2,
    studentId: "student-002",
    name: "Grace M.",
    avatar: "Girl",
    points: 220,
    level: 3,
    lessonsCompleted: 2,
    streak: 5,
    badges: 2
  },
  {
    rank: 3,
    studentId: "student-003",
    name: "David R.",
    avatar: "Boy",
    points: 195,
    level: 2,
    lessonsCompleted: 1,
    streak: 3,
    badges: 1
  },
  {
    rank: 4,
    studentId: "student-004",
    name: "Sarah U.",
    avatar: "Girl",
    points: 180,
    level: 2,
    lessonsCompleted: 1,
    streak: 2,
    badges: 1
  },
  {
    rank: 5,
    studentId: "student-005",
    name: "Peter N.",
    avatar: "Boy",
    points: 165,
    level: 2,
    lessonsCompleted: 1,
    streak: 1,
    badges: 1
  }
]

export const mockAchievements = {
  totalBadges: 8,
  earnedBadges: 4,
  recentAchievements: [
    {
      id: "streak_master",
      name: "Streak Master",
      description: "7-day learning streak",
      icon: "lightning",
      earnedAt: "2024-01-16T14:20:00Z"
    },
    {
      id: "typing_master",
      name: "Typing Master",
      description: "Completed 5 typing lessons",
      icon: "computer",
      earnedAt: "2024-01-16T14:20:00Z"
    },
    {
      id: "perfect_score",
      name: "Perfect Score",
      description: "Got 100% on a lesson",
      icon: "star",
      earnedAt: "2024-01-15T10:30:00Z"
    }
  ],
  upcomingBadges: [
    {
      id: "safe_surfer",
      name: "Safe Surfer",
      description: "Complete 3 safety lessons",
      icon: "shield",
      progress: 0,
      required: 3
    },
    {
      id: "code_breaker",
      name: "Code Breaker",
      description: "Solve 10 coding puzzles",
      icon: "puzzle",
      progress: 0,
      required: 10
    }
  ]
}

export const mockClassProgress = {
  className: "Digital Literacy Class",
  teacher: "Mrs. Mukamana",
  totalStudents: 25,
  averageProgress: 68,
  topPerformers: [
    { name: "Alex K.", points: 245, avatar: "Boy" },
    { name: "Grace M.", points: 220, avatar: "Girl" },
    { name: "David R.", points: 195, avatar: "Boy" }
  ],
  classStats: {
    totalLessonsCompleted: 45,
    averageScore: 82,
    totalTimeSpent: 1250,
    activeStudents: 23
  }
}

// Helper functions
export const getLessonsByModule = (moduleType) => {
  return mockLessons.filter(lesson => lesson.moduleType === moduleType)
}

export const getCompletedLessons = () => {
  return mockLessons.filter(lesson => lesson.isCompleted)
}

export const getPendingLessons = () => {
  return mockLessons.filter(lesson => !lesson.isCompleted)
}

export const getEarnedBadges = () => {
  return mockBadges.filter(badge => badge.isEarned)
}

export const getPendingBadges = () => {
  return mockBadges.filter(badge => !badge.isEarned)
}

export const getAssignmentsByStatus = (status) => {
  return mockAssignments.filter(assignment => assignment.status === status)
}

export const getLeaderboardByPeriod = (period = 'weekly') => {
  // In a real app, this would filter by time period
  return mockLeaderboard
}

export const calculateProgressPercentage = (completed, total) => {
  return Math.round((completed / total) * 100)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatTimeAgo = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  if (diffInHours < 48) return 'Yesterday'
  return `${Math.floor(diffInHours / 24)} days ago`
}
