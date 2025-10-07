// Teacher Dashboard Mock Data Service
// Comprehensive mock data for all teacher dashboard pages

export const getTeacherDashboardData = () => {
  return {
    teacher: {
      id: 'teacher_001',
      name: 'Sarah Mukamana',
      email: 'sarah.mukamana@diglearners.rw',
      phone: '+250 788 234 567',
      joinDate: '2024-01-10',
      subjects: ['Digital Literacy', 'Safe Browsing', 'Typing Skills'],
      totalStudents: 24,
      totalClasses: 3,
      totalLessons: 45,
      totalHours: '120h'
    },
    classes: [
      {
        id: 'class_001',
        name: 'Digital Literacy Class A',
        subject: 'Digital Literacy',
        grade: 'Class A',
        totalStudents: 12,
        activeStudents: 10,
        averageProgress: 78,
        nextLesson: '2024-12-21T10:00:00Z',
        schedule: 'Monday, Wednesday, Friday - 10:00 AM',
        classroom: 'Room 101'
      },
      {
        id: 'class_002',
        name: 'Safe Browsing Class B',
        subject: 'Safe Browsing',
        grade: 'Class B',
        totalStudents: 8,
        activeStudents: 7,
        averageProgress: 82,
        nextLesson: '2024-12-21T02:00 PM',
        schedule: 'Tuesday, Thursday - 2:00 PM',
        classroom: 'Room 102'
      },
      {
        id: 'class_003',
        name: 'Typing Skills Class C',
        subject: 'Typing Skills',
        grade: 'Class C',
        totalStudents: 4,
        activeStudents: 4,
        averageProgress: 85,
        nextLesson: '2024-12-22T09:00 AM',
        schedule: 'Monday, Wednesday - 9:00 AM',
        classroom: 'Room 103'
      }
    ],
    overview: {
      totalStudents: 24,
      activeStudents: 21,
      totalClasses: 3,
      totalLessons: 45,
      averageProgress: 82,
      thisWeekActivity: 15,
      thisMonthActivity: 45
    }
  };
};

export const getMyClassesData = () => {
  return {
    classes: [
      {
        id: 'class_001',
        name: 'Digital Literacy Class A',
        subject: 'Digital Literacy',
        grade: 'Class A',
        totalStudents: 12,
        activeStudents: 10,
        averageProgress: 78,
        nextLesson: '2024-12-21T10:00:00Z',
        schedule: 'Monday, Wednesday, Friday - 10:00 AM',
        classroom: 'Room 101',
        description: 'Introduction to digital literacy concepts and basic computer skills',
        students: [
          {
            id: 'student_001',
            name: 'Alice Uwimana',
            avatar: 'Girl',
            progress: 85,
            lastActive: '2024-12-20',
            assignments: 8,
            completed: 6
          },
          {
            id: 'student_002',
            name: 'John Mukasa',
            avatar: 'Boy',
            progress: 78,
            lastActive: '2024-12-19',
            assignments: 8,
            completed: 5
          },
          {
            id: 'student_003',
            name: 'Grace Niyonsaba',
            avatar: 'Girl',
            progress: 92,
            lastActive: '2024-12-20',
            assignments: 8,
            completed: 7
          }
        ]
      },
      {
        id: 'class_002',
        name: 'Safe Browsing Class B',
        subject: 'Safe Browsing',
        grade: 'Class B',
        totalStudents: 8,
        activeStudents: 7,
        averageProgress: 82,
        nextLesson: '2024-12-21T14:00:00Z',
        schedule: 'Tuesday, Thursday - 2:00 PM',
        classroom: 'Room 102',
        description: 'Learning about internet safety and responsible online behavior',
        students: [
          {
            id: 'student_004',
            name: 'Peter Nkurunziza',
            avatar: 'Boy',
            progress: 88,
            lastActive: '2024-12-19',
            assignments: 6,
            completed: 5
          },
          {
            id: 'student_005',
            name: 'Marie Uwimana',
            avatar: 'Girl',
            progress: 75,
            lastActive: '2024-12-18',
            assignments: 6,
            completed: 4
          }
        ]
      },
      {
        id: 'class_003',
        name: 'Typing Skills Class C',
        subject: 'Typing Skills',
        grade: 'Class C',
        totalStudents: 4,
        activeStudents: 4,
        averageProgress: 85,
        nextLesson: '2024-12-22T09:00:00Z',
        schedule: 'Monday, Wednesday - 9:00 AM',
        classroom: 'Room 103',
        description: 'Developing typing speed and accuracy for digital communication',
        students: [
          {
            id: 'student_006',
            name: 'David Nsengimana',
            avatar: 'Boy',
            progress: 90,
            lastActive: '2024-12-20',
            assignments: 4,
            completed: 4
          },
          {
            id: 'student_007',
            name: 'Claire Mukamana',
            avatar: 'Girl',
            progress: 80,
            lastActive: '2024-12-19',
            assignments: 4,
            completed: 3
          }
        ]
      }
    ],
    summary: {
      totalClasses: 3,
      totalStudents: 24,
      activeStudents: 21,
      averageProgress: 82,
      upcomingLessons: 3
    }
  };
};

