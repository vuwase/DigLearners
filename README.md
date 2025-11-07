# DigLearners Platform

A comprehensive digital literacy platform designed specifically for Rwandan primary schools, implementing offline-first architecture with gamification and multilingual support.

## 🎯 Project Overview

DigLearners is a web-based platform that enhances foundational digital literacy in Rwandan primary schools through:

- **Offline-First Architecture**: Works seamlessly in low-bandwidth and rural areas
- **Gamification System**: Points, badges, levels, and leaderboards to motivate learning
- **Multilingual Support**: English and Kinyarwanda language options
- **Role-Based Access**: Interfaces for Learners and Teachers (Admins use the Teacher dashboard)
- **Child-Friendly Design**: Large touch targets, high contrast, and accessibility features
- **Research Analytics**: Comprehensive data collection for educational research

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing for SPA navigation
- **Context API**: State management for authentication and themes
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **PWA**: Progressive Web App capabilities for offline functionality

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web framework for RESTful API development
- **SQLite**: Lightweight database for development and testing
- **Sequelize ORM**: Database modeling and query management
- **JWT**: JSON Web Tokens for secure authentication
- **bcrypt**: Password hashing and security

### Development Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Git**: Version control system
- **Docker**: Containerization for deployment
- **npm**: Package management

## Architecture

The platform follows a three-tier architecture as defined in the UML diagrams:

### Backend (Node.js + Express + SQLite)
```
backend/
├── api/                 # API routes
│   ├── auth.js         # Authentication endpoints
│   ├── content.js      # Content management
│   ├── learning.js     # Learning activities
│   ├── teacher.js      # Teacher-specific endpoints
│   └── gamified.js     # Gamified content management
├── models/             # Database models (ERD implementation)
│   ├── User.js         # User model
│   ├── LearningClass.js # Class model
│   ├── Lesson.js       # Lesson model
│   ├── Progress.js     # Progress tracking
│   ├── Badge.js        # Gamification badges
│   ├── UserBadge.js    # User-badge relationships
│   └── GamifiedContent.js # Gamified learning content
├── middleware/          # Authentication & authorization
├── services/           # Business logic
└── utils/             # Utility functions
```

### Frontend (React + PWA)
```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── common/     # Shared components
│   │   ├── forms/      # Form components
│   │   └── layout/     # Layout components
│   ├── pages/          # Role-based pages
│   │   ├── admin/      # Deprecated: Admin UI merged into teacher dashboard
│   │   ├── teacher/    # Teacher interface
│   │   ├── learner/    # Student interface
│   │   ├── auth/       # Authentication pages
│   │   └── public/     # Public pages
│   ├── contexts/       # React contexts
│   ├── services/       # API services
│   ├── hooks/          # Custom hooks
│   └── utils/          # Utility functions
```

## Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/diglearners/diglearners-platform.git
   cd diglearners-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend API server on http://localhost:5000
- Frontend development server on http://localhost:3000

### Test Login Credentials

- Teacher/Admin access (Teacher UI with admin features if role=admin):
  - Email: `testteacher@diglearners.com`
  - Password: `password123`

- Student access:
  - Obtain a registration code from a teacher via `Dashboard → Register Student`
  - Login at `/login?type=student` with: Full name, Grade, Registration Code

### Default Login Credentials

Admins log in via the Teacher login and use the Teacher dashboard.

| Role | Email | Password | Access Notes |
|------|-------|----------|--------------|
| **Teacher/Admin** | `testteacher@diglearners.com` | `password123` | Admins have elevated permissions within the teacher dashboard |
| **Teacher** | (create additional via admin tools) |  |  |
| **Student** | Use registration code | N/A | Student login via name, grade, registration code |

**Note**: Demo credentials are for development/testing. Replace in production.

### Production Build

```bash
npm run build
npm start
```

## Database Schema

The platform implements the Entity-Relationship Diagram (ERD) with the following entities:

### Core Entities
- **User**: Users with roles (Admin, Teacher, Learner)
- **LearningClass**: Classes managed by teachers
- **Lesson**: Educational content modules
- **Progress**: User progress tracking
- **Badge**: Gamification achievements
- **UserBadge**: User-badge relationships
- **GamifiedContent**: Grade and age-specific gamified learning content

### Relationships
- User ↔ LearningClass (Teacher-Class)
- User ↔ Progress (User-Progress)
- Lesson ↔ Progress (Lesson-Progress)
- User ↔ Badge (Many-to-Many via UserBadge)
- LearningClass ↔ Lesson (Many-to-Many via ClassLesson)

## Gamification System

### Levels
1. **Explorer** (0-99 points)
2. **Adventurer** (100-299 points)
3. **Pathfinder** (300-599 points)
4. **Innovator** (600-999 points)
5. **Mastermind** (1000-1499 points)
6. **Digital Guru** (1500+ points)

### Badge Categories
- **Achievement**: Lesson completion badges
- **Milestone**: Progress milestone badges
- **Special**: Unique accomplishment badges
- **Weekly**: Weekly activity badges
- **Monthly**: Monthly achievement badges

### Points System
- Lesson completion: 10-50 points
- Perfect scores: +25 bonus points
- Daily streaks: +5 points per day
- Badge earning: 10-100 points per badge

