// Parent Dashboard Mock Data Service
// Comprehensive mock data for all parent dashboard pages

export const getParentDashboardData = () => {
  return {
    parent: {
      id: 'parent_001',
      name: 'Marie Uwimana',
      email: 'marie.uwimana@diglearners.rw',
      phone: '+250 788 123 456',
      joinDate: '2024-01-15',
      totalChildren: 2,
      totalLessonsCompleted: 24,
      totalBadges: 12,
      totalLearningTime: '15h 30m'
    },
    children: [
      {
        id: 'child_001',
        name: 'Alice Uwimana',
        avatar: 'Girl',
        age: 9,
        grade: 'Class A',
        progress: 85,
        completedLessons: 12,
        totalLessons: 15,
        badges: 7,
        points: 450,
        lastActive: '2024-12-20',
        parent: 'Marie Uwimana',
        parentContact: '+250 788 123 456',
        strengths: ['Quick learner', 'Good at problem solving', 'Creative thinking'],
        areasForImprovement: ['Needs more practice with typing', 'Could help others more'],
        recentActivity: [
          {
            id: 'act_001',
            type: 'lesson_completed',
            title: 'Digital Citizenship Basics',
            timestamp: '2024-12-20T10:30:00Z',
            points: 25
          },
          {
            id: 'act_002',
            type: 'badge_earned',
            title: 'Digital Explorer Badge',
            timestamp: '2024-12-19T14:20:00Z',
            points: 50
          },
          {
            id: 'act_003',
            type: 'lesson_completed',
            title: 'Introduction to Block Coding',
            timestamp: '2024-12-19T09:15:00Z',
            points: 30
          }
        ]
      },
      {
        id: 'child_002',
        name: 'John Mukasa',
        avatar: 'Boy',
        age: 10,
        grade: 'Class B',
        progress: 78,
        completedLessons: 9,
        totalLessons: 12,
        badges: 5,
        points: 380,
        lastActive: '2024-12-19',
        parent: 'Marie Uwimana',
        parentContact: '+250 788 123 456',
        strengths: ['Creative thinking', 'Good at coding', 'Persistent'],
        areasForImprovement: ['Needs more focus on safety topics', 'Could be more organized'],
        recentActivity: [
          {
            id: 'act_004',
            type: 'lesson_completed',
            title: 'Safe Internet Browsing',
            timestamp: '2024-12-19T16:45:00Z',
            points: 35
          },
          {
            id: 'act_005',
            type: 'badge_earned',
            title: 'Safety First Badge',
            timestamp: '2024-12-18T11:30:00Z',
            points: 40
          }
        ]
      }
    ],
    overview: {
      totalChildren: 2,
      totalLessonsCompleted: 24,
      totalBadges: 12,
      totalLearningTime: '15h 30m',
      averageProgress: 82,
      thisWeekActivity: 8,
      thisMonthActivity: 24
    }
  };
};