export const getStudentsData = () => {
  return {
    students: [
      {
        id: 'student_001',
        name: 'Alice Uwimana',
        avatar: 'Girl',
        grade: 'Class A',
        class: 'Digital Literacy',
        progress: 85,
        lastActive: '2024-12-20',
        assignments: 8,
        completed: 6,
        badges: 7,
        points: 450,
        parent: 'Marie Uwimana',
        parentContact: '+250 788 123 456',
        strengths: ['Quick learner', 'Good at problem solving'],
        areasForImprovement: ['Needs more practice with typing'],
        recentActivity: [
          {
            id: 'act_001',
            type: 'lesson_completed',
            title: 'Digital Citizenship Basics',
            date: '2024-12-20',
            points: 25
          },
          {
            id: 'act_002',
            type: 'badge_earned',
            title: 'Digital Explorer Badge',
            date: '2024-12-19',
            points: 50
          }
        ]
      },
      {
        id: 'student_002',
        name: 'John Mukasa',
        avatar: 'Boy',
        grade: 'Class A',
        class: 'Digital Literacy',
        progress: 78,
        lastActive: '2024-12-19',
        assignments: 8,
        completed: 5,
        badges: 5,
        points: 380,
        parent: 'Paul Mukasa',
        parentContact: '+250 788 234 567',
        strengths: ['Creative thinking', 'Good at coding'],
        areasForImprovement: ['Needs more focus on safety topics'],
        recentActivity: [
          {
            id: 'act_003',
            type: 'lesson_completed',
            title: 'Introduction to Block Coding',
            date: '2024-12-19',
            points: 30
          }
        ]
      },
      {
        id: 'student_003',
        name: 'Grace Niyonsaba',
        avatar: 'Girl',
        grade: 'Class A',
        class: 'Digital Literacy',
        progress: 92,
        lastActive: '2024-12-20',
        assignments: 8,
        completed: 7,
        badges: 9,
        points: 520,
        parent: 'Jean Niyonsaba',
        parentContact: '+250 788 345 678',
        strengths: ['Excellent problem solving', 'Very organized'],
        areasForImprovement: ['Could help others more'],
        recentActivity: [
          {
            id: 'act_004',
            type: 'lesson_completed',
            title: 'Advanced Digital Skills',
            date: '2024-12-20',
            points: 40
          }
        ]
      }
    ],
    summary: {
      totalStudents: 24,
      activeStudents: 21,
      averageProgress: 82,
      topPerformer: 'Grace Niyonsaba',
      needsAttention: 3
    }
  };
};

