# Development Setup Guide

This guide will help you set up the Course Website project on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm (comes with Node.js) or yarn
- Git
- MongoDB (local installation or MongoDB Atlas account)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd course-website
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

#### Environment Variables

Create a [.env](file:///c:/Users/hasna/Desktop/Coursewebsite/server/.env) file in the server directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course-website
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

Replace the MongoDB URI with your actual MongoDB connection string.

#### Database Setup

The application will automatically create the required collections when you start the server for the first time. However, you may want to set up indexes manually for better performance.

To set up indexes, you can use the following MongoDB commands:

```javascript
// Connect to your MongoDB database and run these commands
db.users.createIndex({ "email": 1 }, { unique: true })
db.modules.createIndex({ "courseId": 1 })
db.lessons.createIndex({ "moduleId": 1 })
db.enrollments.createIndex({ "userId": 1 })
db.enrollments.createIndex({ "courseId": 1 })
db.enrollments.createIndex({ "status": 1 })
db.tests.createIndex({ "lessonId": 1 })
db.test_submissions.createIndex({ "userId": 1 })
db.test_submissions.createIndex({ "testId": 1 })
db.test_submissions.createIndex({ "userId": 1, "testId": 1 })
db.progress_tracking.createIndex({ "userId": 1 })
db.progress_tracking.createIndex({ "lessonId": 1 })
db.progress_tracking.createIndex({ "userId": 1, "lessonId": 1 })
db.progress_tracking.createIndex({ "status": 1 })
```

### 3. Frontend Setup

Open a new terminal window/tab and navigate to the client directory:

```bash
cd client
npm install
```

#### Environment Variables

Create a [.env](file:///c:/Users/hasna/Desktop/Coursewebsite/client/.env) file in the client directory with the following content:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_VIDEO_PLACEHOLDER=https://via.placeholder.com/800x450
```

### 4. Running the Application

#### Start the Backend Server

In the server terminal:

```bash
npm run dev
```

This will start the Express server on port 5000 with nodemon for auto-reloading during development.

#### Start the Frontend Development Server

In the client terminal:

```bash
npm start
```

This will start the React development server on port 3000 and automatically open your browser.

### 5. Initial Data Setup

To get started quickly, you can seed the database with some initial data. Create a [seed.js](file:///c:/Users/hasna/Desktop/Coursewebsite/server/seed.js) file in the server directory:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import your models
const User = require('./models/User');
const Course = require('./models/Course');

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();
    
    // Create student user
    const studentPassword = await bcrypt.hash('student123', 10);
    const student = new User({
      name: 'Student User',
      email: 'student@example.com',
      password: studentPassword,
      role: 'student'
    });
    await student.save();
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
```

Run the seed script:

```bash
node seed.js
```

### 6. Accessing the Application

Once both servers are running:

1. Open your browser and go to `http://localhost:3000`
2. You should see the landing page
3. Use the seeded admin account to access the admin panel:
   - Email: admin@example.com
   - Password: admin123
4. Use the seeded student account to access the student dashboard:
   - Email: student@example.com
   - Password: student123

## Development Workflow

### Backend Development

1. All API routes are defined in `server/routes/`
2. Controllers handle request logic in `server/controllers/`
3. Models define data structures in `server/models/`
4. Middleware functions are in `server/middleware/`

### Frontend Development

1. Pages are in `client/src/pages/`
2. Components are in `client/src/components/`
3. API service calls are in `client/src/services/`
4. Custom hooks are in `client/src/hooks/`
5. Context providers are in `client/src/context/`

### Code Quality

- Use ESLint for JavaScript linting
- Use Prettier for code formatting
- Write tests for critical functionality
- Follow the established folder structure

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in [.env](file:///c:/Users/hasna/Desktop/Coursewebsite/server/.env) file
2. **MongoDB connection error**: Check your MongoDB URI and network connectivity
3. **CORS error**: Ensure the frontend URL is whitelisted in backend CORS configuration
4. **Missing environment variables**: Double-check all required env vars are set

### Debugging Tips

1. Check terminal outputs for error messages
2. Use browser developer tools to inspect network requests
3. Use MongoDB Compass or similar tool to inspect database contents
4. Enable debug logging in your Express application

## Useful Commands

### Backend

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

### Frontend

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (irreversible)
npm run eject
```

## Next Steps

1. Implement all API endpoints according to [API_SPEC.md](file:///c:/Users/hasna/Desktop/Coursewebsite/API_SPEC.md)
2. Create React components according to [FRONTEND_COMPONENTS.md](file:///c:/Users/hasna/Desktop/Coursewebsite/FRONTEND_COMPONENTS.md)
3. Connect frontend to backend APIs
4. Implement authentication flow
5. Add admin panel functionality
6. Implement student dashboard features
7. Add progress tracking
8. Implement certificate generation
9. Test all user flows
10. Deploy to production

## Additional Resources

- [Project Requirements](file:///c:/Users/hasna/Desktop/Coursewebsite/PROJECT_PLAN.md)
- [API Specification](file:///c:/Users/hasna/Desktop/Coursewebsite/API_SPEC.md)
- [Frontend Components](file:///c:/Users/hasna/Desktop/Coursewebsite/FRONTEND_COMPONENTS.md)
- [Database Design](file:///c:/Users/hasna/Desktop/Coursewebsite/DATABASE_DESIGN.md)
- [Main README](file:///c:/Users/hasna/Desktop/Coursewebsite/README.md)