export const getChildrenOverviewData = () => {
  return {
    children: [
      {
        id: 'child_001',
        name: 'Alice Uwimana',
        avatar: 'Girl',
        age: 9,
        grade: 'Class A',
        progress: 85,
        completedLessons: 12,
        totalLessons: 15,
        badges: 7,
        points: 450,
        lastActive: '2024-12-20',
        parent: 'Marie Uwimana',
        parentContact: '+250 788 123 456',
        strengths: ['Quick learner', 'Good at problem solving', 'Creative thinking'],
        areasForImprovement: ['Needs more practice with typing', 'Could help others more'],
        recentActivity: [
          {
            id: 'act_001',
            type: 'lesson_completed',
            title: 'Digital Citizenship Basics',
            timestamp: '2024-12-20T10:30:00Z',
            points: 25
          },
          {
            id: 'act_002',
            type: 'badge_earned',
            title: 'Digital Explorer Badge',
            timestamp: '2024-12-19T14:20:00Z',
            points: 50
          },
          {
            id: 'act_003',
            type: 'lesson_completed',
            title: 'Introduction to Block Coding',
            timestamp: '2024-12-19T09:15:00Z',
            points: 30
          }
        ]
      },
      {
        id: 'child_002',
        name: 'John Mukasa',
        avatar: 'Boy',
        age: 10,
        grade: 'Class B',
        progress: 78,
        completedLessons: 9,
        totalLessons: 12,
        badges: 5,
        points: 380,
        lastActive: '2024-12-19',
        parent: 'Marie Uwimana',
        parentContact: '+250 788 123 456',
        strengths: ['Creative thinking', 'Good at coding', 'Persistent'],
        areasForImprovement: ['Needs more focus on safety topics', 'Could be more organized'],
        recentActivity: [
          {
            id: 'act_004',
            type: 'lesson_completed',
            title: 'Safe Internet Browsing',
            timestamp: '2024-12-19T16:45:00Z',
            points: 35
          },
          {
            id: 'act_005',
            type: 'badge_earned',
            title: 'Safety First Badge',
            timestamp: '2024-12-18T11:30:00Z',
            points: 40
          }
        ]
      }
    ],
    overview: {
      totalChildren: 2,
      totalLessonsCompleted: 24,
      totalBadges: 12,
      totalLearningTime: '15h 30m',
      averageProgress: 82,
      thisWeekActivity: 8,
      thisMonthActivity: 24
    },
    recentActivity: [
      {
        id: 'activity_001',
        type: 'lesson_completed',
        childName: 'Alice',
        activity: 'completed Digital Citizenship Basics',
        timestamp: '2024-12-20T10:30:00Z',
        points: 25
      },
      {
        id: 'activity_002',
        type: 'badge_earned',
        childName: 'Alice',
        activity: 'earned Digital Explorer Badge',
        timestamp: '2024-12-19T14:20:00Z',
        points: 50
      },
      {
        id: 'activity_003',
        type: 'lesson_completed',
        childName: 'John',
        activity: 'completed Safe Internet Browsing',
        timestamp: '2024-12-19T16:45:00Z',
        points: 35
      },
      {
        id: 'activity_004',
        type: 'badge_earned',
        childName: 'John',
        activity: 'earned Safety First Badge',
        timestamp: '2024-12-18T11:30:00Z',
        points: 40
      }
    ]
  };
};

export const getProgressReportsData = () => {
  return {
    children: [
      {
        id: 'child_001',
        name: 'Alice Uwimana',
        avatar: 'Girl',
        grade: 'Class A',
        overallProgress: 85,
        subjects: [
          {
            name: 'Digital Literacy',
            progress: 90,
            lessonsCompleted: 6,
            totalLessons: 8,
            lastActivity: '2024-12-20',
            averageScore: 88
          },
          {
            name: 'Safe Browsing',
            progress: 85,
            lessonsCompleted: 4,
            totalLessons: 5,
            lastActivity: '2024-12-19',
            averageScore: 82
          },
          {
            name: 'Typing Skills',
            progress: 80,
            lessonsCompleted: 2,
            totalLessons: 3,
            lastActivity: '2024-12-18',
            averageScore: 75
          }
        ],
        weeklyProgress: [
          { week: 'Week 1', lessons: 2, time: '1h 30m' },
          { week: 'Week 2', lessons: 3, time: '2h 15m' },
          { week: 'Week 3', lessons: 4, time: '3h 00m' },
          { week: 'Week 4', lessons: 3, time: '2h 45m' }
        ],
        strengths: [
          'Excellent problem-solving skills',
          'Very creative and innovative',
          'Great at helping classmates'
        ],
        areasForImprovement: [
          'Needs more practice with typing speed',
          'Could be more patient with difficult concepts'
        ]
      },
      {
        id: 'child_002',
        name: 'John Mukasa',
        avatar: 'Boy',
        grade: 'Class B',
        overallProgress: 78,
        subjects: [
          {
            name: 'Digital Literacy',
            progress: 75,
            lessonsCompleted: 4,
            totalLessons: 6,
            lastActivity: '2024-12-19',
            averageScore: 80
          },
          {
            name: 'Safe Browsing',
            progress: 85,
            lessonsCompleted: 3,
            totalLessons: 4,
            lastActivity: '2024-12-18',
            averageScore: 88
          },
          {
            name: 'Block Coding',
            progress: 70,
            lessonsCompleted: 2,
            totalLessons: 3,
            lastActivity: '2024-12-17',
            averageScore: 72
          }
        ],
        weeklyProgress: [
          { week: 'Week 1', lessons: 1, time: '1h 00m' },
          { week: 'Week 2', lessons: 2, time: '1h 45m' },
          { week: 'Week 3', lessons: 3, time: '2h 30m' },
          { week: 'Week 4', lessons: 3, time: '2h 15m' }
        ],
        strengths: [
          'Very creative and artistic',
          'Good at logical thinking',
          'Persistent and determined'
        ],
        areasForImprovement: [
          'Needs more focus on safety topics',
          'Could be more organized with assignments'
        ]
      }
    ],
    summary: {
      totalChildren: 2,
      averageProgress: 82,
      totalLessonsCompleted: 24,
      totalLearningTime: '15h 30m'
    }
  };
};

