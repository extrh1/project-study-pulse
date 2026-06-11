# StudyPulse - Learning Management System

## Project Overview
StudyPulse is a comprehensive multilingual learning management system built with modern web technologies, designed to provide an engaging and personalized learning experience for students.

## Features

### Core Functionality
- **User Management**: Complete authentication system with registration, login, and profile management
- **Course Management**: Create, edit, and organize courses with subjects and lessons
- **Quiz System**: Interactive quizzes with multiple question types and scoring
- **Progress Tracking**: Detailed statistics and progress visualization
- **Gamification**: XP system, badges, and level progression
- **Multilingual Support**: Full internationalization (English, French, Arabic)

### Technical Features
- **Real-time Statistics**: Dashboard with charts and analytics
- **Responsive Design**: Mobile-friendly interface with dark/light themes
- **API-First Architecture**: RESTful API with comprehensive endpoints
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

## Technology Stack

### Backend
- **Laravel 12**: PHP framework for robust backend development
- **MySQL**: Relational database for data persistence
- **Sanctum**: API authentication
- **OpenAI Integration**: AI-powered features

### Frontend
- **React 19**: Modern JavaScript library
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **Axios**: HTTP client for API communication

### Development Tools
- **Composer**: PHP dependency management
- **NPM**: JavaScript package management
- **Git**: Version control
- **ESLint**: Code linting
- **PHPUnit**: Testing framework

## Installation

### Prerequisites
- PHP 8.2+
- Node.js 18+
- MySQL 8.0+
- Composer
- NPM

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Database Schema

### Core Tables
- **users**: User accounts and profiles
- **courses**: Learning courses
- **lessons**: Course content
- **quizzes**: Assessment quizzes
- **quiz_attempts**: Quiz submissions and results
- **study_sessions**: Learning session tracking
- **badges**: Achievement system
- **notifications**: User notifications

### Relationships
- Users ↔ Courses (many-to-many)
- Courses → Lessons (one-to-many)
- Courses → Quizzes (one-to-many)
- Quizzes → Questions (one-to-many)
- Users → Quiz Attempts (one-to-many)

## API Documentation

### Authentication Endpoints
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout

### Course Management
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course
- `GET /api/courses/{id}` - Get course details
- `PUT /api/courses/{id}` - Update course

### Quiz System
- `GET /api/quizzes` - List quizzes
- `POST /api/quizzes/{id}/attempt` - Submit quiz attempt
- `GET /api/quizzes/{id}/results` - Get quiz results

### Statistics & Analytics
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/stats/chart` - Chart data for visualizations

## Security Features

### Authentication & Authorization
- JWT-based authentication with Laravel Sanctum
- Password hashing with bcrypt
- CSRF protection
- Rate limiting on API endpoints

### Data Validation
- Comprehensive input validation
- SQL injection prevention
- XSS protection
- File upload security

## Testing

### Backend Testing
```bash
cd backend
php artisan test
```

### Frontend Testing
```bash
cd frontend
npm run lint
```

## Deployment

### Production Build
```bash
# Backend
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend
npm run build
```

### Environment Configuration
- Set `APP_ENV=production` in `.env`
- Configure database credentials
- Set up SSL certificates
- Configure file storage

## Project Structure

```
StudyPulse/
├── backend/                 # Laravel API
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── tests/
├── frontend/               # React SPA
│   ├── src/
│   ├── public/
│   └── dist/
├── docs/                   # Documentation
└── README.md
```

## Future Enhancements

### Planned Features
- **Video Lessons**: Integrated video player
- **Discussion Forums**: Community interaction
- **Mobile App**: React Native companion
- **Advanced Analytics**: Machine learning insights
- **Offline Mode**: Progressive Web App features

### Technical Improvements
- **Microservices**: API gateway architecture
- **Redis Caching**: Performance optimization
- **WebSocket**: Real-time notifications
- **Docker**: Containerized deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Laravel Framework
- React Ecosystem
- OpenAI for AI integration
- All contributors and supporters

---

**Developed by**: [Your Name]
**Institution**: [Your University]
**Date**: May 2026</content>
<parameter name="filePath">c:\xampp\htdocs\StudyPulse\README.md