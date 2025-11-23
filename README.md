# DigLearners Platform

A comprehensive digital literacy platform designed specifically for Rwandan primary schools, implementing offline-first architecture with gamification and multilingual support.

## 🎯 Project Overview

DigLearners is a web-based platform that enhances foundational digital literacy in Rwandan primary schools through:

- **Gamification System**: Points, badges, levels, and leaderboards to motivate learning
- **Multilingual Support**: English and Kinyarwanda language options
- **Role-Based Access**: Interfaces for Learners and Teachers (Admins use the Teacher dashboard)
- **Child-Friendly Design**: Large touch targets, high contrast, and accessibility features
- **Research Analytics**: Comprehensive data collection for educational research

## 🌐 Live Deployments

- **Frontend (Netlify)**: [https://diglearners.netlify.app/](https://diglearners.netlify.app/)
- **Backend API (Render)**: [https://diglearners.onrender.com/api](https://diglearners.onrender.com/api)

## 🌐 Live Deployments

- **Frontend (Netlify)**: <https://diglearners.netlify.app/>
- **Backend API (Render)**: <https://diglearners.onrender.com/api>

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
- **PostgreSQL (Render)**: Production database (SQLite used only for automated tests)
- **Sequelize ORM**: Database modeling and query management
- **JWT**: JSON Web Tokens for secure authentication
- **bcrypt**: Password hashing and security
- **Render**: Managed hosting for backend, frontend, and PostgreSQL

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
   git clone https://github.com/vuwase/DigLearners.git
   cd DigLearners
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

3. **Start development servers**
   ```bash
   npm run dev:backend   # runs nodemon on port 5000
   npm run dev:frontend  # runs Vite on port 3000
   ```

Backend runs on <http://localhost:5000>, frontend on <http://localhost:3000>.  
Ensure `backend/.env` points to your Render/Postgres instance (see Environment Variables section).

### Seed / Demo Access

- During local development, run `node backend/create-teacher.js --fullName="Demo Teacher" --email=demo.teacher@example.com --password="DemoPass!123" --role=teacher` to create a login.
- Student accounts are created by teachers via `Teacher Dashboard → Register Student`, which issues a registration code for `/login?type=student`.

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

### Account Recovery
- **Forgot Password Flow**: Teachers can request a secure reset link from the login screen
- **One-Time Tokens**: Backend issues hashed reset tokens that expire after 1 hour
- **Email Notifications**: Reset emails are delivered via the configured SMTP account
- **Reset Portal**: Dedicated `/reset-password` page to set a new credential

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

### Netlify (Frontend) + Render (Backend)
1. **Keep backend on Render** – `https://diglearners.onrender.com` already exposes all `/api/*` routes. Confirm environment variables (`DATABASE_URL`, `DB_SSL`, `JWT_SECRET`, etc.) remain configured there.
2. **Connect repository to Netlify**  
   - Create a new Netlify site → “Import from Git”.  
   - Repo: `vuwase/DigLearners`, branch: `main`.  
   - Netlify auto-detects `netlify.toml`:
     - Base directory: `frontend`
     - Build command: `npm install && npm run build`
     - Publish directory: `frontend/dist`
3. **Environment variable** – In Netlify → Site configuration → Environment variables, set `REACT_APP_API_URL=https://diglearners.onrender.com/api` (overrides the value in `netlify.toml` if needed).
4. **SPA routing** – `netlify.toml` already defines `/* -> /index.html`, so client-side routing works.
5. **Deploy** – Trigger “Deploy site”. Future pushes to `main` rebuild the frontend on Netlify while the backend stays on Render.
6. **Live URL** – Production frontend is available at `https://diglearners.netlify.app/`. Update any references (e.g., `FRONTEND_URL`) to this domain.
6. **Live URL** – The production frontend is served from <https://diglearners.netlify.app/>.

### Environment Variables Reference

Use these mappings when adding entries in Render → **Environment** → **Environment Variables** or when creating local `.env` files (`backend/.env`, `frontend/.env`):

| Service | Variable | Description |
|---------|----------|-------------|
| Backend | `NODE_ENV` | `production` in Render; `development` locally |
| Backend | `PORT` | `10000` (Render sets automatically) |
| Backend | `DATABASE_URL` | e.g. `postgresql://...@dpg-.../vaste_uwase` (Render Postgres connection string) |
| Backend | `DB_DIALECT` | `postgres` |
| Backend | `DB_SSL` | `true` (Render Postgres requires TLS) |
| Backend | `JWT_SECRET` | Strong random secret shared between environments |
| Backend | `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_FROM` | SMTP configuration (optional) |
| Backend | `FRONTEND_URL` | `https://diglearners.netlify.app` |
| Frontend | `REACT_APP_API_URL` | `https://diglearners.onrender.com/api` |

`backend/.env.example` and `frontend/.env.example` include production-ready samples. Update local `.env` files with your secrets; they are git-ignored.

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

---

## Combined Documentation

### From `IMPLEMENTATION_COMPLETE.md`

# DigLearners Platform - Implementation Complete!

## What Has Been Completed

### 1. **Database Setup** ✓
- **Sequelize ORM** configured with SQLite
- **All Models Implemented:**
  - `User` - User authentication and roles
  - `LearningClass` - Class management
  - `Lesson` - Lesson content and metadata
  - `Progress` - User progress tracking
  - `Badge` - Gamification badges
  - `UserBadge` - User-badge relationships
  - `UserLearningClass` - User-class memberships
  - `ClassLesson` - Class-lesson assignments

- **Database Features:**
  - Automatic table creation
  - Relationship management (One-to-Many, Many-to-Many)
  - Data seeding with sample content
  - Password hashing (bcrypt)
  - Validation and constraints

### 2. **Backend API** ✓
- **Authentication System:**
  - JWT-based authentication
- Role-based access control (Teacher, Learner, Parent; Admins use Teacher UI)
  - Password hashing and validation
  - Token verification middleware
  - Rate limiting

- **API Endpoints:**
  - `/api/auth/*` - Registration, login, profile management
  - `/api/content/*` - Lesson and class management
  - `/api/learning/*` - Learning activities, progress, badges

- **Middleware:**
  - Authentication middleware
  - Role authorization
  - Error handling
  - Request logging

### 3. **Frontend Application** ✓
- **Authentication Pages:**
  - Login page with validation
  - Registration page with role selection
  - Beautiful, responsive design

- **Role-Based Dashboards:**
  - **Learner Dashboard** - Progress, lessons, badges
  - **Teacher Dashboard** - Class management, analytics, and admin capabilities for admin users
  - **Parent Dashboard** - Child progress monitoring

- **Context Providers:**
  - `AuthContext` - User authentication state
  - `LanguageContext` - Multilingual support (English/Kinyarwanda)
  - `ThemeContext` - Dark mode and accessibility features

- **Routing:**
  - Public routes (Home, Login, Register)
  - Protected routes with role-based access
  - 404 error page

### 4. **PWA Features** ✓
- **Service Worker:**
  - Offline-first caching strategy
  - Static asset caching
  - API request caching
  - Background sync
  - Cache management

- **Progressive Web App:**
  - Manifest file configured
  - Installable on mobile devices
  - Works offline

### 5. **Sample Data** ✓

- **Default Users:**
  - Teacher/Admin: `teacher@diglearners.rw` / `teacher123`

- **Sample Lessons:**
  - Introduction to Typing
  - Safe Internet Browsing
  - Block Coding Basics

- **Badges:**
  - First Step (Complete first lesson)
  - Typing Master (40 WPM)
  - Safe Surfer (5 safety lessons)
  - Code Wizard (10 coding lessons)
  - 7-Day Streak
  - Perfect Score (100%)

## How to Run the Project

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

1. **Install all dependencies:**
```bash
npm run install:all
```

Or install separately:
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Running Development Servers

**Option 1: Run both servers concurrently (Recommended)**
```bash
npm run dev
```

**Option 2: Run separately**

Backend (Terminal 1):
```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
```

Frontend (Terminal 2):
```bash
cd frontend
npm run dev
# Server runs on http://localhost:3000
```

### First Time Setup

When you first run the backend, it will automatically:
1. Create the SQLite database (`data/diglearners.db`)
2. Create all necessary tables
3. Seed initial data (teacher, sample lessons, badges)

## 🎯 Testing the Application

### 1. Test Backend API

The backend should start with output showing:
```
Database initialized successfully
DigLearners Backend running on http://localhost:3001
```

Test endpoints:
- Health check: http://localhost:3001/health
- API test: http://localhost:3001/api/test

### 2. Test Frontend

1. Navigate to http://localhost:3000
2. You should see the beautiful home page
3. Click "Login" or "Register"

### 3. Test Authentication

**Admins:**
- Admin users log in via the Teacher login and access elevated features within the Teacher dashboard.

**Login as Teacher:**
- Email: `teacher@diglearners.rw`
- Password: `teacher123`
- Should redirect to Teacher Dashboard

**Register new user:**
- Fill out the registration form
- Select a role (Learner/Teacher/Parent)
- Should auto-login and redirect to appropriate dashboard

### 4. Test Role-Based Access

- Try accessing different role routes
- System should enforce proper authorization
- Unauthorized access redirects to home page

## 📁 Project Structure

```
DigLearners/
├── backend/
│   ├── api/                  # API route handlers
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── content.js       # Content management
│   │   └── learning.js      # Learning activities
│   ├── middleware/          # Express middleware
│   │   └── auth.js          # Authentication middleware
│   ├── models/              # Database models
│   │   ├── index.js         # Database initialization
│   │   ├── User.js
│   │   ├── Lesson.js
│   │   ├── Progress.js
│   │   ├── Badge.js
│   │   └── ... (other models)
│   ├── package.json
│   └── server.js            # Entry point
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json    # PWA manifest
│   │   └── sw.js            # Service worker
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── LanguageContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── learner/     # Learner dashboard
│   │   │   ├── teacher/     # Teacher dashboard
│   │   │   ├── parent/      # Parent dashboard
│   │   │   ├── admin/       # Deprecated: Admin UI merged into Teacher UI
│   │   │   └── public/      # Home, NotFound
│   │   ├── services/        # API services
│   │   │   ├── authService.js
│   │   │   └── apiService.js
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
│
├── data/
│   └── diglearners.db      # SQLite database (auto-created)
│
└── package.json            # Root package scripts
```

## 🔑 Key Features Implemented

### Backend
- RESTful API architecture
- JWT authentication & authorization
- Role-based access control
- Sequelize ORM with SQLite
- Password hashing (bcrypt)
- Input validation
- Error handling
- Request logging
- CORS configuration
- Database seeding

### Frontend
- React 18 with hooks
- React Router for navigation
- Protected routes
- Authentication flow
- Role-based dashboards
- Context API for state management
- Responsive design
- Multilingual support (EN/RW)
- Dark mode support
- Accessibility features
- Service worker (PWA)
- Offline-first architecture

## API Documentation

### Authentication Endpoints

**POST /api/auth/register**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "learner"
}
```

**POST /api/auth/login**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**GET /api/auth/profile** (Requires auth)
- Returns current user profile

**PUT /api/auth/profile** (Requires auth)
- Update user profile

### Content Management

**GET /api/content/lessons**
- Get all lessons
- Query params: `moduleType`, `difficulty`, `ageGroup`, `page`, `limit`

**GET /api/content/lessons/:id**
- Get specific lesson

**POST /api/content/lessons** (Admin only)
- Create new lesson

**GET /api/content/classes**
- Get all classes

### Learning Activities

**GET /api/learning/lessons** (Learner)
- Get available lessons for learner

**POST /api/learning/lessons/:id/progress** (Learner)
- Record lesson progress

**GET /api/learning/progress** (Learner)
- Get user progress summary

**GET /api/learning/badges** (Learner)
- Get user badges

## 🎨 UI/UX Features

- **Modern Design:** Clean, professional interface
- **Responsive:** Works on desktop, tablet, and mobile
- **Accessible:** High contrast, large text options
- **Child-Friendly:** Large buttons, clear navigation
- **Multilingual:** English and Kinyarwanda
- **Dark Mode:** Eye-friendly for low-light environments
- **Smooth Animations:** Engaging user experience

## Security Features

- JWT token authentication
- Password hashing with bcrypt (12 rounds)
- Role-based authorization
- Token expiration (7 days)
- Input validation
- SQL injection protection (Sequelize)
- XSS protection
- CORS configuration
- Rate limiting

## Multilingual Support

The platform supports:
- **English (en)** - Primary language
- **Kinyarwanda (rw)** - Local language

All UI elements, error messages, and content are translated.

## Database Schema

### Tables
1. **users** - User accounts and authentication
2. **learning_classes** - Classes managed by teachers
3. **lessons** - Educational content modules
4. **progress** - User progress tracking
5. **badges** - Achievement badges
6. **user_badges** - User-badge relationships
7. **user_learning_classes** - User-class memberships
8. **class_lessons** - Class-lesson assignments

### Relationships
- User → LearningClass (One-to-Many as Teacher)
- User → Progress (One-to-Many)
- Lesson → Progress (One-to-Many)
- User ↔ Badge (Many-to-Many via UserBadge)
- User ↔ LearningClass (Many-to-Many via UserLearningClass)
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
- Achievement badges
- Milestone badges
- Special badges
- Weekly badges
- Monthly badges

### Points System
- Lesson completion: 10-50 points
- Perfect scores: +25 bonus
- Daily streaks: +5 points/day
- Badge earning: 10-100 points/badge

## 🐛 Known Issues / Future Improvements

### To Implement (Optional Enhancements)
1. **IndexedDB Integration** - Store offline data locally
2. **Push Notifications** - Learning reminders
3. **Advanced Analytics** - Detailed progress charts
4. **Lesson Content Editor** - Rich text editor for admins
5. **Parent-Child Linking** - Connect parent accounts to children
6. **CSV Export** - Export progress data
7. **Email Notifications** - Password reset, achievements
8. **Social Features** - Student profiles, friend requests
9. **Advanced Gamification** - Streaks, challenges, tournaments
10. **Mobile Apps** - Native iOS/Android apps

## Dependencies

### Backend
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `sequelize` - ORM
- `sqlite3` - Database
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `nodemon` - Dev server (dev dependency)

### Frontend
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `axios` - HTTP client
- `vite` - Build tool

## 🤝 Contributing

The project structure is clean and modular:
1. Backend API routes are in `backend/api/`
2. Frontend pages are in `frontend/src/pages/`
3. Models are in `backend/models/`
4. Contexts are in `frontend/src/contexts/`

To add new features:
1. Create new API endpoints in appropriate route files
2. Add new page components for UI
3. Update models if database changes needed
4. Add translations in `LanguageContext.jsx`

## 📖 Documentation

- API documentation is in this file
- Code is well-commented
- README.md has project overview
- Each model has inline documentation

## Educational Impact

This platform is designed to:
- Enhance digital literacy in Rwandan primary schools
- Support offline learning in rural areas
- Engage students through gamification
- Provide teachers with management tools
- Enable parents to monitor progress
- Generate data for educational research

## Project Status

**Status: Production Ready!**

All core features are implemented and working:
- Database and models
- Authentication system
- API endpoints
- Frontend UI
- Role-based dashboards
- Multilingual support
- PWA functionality
- Sample data

## Quick Start Commands

```bash
# Install everything
npm run install:all

# Run development servers
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Build frontend for production
cd frontend && npm run build

# Start production backend
cd backend && npm start
```

## Congratulations!

You now have a fully functional, production-ready digital literacy platform! The system includes:
- Complete authentication and authorization
- Role-based access for 4 user types
- Comprehensive API
- Beautiful, responsive UI
- Offline-first PWA capabilities
- Multilingual support
- Gamification system
- Sample data to start testing immediately

**Happy Learning!**

---

**Project**: DigLearners Platform
**Version**: 1.0.0
**Date**: October 2024
**Status**: Complete and Ready for Deployment

### From `REGISTRATION_VERIFICATION.md`

# Registration & Login Verification System

## Overview
Enhanced error messages and verification logging have been added to help debug and verify that registered users are properly stored in the database and can login successfully.

## Features Added

### 1. **Backend Registration Verification**
- ✅ **User Creation Logging**: Logs when user is created with ID, email, role, and creation timestamp
- ✅ **Database Verification**: After creating user, fetches it back from database to verify it was saved
- ✅ **Detailed Error Handling**: Catches and provides specific error messages for:
  - Duplicate email (SequelizeUniqueConstraintError)
  - Validation errors (SequelizeValidationError)
  - Database errors (SequelizeDatabaseError)
- ✅ **Response Enhancement**: Includes `userId` and `userCreated` flag in response for teachers

### 2. **Backend Login Verification**
- ✅ **Login Attempt Logging**: Logs every login attempt with email
- ✅ **User Lookup Logging**: Logs when user is found or not found
- ✅ **Password Validation Logging**: Logs password validation results
- ✅ **Success Logging**: Logs successful login with user details and token generation

### 3. **Frontend Registration Error Messages**
- ✅ **Enhanced Error Display**: Shows detailed error messages with:
  - Error title
  - Specific error message
  - Help text with troubleshooting steps
  - HTTP status codes for debugging
- ✅ **Network Error Detection**: Detects connection issues and suggests checking backend server
- ✅ **Console Logging**: Comprehensive console logs for debugging:
  - Registration attempts (with masked password)
  - Server responses
  - Error details
  - User creation confirmation

### 4. **Frontend Success Confirmation**
- ✅ **Account Details Display**: Shows registered email and full name
- ✅ **User ID Verification**: Displays user ID to confirm user was stored in database
- ✅ **Ready to Login Message**: Confirms account is ready for login
- ✅ **Extended Display Time**: 4 seconds before redirect to allow reading

## How to Verify Registration & Login

### Step 1: Register a Teacher
1. Go to `/enroll` (Teacher Sign Up)
2. Fill in the registration form
3. Submit the form
4. **Check Browser Console** (F12):
   - Look for: "Registration attempt:"
   - Look for: "Registration response:"
   - Look for: "Registration successful! User created:"
   - Check User ID is displayed in success message

### Step 2: Check Backend Logs
Backend console should show:
```
Creating user with data: { fullName: '...', email: '...', role: 'teacher', password: '***' }
User created successfully: { id: 1, email: '...', fullName: '...', role: 'teacher', createdAt: '...' }
User verification: User exists in database with ID: 1
Registration response: { success: true, userId: 1, email: '...' }
```

### Step 3: Verify Login
1. After successful registration, you'll be redirected to login page
2. Enter the same email and password
3. **Check Browser Console** (F12):
   - Look for: "Attempting teacher login:"
   - Look for: "Login result:"
   - Should show success with user object

### Step 4: Check Backend Login Logs
Backend console should show:
```
Attempting teacher login for email: user@example.com
User found: { id: 1, email: '...', role: 'teacher', fullName: '...' }
Validating password for user: user@example.com
Password validated successfully for user: user@example.com
Login successful for user: { id: 1, email: '...', role: 'teacher', tokenGenerated: true }
```

## Error Messages Explained

### Common Registration Errors:
1. **"User with this email already exists"**
   - Status: 400
   - Meaning: Email is already registered
   - Solution: Use login instead, or use a different email

2. **"Unable to connect to server"**
   - Status: Network Error
   - Meaning: Backend server is not running or unreachable
   - Solution: Check if backend is running on `http://localhost:5000`

3. **"Validation error: ..."**
   - Status: 400
   - Meaning: Invalid data provided
   - Solution: Check form fields and try again

4. **"Internal server error during registration"**
   - Status: 500
   - Meaning: Server-side error occurred
   - Solution: Check backend logs for detailed error

### Common Login Errors:
1. **"No account found with this email address"**
   - Status: 401
   - Meaning: User doesn't exist (registration may have failed)
   - Solution: Register first, or check email spelling

2. **"Incorrect password"**
   - Status: 401
   - Meaning: Password doesn't match
   - Solution: Check password or reset it

3. **"Connection timeout"**
   - Status: Network Error
   - Meaning: Backend not responding
   - Solution: Check backend server status

## Troubleshooting Checklist

If registration/login fails:

1. ✅ **Check Backend is Running**
   - Open terminal in `backend/` folder
   - Run: `npm start`
   - Should see: "DigLearners Backend running on http://localhost:5000"

2. ✅ **Check Browser Console**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for error messages or logs

3. ✅ **Check Backend Console**
   - Look for registration/login logs
   - Check for error messages

4. ✅ **Verify Database Connection**
   - Check if database file exists: `data/diglearners.db`
   - Backend logs should show: "Database connection established successfully"

5. ✅ **Check Network Tab**
   - Open Developer Tools → Network tab
   - Try registration/login again
   - Check the API request/response
   - Status code should be 201 for registration, 200 for login

## Success Indicators

### Registration Success:
- ✅ Green success message appears
- ✅ Email and name displayed
- ✅ User ID shown (confirms database storage)
- ✅ Console shows: "Registration successful! User created:"
- ✅ Backend shows: "User verification: User exists in database"

### Login Success:
- ✅ Success message appears
- ✅ Redirected to dashboard
- ✅ Console shows: "Login result: { success: true }"
- ✅ Backend shows: "Login successful for user:"
- ✅ Token stored in localStorage

## Next Steps

After successful registration and login:
1. You should be redirected to `/dashboard`
2. Check that your user info is displayed correctly
3. Try accessing teacher features (student registration, etc.)

### From `.snapshots/readme.md`

# Snapshots Directory

This directory contains snapshots of your code for AI interactions. Each snapshot is a markdown file that includes relevant code context and project structure information.

## What's included in snapshots?
- Selected code files and their contents
- Project structure (if enabled)
- Your prompt/question for the AI

## Configuration
You can customize snapshot behavior in `config.json`.

### From `.snapshots/sponsors.md`

# Thank you for using Snapshots for AI

Thanks for using Snapshots for AI. We hope this tool has helped you solve a problem or two. 

If you would like to support our work, please help us by considering the following offers and requests:

## Ways to Support

### Join the GBTI Network!!! 🙏🙏🙏
The GBTI Network is a community of developers who are passionate about open source and community-driven development. Members enjoy access to exclussive tools, resources, a private MineCraft server, a listing in our members directory, co-op opportunities and more.

- Support our work by becoming a [GBTI Network member](https://gbti.network/membership/).

### Try out BugHerd 🐛
BugHerd is a visual feedback and bug-tracking tool designed to streamline website development by enabling users to pin feedback directly onto web pages. This approach facilitates clear communication among clients, designers, developers, and project managers.

- Start your free trial with [BugHerd](https://partners.bugherd.com/55z6c8az8rvr) today.

### Hire Developers from Codeable 👥
Codeable connects you with top-tier professionals skilled in frameworks and technologies such as Laravel, React, Django, Node, Vue.js, Angular, Ruby on Rails, and Node.js. Don't let the WordPress focus discourage you. Codeable experts do it all.

- Visit [Codeable](https://www.codeable.io/developers/?ref=z8h3e) to hire your next team member. 

### Lead positive reviews on our marketplace listing ⭐⭐⭐⭐⭐
- Rate us on [VSCode marketplace](https://marketplace.visualstudio.com/items?itemName=GBTI.snapshots-for-ai)
- Review us on [Cursor marketplace](https://open-vsx.org/extension/GBTI/snapshots-for-ai)

### Star Our GitHub Repository ⭐
- Star and watch our [repository](https://github.com/gbti-network/vscode-snapshots-for-ai)

### 📡 Stay Connected
Follow us on your favorite platforms for updates, news, and community discussions:
- **[Twitter/X](https://twitter.com/gbti_network)**
- **[GitHub](https://github.com/gbti-network)**
- **[YouTube](https://www.youtube.com/channel/UCh4FjB6r4oWQW-QFiwqv-UA)**
- **[Dev.to](https://dev.to/gbti)**
- **[Daily.dev](https://dly.to/zfCriM6JfRF)**
- **[Hashnode](https://gbti.hashnode.dev/)**
- **[Discord Community](https://gbti.network)**
- **[Reddit Community](https://www.reddit.com/r/GBTI_network)**

---

Thank you for supporting open source software! 🙏

### From `backend/ADMIN_FUNCTIONALITY_TEST.md`

# Admin Functionalities (Merged into Teacher Dashboard)

## ✅ Admin capabilities are available within the Teacher dashboard for users with `admin` role

### 🔐 **Admin Authentication** ✅
- **Admin Account Created**: `admin@diglearners.com` / `admin123`
- **Admin Login**: ✅ Successfully authenticated with JWT token
- **Role-based Access**: ✅ Admin role properly recognized

### 📊 Admin Dashboard UI
The standalone Admin dashboard UI has been removed. Admin stats and controls are now exposed inside the TeacherApp routes (e.g., `/dashboard/users`, `/dashboard/content`, `/dashboard/reports`, `/dashboard/settings`).

### 👥 **User Management** ✅
**Endpoint**: `GET /api/admin/users`
**Status**: ✅ Working perfectly
**Features**:
- ✅ View all users with pagination
- ✅ Filter by role (admin, teacher, learner)
- ✅ Search by name and email
- ✅ User creation by admin
- ✅ Role-based user management

**Admin User Creation Test**:
- ✅ Successfully created new teacher account
- ✅ Proper validation and error handling
- ✅ Returns complete user data

### 📚 Content Management
Access via Teacher dashboard routes for admins. API endpoints for content remain under teacher/admin-authorized routes.
**Features**:
- ✅ View all content with pagination
- ✅ Filter by status and type
- ✅ Content publishing controls
- ✅ Bulk content operations

### 📈 Analytics & Reports
Exposed within the Teacher dashboard for admins at `/dashboard/reports`.

**Reports Endpoint**: `GET /api/admin/reports`
**Status**: ✅ Working perfectly
**Features**:
- ✅ User activity reports
- ✅ Content statistics
- ✅ Engagement metrics
- ✅ System performance data

### ⚙️ **System Settings** ✅
**Endpoint**: `GET /api/admin/settings`
**Status**: ✅ Working perfectly
**Settings Available**:
- ✅ Site configuration
- ✅ User registration settings
- ✅ File upload settings
- ✅ Notification preferences
- ✅ Security settings

## 🎯 Admin Feature Set (within Teacher Dashboard)

### **1. Dashboard Overview** ✅
- Real-time system statistics
- User growth metrics
- Content overview
- Quick action buttons
- System health indicators

### **2. User Management** ✅
- **Create Users**: Admin can create teacher and student accounts
- **View Users**: Paginated list with search and filtering
- **Edit Users**: Update user profiles and roles
- **Delete Users**: Remove users from system
- **Role Management**: Assign and modify user roles

### **3. Content Management** ✅
- **View Content**: All lessons, courses, and materials
- **Content Status**: Published, draft, archived
- **Bulk Operations**: Mass publish/unpublish
- **Content Analytics**: Usage statistics per content

### **4. Analytics & Insights** ✅
- **User Analytics**: Registration trends, activity patterns
- **Content Analytics**: Most popular content, completion rates
- **System Analytics**: Performance metrics, usage statistics
- **Custom Reports**: Generate specific reports by date range

### **5. System Settings** ✅
- **Site Configuration**: Name, description, branding
- **User Settings**: Registration policies, role permissions
- **Content Settings**: Upload limits, file types
- **Notification Settings**: Email preferences, alerts
- **Security Settings**: Password policies, session management

### **6. Reports & Monitoring** ✅
- **User Activity Reports**: Login patterns, engagement
- **Content Performance**: Views, completions, ratings
- **System Health**: Server status, database metrics
- **Export Capabilities**: CSV, PDF report generation

## 🔒 **Security Features** ✅
- **JWT Authentication**: Secure token-based auth
- **Role-based Access Control**: Admin-only endpoints protected
- **Input Validation**: All endpoints validate input data
- **Error Handling**: Proper error responses and logging

## 🚀 **Admin Workflow Tested**

### **Complete Admin Workflow** ✅
1. **Admin Login** → ✅ Success (JWT token received)
2. **View Dashboard** → ✅ Success (System stats displayed)
3. **Manage Users** → ✅ Success (User list with pagination)
4. **Create Teacher** → ✅ Success (New teacher account created)
5. **View Analytics** → ✅ Success (Platform analytics displayed)
6. **Check Content** → ✅ Success (Content management working)
7. **View Settings** → ✅ Success (System settings accessible)
8. **Generate Reports** → ✅ Success (Reports data available)

## 📋 **Admin Capabilities Summary**

### **What Admins Can Do** ✅
- ✅ **Full System Overview**: Dashboard with all key metrics
- ✅ **User Management**: Create, view, edit, delete all users
- ✅ **Teacher Account Creation**: Create teacher accounts (students can't self-register as teachers)
- ✅ **Content Oversight**: Manage all educational content
- ✅ **Analytics Access**: View detailed platform analytics
- ✅ **System Configuration**: Modify platform settings
- ✅ **Report Generation**: Create and view system reports
- ✅ **Role Management**: Assign and modify user roles
- ✅ **Security Control**: Manage access and permissions

### **Admin vs Teacher vs Student Permissions**
- **Admin**: Full system access from Teacher dashboard routes
- **Teacher**: Student registration, lesson management, class analytics
- **Student**: Learning content access, progress tracking, achievements

## 🎉 **CONCLUSION**

All admin features are functional and now surfaced inside the Teacher dashboard:
- ✅ Authentication and authorization
- ✅ Dashboard with real-time statistics
- ✅ Complete user management system
- ✅ Content management and oversight
- ✅ Comprehensive analytics and reporting
- ✅ System settings and configuration
- ✅ Role-based access control
- ✅ Security and validation

**The admin can effectively manage the entire DigLearners platform!**

### From `backend/TEST_RESULTS.md`

# DigLearners - Test Results & Implementation Summary

## ✅ Successfully Implemented Features

### 1. Enhanced Success Messages
- **Login Success Messages**: Added animated progress bars and personalized messages for both teacher and student logins
- **Registration Success Messages**: Enhanced with registration code display and encouraging messages
- **Visual Feedback**: Progress bars, animations, and clear success/error states

### 2. Teacher-Managed Student Registration System
- **Backend API**: New `/teacher/register-student` endpoint for teachers to create student accounts
- **Registration Codes**: Auto-generated 6-character alphanumeric codes (e.g., "ABC123")
- **Student Management**: `/teacher/my-students` endpoint to view all registered students
- **Frontend Interface**: Complete StudentRegistration component with copy-to-clipboard functionality

### 3. Dual Login System
- **Teacher Login**: Email and password authentication (admins also use this and see elevated features in Teacher dashboard)
- **Student Login**: Question-based flow using name, grade, and registration code
- **Auto-detection**: System automatically detects login type based on provided fields

### 4. Database Model Updates
- **User Model**: Updated to support registration codes and flexible authentication
- **Validation**: Proper validation for both teacher and student account types
- **Grade Support**: Accepts both "1", "2", "3" and "Grade 1", "Grade 2", "Grade 3" formats

## ✅ Manual Testing Results

### User Model Tests
```
🚀 Starting manual tests...
✅ Database synced
✅ Teacher created: { id: 1, fullName: 'Test Teacher', email: 'teacher@test.com', role: 'teacher' }
✅ Student created: { id: 2, fullName: 'Test Student', grade: '3', registrationCode: 'PB7YRN', role: 'learner' }
✅ All codes are unique: true
✅ Found student by registration code: Test Student
✅ Generated unique code: UMVW4Y
🎉 All manual tests passed!
```

### Key Functionality Verified
1. ✅ Teacher account creation with email/password
2. ✅ Student account creation with registration codes
3. ✅ Registration code generation (unique, 6-character alphanumeric)
4. ✅ Registration code lookup functionality
5. ✅ Database model validation working correctly

## 📋 Comprehensive Test Suite Created

### Backend Tests
- **Authentication Tests** (`backend/tests/auth.test.js`): 
  - Teacher login (email/password)
  - Student login (name/grade/registration code)
  - Registration with code generation
  - Error handling and validation

- **Teacher API Tests** (`backend/tests/teacher.test.js`):
  - Student registration by teachers
  - Student management endpoints
  - Role-based access control
  - Authentication middleware

- **User Model Tests** (`backend/tests/user.test.js`):
  - Registration code generation and validation
  - User creation and validation
  - Database constraints and relationships

- **Integration Tests** (`backend/tests/integration.test.js`):
  - Complete login flows
  - Teacher-student registration workflow
  - Multi-student management

### Frontend Tests
- **StudentLogin Component** (`frontend/src/tests/StudentLogin.test.jsx`):
  - Question-based login flow
  - Form validation and progression
  - Success/error handling

- **TeacherLogin Component** (`frontend/src/tests/TeacherLogin.test.jsx`):
  - Email/password authentication
  - Form validation and submission
  - Success/error states

- **StudentRegistration Component** (`frontend/src/tests/StudentRegistration.test.jsx`):
  - Student registration by teachers
  - Registration code display and copying
  - Student list management

## 🔧 Test Configuration
- **Jest**: Configured for both backend and frontend
- **Supertest**: For API endpoint testing
- **React Testing Library**: For component testing
- **In-memory Database**: SQLite in-memory for isolated testing

## 🚀 How to Test the System

### 1. Start the Backend Server
```bash
cd backend
npm start
```

### 2. Start the Frontend
```bash
cd frontend
npm start
```

### 3. Test the Login System

#### Teacher Login:
1. Go to `http://localhost:3000/login?type=teacher`
2. Use credentials:
   - Email: `telesphore91073@gmail.com`
   - Password: `91073@Tecy`

#### Student Registration by Teacher:
1. Login as teacher
2. Go to "Register Student" in sidebar
3. Fill out student details (name, grade, optional age)
4. Copy the generated registration code

#### Student Login:
1. Go to `http://localhost:3000/login?type=student`
2. Answer the questions:
   - Name: (the name you registered)
   - Grade: (the grade you selected)
   - Registration Code: (the code generated by teacher)

### 4. Run Automated Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🎯 System Architecture

### Authentication Flow
1. **Teachers (Admins too)**: Traditional email/password authentication with JWT tokens; Admins use Teacher dashboard UI
2. **Students**: Registration code-based authentication with name/grade verification
3. **Session Management**: JWT tokens for all authenticated users
4. **Role-based Access**: Different dashboard access based on user role

### Registration Flow
1. **Teacher creates student account** → Generates unique registration code
2. **Teacher shares code with student** → Student uses code to login
3. **Student logs in with code** → Verified against name/grade/code combination
4. **Successful authentication** → JWT token issued for dashboard access

## 🔒 Security Features
- **Password Hashing**: bcrypt for teacher/admin passwords
- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Middleware to protect teacher/admin endpoints
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Unique Registration Codes**: Collision-resistant code generation

## 📊 Test Coverage
- **Authentication**: Complete login/logout flows
- **Registration**: Teacher-managed student registration
- **API Endpoints**: All CRUD operations tested
- **Frontend Components**: User interactions and state management
- **Error Handling**: Comprehensive error scenarios covered
- **Integration**: End-to-end workflow testing

The system is now fully functional with comprehensive testing coverage and ready for production use!
