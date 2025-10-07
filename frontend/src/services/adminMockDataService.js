// Admin Mock Data Service
// Comprehensive mock data for all admin pages

export const adminMockDataService = {
  // User Management Data
  getUsers: () => [
    {
      id: 'user_001',
      name: 'Jean Baptiste',
      email: 'jean.baptiste@example.com',
      role: 'learner',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      progress: 75,
      lessonsCompleted: 12,
      badges: 3,
      avatar: 'Boy'
    },
    {
      id: 'user_002',
      name: 'Marie Claire',
      email: 'marie.claire@example.com',
      role: 'learner',
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '2024-01-19',
      progress: 60,
      lessonsCompleted: 8,
      badges: 2,
      avatar: 'Girl'
    },
    {
      id: 'user_003',
      name: 'Pierre Nkurunziza',
      email: 'pierre.nkurunziza@example.com',
      role: 'teacher',
      status: 'active',
      joinDate: '2024-01-05',
      lastActive: '2024-01-20',
      progress: 90,
      lessonsCompleted: 25,
      badges: 5,
      avatar: 'Teacher'
    },
    {
      id: 'user_004',
      name: 'Grace Mukamana',
      email: 'grace.mukamana@example.com',
      role: 'parent',
      status: 'active',
      joinDate: '2024-01-12',
      lastActive: '2024-01-18',
      progress: 45,
      lessonsCompleted: 5,
      badges: 1,
      avatar: 'Parent'
    },
    {
      id: 'user_005',
      name: 'David Niyonshuti',
      email: 'david.niyonshuti@example.com',
      role: 'learner',
      status: 'inactive',
      joinDate: '2024-01-08',
      lastActive: '2024-01-15',
      progress: 30,
      lessonsCompleted: 3,
      badges: 0,
      avatar: 'Boy'
    },
    {
      id: 'user_006',
      name: 'Sarah Uwimana',
      email: 'sarah.uwimana@example.com',
      role: 'learner',
      status: 'active',
      joinDate: '2024-01-18',
      lastActive: '2024-01-20',
      progress: 85,
      lessonsCompleted: 15,
      badges: 4,
      avatar: 'Girl'
    }
  ],

  // Content Management Data
  getContent: () => ({
    lessons: [
      {
        id: 'lesson_001',
        title: 'Introduction to Computers',
        category: 'Digital Literacy',
        level: 'Beginner',
        duration: '30 minutes',
        status: 'published',
        views: 1250,
        completions: 890,
        rating: 4.8,
        lastUpdated: '2024-01-15',
        author: 'Pierre Nkurunziza'
      },
      {
        id: 'lesson_002',
        title: 'Safe Internet Browsing',
        category: 'Digital Safety',
        level: 'Beginner',
        duration: '25 minutes',
        status: 'published',
        views: 980,
        completions: 720,
        rating: 4.6,
        lastUpdated: '2024-01-12',
        author: 'Marie Claire'
      },
      {
        id: 'lesson_003',
        title: 'Basic Programming Concepts',
        category: 'Coding',
        level: 'Intermediate',
        duration: '45 minutes',
        status: 'draft',
        views: 0,
        completions: 0,
        rating: 0,
        lastUpdated: '2024-01-18',
        author: 'Pierre Nkurunziza'
      },
      {
        id: 'lesson_004',
        title: 'Email Communication',
        category: 'Digital Communication',
        level: 'Beginner',
        duration: '20 minutes',
        status: 'published',
        views: 750,
        completions: 580,
        rating: 4.7,
        lastUpdated: '2024-01-10',
        author: 'Grace Mukamana'
      }
    ],
    courses: [
      {
        id: 'course_001',
        title: 'Digital Literacy Fundamentals',
        description: 'Complete course covering basic digital skills',
        lessons: 8,
        students: 45,
        completionRate: 78,
        status: 'active',
        createdDate: '2024-01-01'
      },
      {
        id: 'course_002',
        title: 'Safe Internet Practices',
        description: 'Learn how to browse the internet safely',
        lessons: 5,
        students: 32,
        completionRate: 85,
        status: 'active',
        createdDate: '2024-01-05'
      }
    ]
  }),

  // Analytics Data
  getAnalytics: () => ({
    overview: {
      totalUsers: 1250,
      activeUsers: 890,
      totalLessons: 45,
      completedLessons: 12500,
      totalHours: 2500
    },
    userGrowth: [
      { month: 'Jan', users: 120 },
      { month: 'Feb', users: 180 },
      { month: 'Mar', users: 250 },
      { month: 'Apr', users: 320 },
      { month: 'May', users: 450 },
      { month: 'Jun', users: 580 }
    ],
    lessonPerformance: [
      { lesson: 'Introduction to Computers', completions: 890, rating: 4.8 },
      { lesson: 'Safe Internet Browsing', completions: 720, rating: 4.6 },
      { lesson: 'Email Communication', completions: 580, rating: 4.7 },
      { lesson: 'Basic Programming', completions: 450, rating: 4.5 }
    ],
    userEngagement: {
      dailyActiveUsers: 245,
      weeklyActiveUsers: 890,
      monthlyActiveUsers: 1250,
      averageSessionTime: '25 minutes'
    }
  }),

  // Settings Data
  getSettings: () => ({
    systemSettings: {
      siteName: 'DigLearners',
      siteDescription: 'Empowering digital literacy in Rwanda',
      maintenanceMode: false,
      registrationEnabled: true,
      emailNotifications: true
    },
    userSettings: {
      defaultRole: 'learner',
      requireEmailVerification: true,
      allowSelfRegistration: true,
      maxUsersPerClass: 30
    },
    contentSettings: {
      autoApproveLessons: false,
      maxLessonDuration: 60,
      allowUserGeneratedContent: true,
      contentModeration: true
    },
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: true,
      achievementNotifications: true
    }
  }),

  // Reports Data
  getReports: () => ({
    userReports: [
      {
        id: 'report_001',
        title: 'User Registration Report',
        type: 'user_activity',
        generatedDate: '2024-01-20',
        period: 'Last 30 days',
        status: 'completed',
        fileSize: '2.3 MB'
      },
      {
        id: 'report_002',
        title: 'Learning Progress Report',
        type: 'learning_analytics',
        generatedDate: '2024-01-19',
        period: 'Last 7 days',
        status: 'completed',
        fileSize: '1.8 MB'
      }
    ],
    systemReports: [
      {
        id: 'report_003',
        title: 'System Performance Report',
        type: 'system_metrics',
        generatedDate: '2024-01-18',
        period: 'Last 24 hours',
        status: 'completed',
        fileSize: '0.9 MB'
      },
      {
        id: 'report_004',
        title: 'Content Usage Report',
        type: 'content_analytics',
        generatedDate: '2024-01-17',
        period: 'Last 14 days',
        status: 'generating',
        fileSize: 'N/A'
      }
    ],
    scheduledReports: [
      {
        id: 'scheduled_001',
        title: 'Weekly User Activity',
        frequency: 'Weekly',
        nextRun: '2024-01-27',
        recipients: ['admin@diglearners.rw'],
        status: 'active'
      },
      {
        id: 'scheduled_002',
        title: 'Monthly Learning Analytics',
        frequency: 'Monthly',
        nextRun: '2024-02-01',
        recipients: ['admin@diglearners.rw', 'analytics@diglearners.rw'],
        status: 'active'
      }
    ]
  }),

  // Dashboard Statistics
  getDashboardStats: () => ({
    totalUsers: 1250,
    activeUsers: 890,
    totalLessons: 45,
    completedLessons: 12500,
    systemHealth: 'Good',
    recentActivity: [
      {
        id: 'activity_001',
        type: 'user_registration',
        message: 'New user registered: Sarah Uwimana',
        timestamp: '2024-01-20 14:30',
        user: 'Sarah Uwimana'
      },
      {
        id: 'activity_002',
        type: 'lesson_completed',
        message: 'Lesson completed: Introduction to Computers',
        timestamp: '2024-01-20 13:45',
        user: 'Jean Baptiste'
      },
      {
        id: 'activity_003',
        type: 'badge_earned',
        message: 'Badge earned: Digital Citizen',
        timestamp: '2024-01-20 12:15',
        user: 'Marie Claire'
      }
    ]
  })
}

export default adminMockDataService