export const getAchievementsData = () => {
  return {
    children: [
      {
        id: 'child_001',
        name: 'Alice Uwimana',
        avatar: 'Girl',
        grade: 'Class A',
        totalBadges: 7,
        recentBadges: [
          {
            id: 'badge_001',
            title: 'Digital Explorer',
            description: 'Completed 5 digital literacy lessons',
            icon: 'search',
            category: 'Digital Literacy',
            date: '2024-12-19',
            earned: true
          },
          {
            id: 'badge_002',
            title: 'Safety First',
            description: 'Mastered internet safety basics',
            icon: 'shield',
            category: 'Safety',
            date: '2024-12-18',
            earned: true
          },
          {
            id: 'badge_003',
            title: 'Code Master',
            description: 'Completed first coding project',
            icon: 'computer',
            category: 'Coding',
            date: '2024-12-17',
            earned: true
          }
        ],
        allBadges: [
          {
            id: 'badge_001',
            title: 'Digital Explorer',
            description: 'Completed 5 digital literacy lessons',
            icon: 'search',
            category: 'Digital Literacy',
            date: '2024-12-19',
            earned: true
          },
          {
            id: 'badge_002',
            title: 'Safety First',
            description: 'Mastered internet safety basics',
            icon: 'shield',
            category: 'Safety',
            date: '2024-12-18',
            earned: true
          },
          {
            id: 'badge_003',
            title: 'Code Master',
            description: 'Completed first coding project',
            icon: 'computer',
            category: 'Coding',
            date: '2024-12-17',
            earned: true
          },
          {
            id: 'badge_004',
            title: 'Quick Learner',
            description: 'Completed lessons ahead of schedule',
            icon: 'lightning',
            category: 'Consistency',
            date: '2024-12-16',
            earned: true
          },
          {
            id: 'badge_005',
            title: 'Helper',
            description: 'Helped 3 classmates with lessons',
            icon: 'handshake',
            category: 'Skill',
            date: '2024-12-15',
            earned: true
          },
          {
            id: 'badge_006',
            title: 'Perfect Score',
            description: 'Got 100% on 3 consecutive lessons',
            icon: 'target',
            category: 'Milestone',
            date: '2024-12-14',
            earned: true
          },
          {
            id: 'badge_007',
            title: 'Week Warrior',
            description: 'Completed lessons for 7 days straight',
            icon: 'calendar',
            category: 'Consistency',
            date: '2024-12-13',
            earned: true
          },
          {
            id: 'badge_008',
            title: 'Typing Speedster',
            description: 'Achieved 30 WPM typing speed',
            icon: 'computer',
            category: 'Skill',
            date: null,
            earned: false
          },
          {
            id: 'badge_009',
            title: 'Digital Citizen',
            description: 'Complete all digital citizenship lessons',
            icon: 'globe',
            category: 'Digital Literacy',
            date: null,
            earned: false
          }
        ]
      },
      {
        id: 'child_002',
        name: 'John Mukasa',
        avatar: 'Boy',
        grade: 'Class B',
        totalBadges: 5,
        recentBadges: [
          {
            id: 'badge_010',
            title: 'Safety First',
            description: 'Mastered internet safety basics',
            icon: 'shield',
            category: 'Safety',
            date: '2024-12-18',
            earned: true
          },
          {
            id: 'badge_011',
            title: 'Creative Coder',
            description: 'Created unique coding project',
            icon: 'palette',
            category: 'Coding',
            date: '2024-12-17',
            earned: true
          }
        ],
        allBadges: [
          {
            id: 'badge_010',
            title: 'Safety First',
            description: 'Mastered internet safety basics',
            icon: 'shield',
            category: 'Safety',
            date: '2024-12-18',
            earned: true
          },
          {
            id: 'badge_011',
            title: 'Creative Coder',
            description: 'Created unique coding project',
            icon: 'palette',
            category: 'Coding',
            date: '2024-12-17',
            earned: true
          },
          {
            id: 'badge_012',
            title: 'Problem Solver',
            description: 'Solved 10 coding challenges',
            icon: 'puzzle',
            category: 'Skill',
            date: '2024-12-16',
            earned: true
          },
          {
            id: 'badge_013',
            title: 'Team Player',
            description: 'Collaborated on group project',
            icon: 'users',
            category: 'Skill',
            date: '2024-12-15',
            earned: true
          },
          {
            id: 'badge_014',
            title: 'Consistent Learner',
            description: 'Completed lessons for 5 days straight',
            icon: 'book',
            category: 'Consistency',
            date: '2024-12-14',
            earned: true
          },
          {
            id: 'badge_015',
            title: 'Digital Artist',
            description: 'Create digital artwork',
            icon: 'palette',
            category: 'Skill',
            date: null,
            earned: false
          },
          {
            id: 'badge_016',
            title: 'Code Master',
            description: 'Complete advanced coding project',
            icon: 'computer',
            category: 'Coding',
            date: null,
            earned: false
          }
        ]
      }
    ],
    summary: {
      totalBadges: 12,
      recentBadges: 5,
      topCategory: 'Safety',
      mostActiveChild: 'Alice Uwimana'
    }
  };
};

