# Course Website with Admin Panel - Developer Guide

## Tech Stack
- Frontend: React + Tailwind CSS
- Backend: Node.js / Express
- Database: MongoDB Atlas
- Authentication: JWT
- Hosting: Vercel

## Folder Structure
```
course-website/
├── client/                 # React frontend
│   ├── public/
│   │   └── assets/         # Images, videos, etc.
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service calls
│   │   ├── utils/          # Utility functions
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # React context providers
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                 # Node.js/Express backend
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   ├── utils/             # Utility functions
│   ├── .env
│   └── server.js
├── README.md
└── package.json
```

## Database Schema (MongoDB Collections)

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // hashed
  role: String, // "admin", "student"
  createdAt: Date,
  updatedAt: Date
}
```

### Courses Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  introVideoUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Modules Collection
```javascript
{
  _id: ObjectId,
  courseId: ObjectId, // Reference to Courses collection
  title: String,
  order: Number, // Display order
  createdAt: Date,
  updatedAt: Date
}
```

### Lessons Collection
```javascript
{
  _id: ObjectId,
  moduleId: ObjectId, // Reference to Modules collection
  title: String,
  videoUrl: String,
  order: Number, // Display order within module
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollments Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users collection (student)
  courseId: ObjectId, // Reference to Courses collection
  status: String, // "pending", "approved", "rejected"
  progress: Number, // Percentage completed (0-100)
  currentLessonId: ObjectId, // Current lesson student is on
  enrolledAt: Date,
  approvedAt: Date,
  completedAt: Date
}
```

### Tests Collection
```javascript
{
  _id: ObjectId,
  lessonId: ObjectId, // Reference to Lessons collection
  title: String,
  questions: [
    {
      questionText: String,
      options: [String],
      correctAnswer: Number // Index of correct option
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### TestSubmissions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users collection (student)
  testId: ObjectId, // Reference to Tests collection
  answers: [
    {
      questionIndex: Number,
      selectedOption: Number
    }
  ],
  score: Number, // Calculated score
  submittedAt: Date,
  graded: Boolean, // Whether admin has graded it
  gradedBy: ObjectId, // Reference to Users collection (admin)
  gradedAt: Date,
  marks: Number // Marks given by admin
}
```

### ProgressTracking Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users collection (student)
  lessonId: ObjectId, // Reference to Lessons collection
  status: String, // "not_started", "in_progress", "completed"
  startedAt: Date,
  completedAt: Date,
  testSubmitted: Boolean // Whether test was submitted for this lesson
}
```

## API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login user |
| GET | `/me` | Get current user |

### User Routes (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all users (admin only) |
| GET | `/:id` | Get user by ID |
| PUT | `/:id` | Update user |
| DELETE | `/:id` | Delete user |

### Course Routes (`/api/courses`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all courses |
| GET | `/:id` | Get course by ID |
| POST | `/` | Create new course (admin only) |
| PUT | `/:id` | Update course (admin only) |
| DELETE | `/:id` | Delete course (admin only) |

### Module Routes (`/api/modules`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/course/:courseId` | Get all modules for a course |
| GET | `/:id` | Get module by ID |
| POST | `/` | Create new module (admin only) |
| PUT | `/:id` | Update module (admin only) |
| DELETE | `/:id` | Delete module (admin only) |

### Lesson Routes (`/api/lessons`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/module/:moduleId` | Get all lessons for a module |
| GET | `/:id` | Get lesson by ID |
| POST | `/` | Create new lesson (admin only) |
| PUT | `/:id` | Update lesson (admin only) |
| DELETE | `/:id` | Delete lesson (admin only) |

### Enrollment Routes (`/api/enrollments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all enrollments (admin only) |
| GET | `/my-enrollments` | Get current user's enrollments |
| GET | `/:id` | Get enrollment by ID |
| POST | `/` | Create new enrollment request |
| PUT | `/:id/approve` | Approve enrollment (admin only) |
| PUT | `/:id/reject` | Reject enrollment (admin only) |
| PUT | `/:id/update-progress` | Update enrollment progress |

### Test Routes (`/api/tests`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lesson/:lessonId` | Get test for a lesson |
| GET | `/:id` | Get test by ID |
| POST | `/` | Create new test (admin only) |
| PUT | `/:id` | Update test (admin only) |
| DELETE | `/:id` | Delete test (admin only) |

### TestSubmission Routes (`/api/submissions`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/test/:testId` | Get all submissions for a test (admin only) |
| GET | `/my-submissions` | Get current user's submissions |
| GET | `/:id` | Get submission by ID |
| POST | `/` | Create new submission |
| PUT | `/:id/grade` | Grade submission (admin only) |

### Progress Routes (`/api/progress`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/:userId` | Get progress for a user |
| GET | `/lesson/:lessonId/user/:userId` | Get progress for a user in a lesson |
| POST | `/` | Create/update progress record |
| PUT | `/:id` | Update progress record |

## Frontend Pages & Components

### Public Pages
1. **LandingPage**
   - Hero section with intro video
   - Course content list
   - Enroll Now button

### Auth Pages
1. **LoginPage**
2. **RegisterPage**

### Student Pages
1. **StudentDashboard**
   - Progress bar
   - Current lesson/video
   - Complete button
2. **VideoPlayer**
   - Video display
   - Controls
3. **TestPage**
   - Questions display
   - Answer submission
4. **ResultsPage**
   - Certificate/report card
   - Analytics

### Admin Pages
1. **AdminDashboard**
   - Enrollment requests
   - Student progress tracking
   - Analytics
2. **ManageCourses**
   - Create/edit courses
   - Upload videos (via URL)
3. **ManageTests**
   - Create/edit tests
   - Assign to lessons
4. **GradeSubmissions**
   - Review submissions
   - Give marks
5. **StudentProgress**
   - View individual student progress
   - Unlock next video

## Implementation Flow

1. Setup project structure
2. Implement authentication system
3. Create database models and connections
4. Build backend API endpoints
5. Develop frontend components and pages
6. Connect frontend to backend APIs
7. Implement admin panel functionality
8. Implement student dashboard functionality
9. Add progress tracking and analytics
10. Testing and deployment

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```