export const getLessonsData = () => {
  return {
    lessons: [
      {
        id: 'lesson_001',
        title: 'Introduction to Digital Literacy',
        subject: 'Digital Literacy',
        grade: 'Class A',
        duration: '30 minutes',
        difficulty: 'Beginner',
        status: 'published',
        createdDate: '2024-12-15',
        lastModified: '2024-12-18',
        studentsCompleted: 8,
        totalStudents: 12,
        averageScore: 85,
        objectives: [
          'Understand basic digital concepts',
          'Learn computer navigation',
          'Practice safe online behavior'
        ],
        resources: [
          'Interactive presentation',
          'Practice exercises',
          'Assessment quiz'
        ]
      },
      {
        id: 'lesson_002',
        title: 'Safe Browsing Practices',
        subject: 'Safe Browsing',
        grade: 'Class B',
        duration: '25 minutes',
        difficulty: 'Intermediate',
        status: 'draft',
        createdDate: '2024-12-16',
        lastModified: '2024-12-19',
        studentsCompleted: 0,
        totalStudents: 8,
        averageScore: 0,
        objectives: [
          'Identify safe websites',
          'Recognize online threats',
          'Practice secure browsing'
        ],
        resources: [
          'Video tutorial',
          'Interactive scenarios',
          'Safety checklist'
        ]
      },
      {
        id: 'lesson_003',
        title: 'Touch Typing Fundamentals',
        subject: 'Typing Skills',
        grade: 'Class C',
        duration: '35 minutes',
        difficulty: 'Beginner',
        status: 'published',
        createdDate: '2024-12-14',
        lastModified: '2024-12-17',
        studentsCompleted: 4,
        totalStudents: 4,
        averageScore: 78,
        objectives: [
          'Learn proper finger placement',
          'Practice basic typing patterns',
          'Build typing speed'
        ],
        resources: [
          'Typing exercises',
          'Speed tests',
          'Progress tracking'
        ]
      }
    ],
    categories: [
      { name: 'Digital Literacy', count: 15, color: '#4CAF50' },
      { name: 'Safe Browsing', count: 12, color: '#2196F3' },
      { name: 'Typing Skills', count: 8, color: '#FF9800' },
      { name: 'Block Coding', count: 10, color: '#9C27B0' }
    ],
    summary: {
      totalLessons: 45,
      publishedLessons: 38,
      draftLessons: 7,
      averageCompletion: 82,
      mostPopular: 'Digital Literacy'
    }
  };
};

export const getAssignmentsData = () => {
  return {
    assignments: [
      {
        id: 'assign_001',
        title: 'Digital Citizenship Project',
        class: 'Digital Literacy Class A',
        subject: 'Digital Literacy',
        dueDate: '2024-12-25',
        status: 'active',
        totalStudents: 12,
        submitted: 8,
        graded: 6,
        averageScore: 85,
        description: 'Create a presentation about digital citizenship principles',
        instructions: [
          'Research digital citizenship concepts',
          'Create a 5-slide presentation',
          'Include examples of good digital behavior'
        ],
        submissions: [
          {
            studentName: 'Alice Uwimana',
            submittedDate: '2024-12-22',
            status: 'graded',
            score: 92,
            feedback: 'Excellent work! Great examples and clear presentation.'
          },
          {
            studentName: 'John Mukasa',
            submittedDate: '2024-12-23',
            status: 'submitted',
            score: null,
            feedback: null
          }
        ]
      },
      {
        id: 'assign_002',
        title: 'Internet Safety Poster',
        class: 'Safe Browsing Class B',
        subject: 'Safe Browsing',
        dueDate: '2024-12-28',
        status: 'active',
        totalStudents: 8,
        submitted: 3,
        graded: 2,
        averageScore: 78,
        description: 'Design a poster promoting internet safety',
        instructions: [
          'Include 5 safety tips',
          'Use clear, simple language',
          'Make it visually appealing'
        ],
        submissions: [
          {
            studentName: 'Peter Nkurunziza',
            submittedDate: '2024-12-21',
            status: 'graded',
            score: 85,
            feedback: 'Good design and clear safety tips. Well done!'
          }
        ]
      },
      {
        id: 'assign_003',
        title: 'Typing Speed Challenge',
        class: 'Typing Skills Class C',
        subject: 'Typing Skills',
        dueDate: '2024-12-30',
        status: 'upcoming',
        totalStudents: 4,
        submitted: 0,
        graded: 0,
        averageScore: 0,
        description: 'Complete typing exercises and achieve target speed',
        instructions: [
          'Practice daily for 15 minutes',
          'Aim for 30 WPM minimum',
          'Submit screenshot of final score'
        ],
        submissions: []
      }
    ],
    summary: {
      totalAssignments: 3,
      activeAssignments: 2,
      upcomingAssignments: 1,
      totalSubmissions: 11,
      pendingGrading: 5
    }
  };
};