export const getScheduleData = () => {
  return {
    children: [
      {
        id: 'child_001',
        name: 'Alice Uwimana',
        avatar: 'Girl',
        grade: 'Class A',
        schedule: [
          {
            id: 'sched_001',
            title: 'Digital Literacy - Lesson 6',
            subject: 'Digital Literacy',
            date: '2024-12-21',
            time: '10:00 AM',
            duration: '30 minutes',
            classroom: 'Room 101',
            status: 'scheduled',
            teacher: 'Sarah Mukamana'
          },
          {
            id: 'sched_002',
            title: 'Safe Browsing - Lesson 3',
            subject: 'Safe Browsing',
            date: '2024-12-23',
            time: '2:00 PM',
            duration: '25 minutes',
            classroom: 'Room 102',
            status: 'scheduled',
            teacher: 'Sarah Mukamana'
          }
        ]
      },
      {
        id: 'child_002',
        name: 'John Mukasa',
        avatar: 'Boy',
        grade: 'Class B',
        schedule: [
          {
            id: 'sched_003',
            title: 'Block Coding - Lesson 4',
            subject: 'Block Coding',
            date: '2024-12-22',
            time: '9:00 AM',
            duration: '35 minutes',
            classroom: 'Room 103',
            status: 'scheduled',
            teacher: 'Sarah Mukamana'
          },
          {
            id: 'sched_004',
            title: 'Digital Literacy - Lesson 5',
            subject: 'Digital Literacy',
            date: '2024-12-24',
            time: '11:00 AM',
            duration: '30 minutes',
            classroom: 'Room 101',
            status: 'scheduled',
            teacher: 'Sarah Mukamana'
          }
        ]
      }
    ],
    upcoming: [
      {
        id: 'upcoming_001',
        childName: 'Alice',
        title: 'Digital Literacy - Lesson 6',
        date: '2024-12-21',
        time: '10:00 AM',
        classroom: 'Room 101'
      },
      {
        id: 'upcoming_002',
        childName: 'John',
        title: 'Block Coding - Lesson 4',
        date: '2024-12-22',
        time: '9:00 AM',
        classroom: 'Room 103'
      },
      {
        id: 'upcoming_003',
        childName: 'Alice',
        title: 'Safe Browsing - Lesson 3',
        date: '2024-12-23',
        time: '2:00 PM',
        classroom: 'Room 102'
      }
    ],
    summary: {
      totalScheduled: 4,
      thisWeek: 4,
      nextWeek: 0,
      totalChildren: 2,
      totalHours: 120
    }
  };
};