## Multilingual Support

### Supported Languages
- **English** (en): Primary language
- **Kinyarwanda** (rw): Local language support

### Translation Coverage
- Navigation and UI elements
- Lesson content and instructions
- Error messages and notifications
- Accessibility features
- Research dashboard

## Role-Based Access Control

### Learner Interface
- Age group selection for personalized content
- Access to grade-specific gamified games and activities
- Interactive puzzle games and learning modules
- Progress tracking with points and badges
- Simplified, game-focused dashboard
- Achievement collection and rewards system

### Teacher Interface
- Class management and student oversight
- Student registration and profile management
- Lesson assignment and progress monitoring
- Gamified content creation and management
- Interactive puzzle and assignment creation
- Analytics and reporting tools
- Grade-based content targeting

### Admin Interface
Admin UI has been removed. Admin capabilities (user/content management, analytics, settings) are now accessible within the Teacher dashboard for users with the `admin` role.

## PWA Features

### Offline-First Architecture
- Service Worker for caching
- IndexedDB for local storage
- Background sync for data synchronization
- Offline lesson access
- Progress tracking offline

### Mobile Optimization
- Responsive design for all devices
- Touch-friendly interface
- Large buttons and text
- High contrast mode
- Accessibility features

## 🎮 Recent Features & Improvements

### Enhanced Teacher Dashboard
- **Modern UI Design**: Beautiful gradient backgrounds with interactive cards
- **Student Registration**: Teachers can register students with grade and age targeting
- **Gamified Content Creation**: Create interactive games and puzzles for specific grades
- **Assignment Management**: Create, track, and grade assignments with due dates
- **Student Profile Management**: Edit student grades and personal information
- **Progress Analytics**: Comprehensive student progress monitoring

### Streamlined Student Experience
- **Game-Focused Dashboard**: Simplified interface showing game cards directly
- **Age Group Selection**: Personalized content based on age group selection
- **Grade-Specific Content**: Automatic filtering of games based on student's grade
- **Interactive Games**: Puzzle games, quizzes, and interactive learning modules
- **Reward System**: Points and badges for completed activities
- **Mobile-Optimized**: Touch-friendly interface for tablets and mobile devices

### System Improvements
- **Enhanced Authentication**: Secure JWT-based authentication with role verification
- **Error Handling**: Robust error handling with user-friendly messages
- **Loading States**: Smooth loading indicators and empty state handling
- **Responsive Design**: Mobile-first design approach for all screen sizes
- **API Optimization**: Improved API performance and error handling

## 🔬 Research Analytics

### Data Collection
- User engagement metrics
- Learning progress tracking
- Accessibility feature usage
- Language preference patterns
- Offline/online usage patterns
- Grade-specific content effectiveness
- Gamification impact analysis

### Export Capabilities
- JSON data export
- CSV report generation
- Real-time analytics dashboard
- Research-specific metrics
- Student progress reports
- Teacher performance analytics

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm test            # Run tests
npm run lint        # Lint code
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm test           # Run tests
npm run lint       # Lint code
```

### Database Management
```bash
cd backend
npm run seed       # Seed initial data
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Content Management
- `GET /api/content/lessons` - Get all lessons
- `GET /api/content/lessons/:id` - Get lesson by ID
- `POST /api/content/lessons` - Create lesson (Teacher/Admin)
- `PUT /api/content/lessons/:id` - Update lesson (Teacher/Admin)

### Gamified Content
- `GET /api/gamified/my-content` - Get user's grade-specific content
- `GET /api/gamified/age-group/:ageGroup` - Get content by age group
- `GET /api/gamified/grade/:grade` - Get content by grade
- `POST /api/gamified/create` - Create gamified content (Teacher/Admin)

### Teacher Management (includes Admin capabilities)
- `GET /api/teacher/dashboard` - Get teacher dashboard data
- `POST /api/teacher/register-student` - Register new student (generates code)
- `GET /api/teacher/my-students` - Get all students for the teacher
- `PUT /api/teacher/students/:id` - Update student profile
- `GET /api/teacher/assignments` - Get assignments
- `POST /api/teacher/assignments` - Create assignment

### Learning Activities
- `GET /api/learning/lessons` - Get available lessons
- `POST /api/learning/lessons/:id/progress` - Record progress
- `GET /api/learning/progress` - Get user progress
- `GET /api/learning/badges` - Get user badges

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

## Deployment

### Docker Deployment
```bash
npm run docker:build
npm run docker:up
```

### Manual Deployment
1. Build the application: `npm run build`
2. Deploy backend to your server
3. Deploy frontend to your web server
4. Configure environment variables
5. Set up database

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Support

For support and questions:
- Email: support@diglearners.rw
- GitHub Issues: [Create an issue](https://github.com/diglearners/diglearners-platform/issues)

## 🙏 Acknowledgments

- Rwandan Ministry of Education
- Primary school teachers and students who provided valuable feedback
- Digital literacy research community
- Open source contributors and the React/Node.js communities
- Educational technology researchers focusing on gamification
- Accessibility advocates for inclusive design principles

---

**DigLearners Platform** - Empowering digital literacy in Rwandan primary schools through innovative technology and research-driven design.

### link to the video

<https://vimeo.com/1134723660/6fd0f52163>