export const getAnalyticsData = () => {
  return {
    overview: {
      totalStudents: 24,
      activeStudents: 21,
      totalLessons: 45,
      completedLessons: 38,
      averageProgress: 82,
      totalHours: 120
    },
    studentProgress: [
      {
        name: 'Alice Uwimana',
        progress: 85,
        lessonsCompleted: 12,
        timeSpent: '15h 30m',
        lastActive: '2024-12-20'
      },
      {
        name: 'John Mukasa',
        progress: 78,
        lessonsCompleted: 9,
        timeSpent: '12h 45m',
        lastActive: '2024-12-19'
      },
      {
        name: 'Grace Niyonsaba',
        progress: 92,
        lessonsCompleted: 15,
        timeSpent: '18h 20m',
        lastActive: '2024-12-20'
      }
    ],
    classPerformance: [
      {
        className: 'Digital Literacy Class A',
        averageProgress: 78,
        totalStudents: 12,
        activeStudents: 10,
        lessonsCompleted: 45,
        averageScore: 82
      },
      {
        className: 'Safe Browsing Class B',
        averageProgress: 82,
        totalStudents: 8,
        activeStudents: 7,
        lessonsCompleted: 32,
        averageScore: 85
      },
      {
        className: 'Typing Skills Class C',
        averageProgress: 85,
        totalStudents: 4,
        activeStudents: 4,
        lessonsCompleted: 18,
        averageScore: 88
      }
    ],
    weeklyActivity: [
      { week: 'Week 1', lessons: 8, students: 15, hours: 20 },
      { week: 'Week 2', lessons: 12, students: 18, hours: 28 },
      { week: 'Week 3', lessons: 15, students: 20, hours: 35 },
      { week: 'Week 4', lessons: 18, students: 21, hours: 42 }
    ],
    topPerformers: [
      {
        name: 'Grace Niyonsaba',
        class: 'Class A',
        progress: 92,
        badges: 9,
        points: 520
      },
      {
        name: 'Alice Uwimana',
        class: 'Class A',
        progress: 85,
        badges: 7,
        points: 450
      },
      {
        name: 'Peter Nkurunziza',
        class: 'Class B',
        progress: 88,
        badges: 6,
        points: 420
      }
    ],
    needsAttention: [
      {
        name: 'John Mukasa',
        class: 'Class A',
        issue: 'Low activity',
        lastActive: '2024-12-19',
        progress: 78
      },
      {
        name: 'Marie Uwimana',
        class: 'Class B',
        issue: 'Missing assignments',
        lastActive: '2024-12-18',
        progress: 75
      }
    ]
  };
};

export const getScheduleData = () => {
  return {
    schedule: [
      {
        id: 'sched_001',
        title: 'Digital Literacy - Lesson 5',
        class: 'Class A',
        subject: 'Digital Literacy',
        date: '2024-12-21',
        time: '10:00 AM',
        duration: '30 minutes',
        classroom: 'Room 101',
        status: 'scheduled',
        students: 12,
        objectives: [
          'Review digital citizenship concepts',
          'Practice online safety skills',
          'Complete interactive exercises'
        ]
      },
      {
        id: 'sched_002',
        title: 'Safe Browsing - Lesson 3',
        class: 'Class B',
        subject: 'Safe Browsing',
        date: '2024-12-21',
        time: '2:00 PM',
        duration: '25 minutes',
        classroom: 'Room 102',
        status: 'scheduled',
        students: 8,
        objectives: [
          'Learn about phishing scams',
          'Practice identifying safe websites',
          'Complete safety assessment'
        ]
      },
      {
        id: 'sched_003',
        title: 'Typing Skills - Lesson 2',
        class: 'Class C',
        subject: 'Typing Skills',
        date: '2024-12-22',
        time: '9:00 AM',
        duration: '35 minutes',
        classroom: 'Room 103',
        status: 'scheduled',
        students: 4,
        objectives: [
          'Practice home row keys',
          'Build typing speed',
          'Complete speed test'
        ]
      }
    ],
    upcoming: [
      {
        id: 'upcoming_001',
        title: 'Digital Literacy - Lesson 5',
        class: 'Class A',
        date: '2024-12-21',
        time: '10:00 AM',
        students: 12
      },
      {
        id: 'upcoming_002',
        title: 'Safe Browsing - Lesson 3',
        class: 'Class B',
        date: '2024-12-21',
        time: '2:00 PM',
        students: 8
      }
    ],
    summary: {
      totalScheduled: 3,
      thisWeek: 3,
      nextWeek: 0,
      totalStudents: 24,
      totalHours: 90
    }
  };
};
