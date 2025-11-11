# Course Website with Admin Panel

A comprehensive single-course learning platform with admin controls, student enrollment, video lessons, tests, and progress tracking.

## Project Overview

This project implements a complete course website that allows:
- **Admins** to manage course content, enrollments, and student progress
- **Students** to enroll in courses, watch video lessons, take tests, and track their progress
- **Progress tracking** for both students and admins
- **Certificate generation** upon course completion

## Features

### Landing Page
- Intro video display
- Course content listing
- Enrollment functionality

### Admin Panel
- Enrollment approval/rejection
- Video content management
- Test creation and assignment
- Student submission grading
- Progress tracking
- Analytics dashboard

### Student Dashboard
- Personalized course view
- Progress tracking
- Video lesson access
- Test completion
- Results and certificate viewing

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Deployment**: Vercel

## Project Structure

```
course-website/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── services/       # API service calls
│       ├── utils/          # Utility functions
│       ├── hooks/          # Custom hooks
│       ├── context/        # React context providers
├── server/                 # Node.js/Express backend
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── utils/             # Utility functions
```

## Database Design

The application uses MongoDB with the following collections:
- Users
- Courses
- Modules
- Lessons
- Enrollments
- Tests
- TestSubmissions
- ProgressTracking

See [DATABASE_DESIGN.md](DATABASE_DESIGN.md) for detailed schema information.

## API Endpoints

Comprehensive RESTful API with endpoints for all entities:
- Authentication
- Users
- Courses
- Modules
- Lessons
- Enrollments
- Tests
- Test Submissions
- Progress Tracking

See [API_SPEC.md](API_SPEC.md) for detailed API documentation.

## Frontend Components

The React frontend follows a component-based architecture with:
- Page components for each view
- Reusable UI components
- Custom hooks for business logic
- Context providers for state management

See [FRONTEND_COMPONENTS.md](FRONTEND_COMPONENTS.md) for detailed component structure.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database (MongoDB Atlas or local)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd course-website
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables (see below)

5. Run the development servers:
   ```bash
   # In server directory
   npm run dev
   
   # In client directory
   npm start
   ```

### Environment Variables

#### Server (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

#### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Development Workflow

1. **Setup**: Initialize the project structure and dependencies
2. **Backend**: Implement database models and API endpoints
3. **Frontend**: Create components and connect to backend APIs
4. **Admin Features**: Implement admin panel functionality
5. **Student Features**: Implement student dashboard functionality
6. **Testing**: Test all features and user flows
7. **Deployment**: Deploy to production environment

## User Flows

### Student Enrollment Flow
1. User visits landing page
2. Watches intro video
3. Clicks "Enroll Now"
4. Admin receives enrollment request
5. Admin approves enrollment
6. Student gains access to course content

### Course Progress Flow
1. Student accesses first lesson
2. Watches video content
3. Clicks "Complete" button
4. Takes lesson test
5. Submits test answers
6. Admin grades submission
7. Next lesson unlocks automatically
8. Progress bar updates

### Certificate Generation
1. Student completes all lessons
2. System calculates final results
3. Student views certificate and analytics
4. Course completion recorded

## Security Considerations

- JWT-based authentication
- Role-based access control
- Password hashing
- Input validation and sanitization
- API rate limiting
- Secure HTTP headers

## Performance Optimization

- Database indexing
- API response caching
- Frontend code splitting
- Lazy loading components
- Image optimization
- Bundle size reduction

## Testing Strategy

- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests for React components
- End-to-end tests for user flows
- Load testing for performance

## Deployment

### Backend Deployment
- Deploy to Node.js hosting platform (Heroku, DigitalOcean, etc.)
- Configure environment variables
- Set up MongoDB connection

### Frontend Deployment
- Build production React app
- Deploy to Vercel, Netlify, or similar platform
- Configure environment variables
- Set up custom domain (if needed)

## Future Enhancements

- Multi-course support
- Payment integration
- Mobile app version
- Social learning features
- Advanced analytics
- Notification system
- Offline content access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.