export const getCommunicationData = () => {
  return {
    messages: [
      {
        id: 'msg_001',
        from: 'Sarah Mukamana',
        fromRole: 'Teacher',
        to: 'Marie Uwimana',
        toRole: 'Parent',
        subject: 'Alice\'s Excellent Progress',
        content: 'Dear Marie, I wanted to let you know that Alice has been doing exceptionally well in her digital literacy lessons. She has shown great creativity and problem-solving skills. Keep up the great work!',
        timestamp: '2024-12-20T14:30:00Z',
        read: false,
        priority: 'normal',
        attachments: []
      },
      {
        id: 'msg_002',
        from: 'DigLearners Admin',
        fromRole: 'Admin',
        to: 'Marie Uwimana',
        toRole: 'Parent',
        subject: 'Weekly Progress Report Available',
        content: 'Your weekly progress report for both Alice and John is now available. You can view it in the Reports section of your dashboard.',
        timestamp: '2024-12-19T09:00:00Z',
        read: true,
        priority: 'normal',
        attachments: []
      },
      {
        id: 'msg_003',
        from: 'Sarah Mukamana',
        fromRole: 'Teacher',
        to: 'Marie Uwimana',
        toRole: 'Parent',
        subject: 'John\'s Coding Project',
        content: 'John has created an amazing coding project! He showed great creativity and logical thinking. I\'ve attached some screenshots of his work.',
        timestamp: '2024-12-18T16:45:00Z',
        read: true,
        priority: 'high',
        attachments: [
          { name: 'john_coding_project_1.png', size: '2.3 MB' },
          { name: 'john_coding_project_2.png', size: '1.8 MB' }
        ]
      },
      {
        id: 'msg_004',
        from: 'DigLearners Admin',
        fromRole: 'Admin',
        to: 'Marie Uwimana',
        toRole: 'Parent',
        subject: 'New Learning Resources Available',
        content: 'We\'ve added new learning resources to help your children with their digital literacy journey. Check out the new interactive lessons!',
        timestamp: '2024-12-17T11:20:00Z',
        read: true,
        priority: 'normal',
        attachments: []
      }
    ],
    summary: {
      totalMessages: 4,
      unreadMessages: 1,
      fromTeachers: 2,
      fromAdmin: 2,
      thisWeek: 3
    }
  };
};

export const getReportsData = () => {
  return {
    children: [
      {
        id: 'child_001',
        name: 'Alice Uwimana',
        avatar: 'Girl',
        grade: 'Class A',
        reports: [
          {
            id: 'report_001',
            title: 'Weekly Progress Report',
            type: 'weekly',
            period: 'December 16-20, 2024',
            generatedDate: '2024-12-20',
            summary: {
              lessonsCompleted: 3,
              timeSpent: '2h 30m',
              averageScore: 88,
              badgesEarned: 2,
              progress: 85
            },
            details: {
              subjects: [
                { name: 'Digital Literacy', progress: 90, lessons: 2, score: 92 },
                { name: 'Safe Browsing', progress: 85, lessons: 1, score: 85 }
              ],
              achievements: [
                { title: 'Digital Explorer Badge', date: '2024-12-19' },
                { title: 'Safety First Badge', date: '2024-12-18' }
              ],
              recommendations: [
                'Continue with excellent progress',
                'Try the advanced typing exercises',
                'Consider helping classmates'
              ]
            }
          },
          {
            id: 'report_002',
            title: 'Monthly Progress Report',
            type: 'monthly',
            period: 'December 2024',
            generatedDate: '2024-12-01',
            summary: {
              lessonsCompleted: 12,
              timeSpent: '8h 45m',
              averageScore: 85,
              badgesEarned: 7,
              progress: 85
            }
          }
        ]
      },
      {
        id: 'child_002',
        name: 'John Mukasa',
        avatar: 'Boy',
        grade: 'Class B',
        reports: [
          {
            id: 'report_003',
            title: 'Weekly Progress Report',
            type: 'weekly',
            period: 'December 16-20, 2024',
            generatedDate: '2024-12-20',
            summary: {
              lessonsCompleted: 2,
              timeSpent: '1h 45m',
              averageScore: 82,
              badgesEarned: 1,
              progress: 78
            },
            details: {
              subjects: [
                { name: 'Safe Browsing', progress: 85, lessons: 1, score: 88 },
                { name: 'Block Coding', progress: 70, lessons: 1, score: 75 }
              ],
              achievements: [
                { title: 'Safety First Badge', date: '2024-12-18' }
              ],
              recommendations: [
                'Focus on coding fundamentals',
                'Practice internet safety more',
                'Try collaborative projects'
              ]
            }
          }
        ]
      }
    ],
    summary: {
      totalReports: 3,
      weeklyReports: 2,
      monthlyReports: 1,
      averageProgress: 82,
      totalLessonsCompleted: 15
    }
  };
};