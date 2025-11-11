# Frontend Component Structure

## Component Hierarchy

```
App
├── Navbar
├── Routes
│   ├── PublicRoute
│   │   └── LandingPage
│   │       ├── HeroSection
│   │       ├── CourseContent
│   │       └── EnrollButton
│   ├── AuthRoute
│   │   ├── LoginPage
│   │   └── RegisterPage
│   ├── StudentRoute
│   │   └── StudentDashboard
│   │       ├── ProgressBar
│   │       ├── VideoPlayer
│   │       ├── CompleteButton
│   │       ├── TestComponent
│   │       └── ResultsPage
│   │           ├── Certificate
│   │           └── Analytics
│   └── AdminRoute
│       └── AdminDashboard
│           ├── EnrollmentRequests
│           ├── ManageCourses
│           │   ├── CourseForm
│           │   ├── ModuleForm
│           │   └── LessonForm
│           ├── ManageTests
│           │   └── TestForm
│           ├── GradeSubmissions
│           └── StudentProgress
└── Footer
```

## Component Details

### App Component
**File**: `src/App.js`
- Main application component
- Sets up routing
- Handles authentication state

### Navbar Component
**File**: `src/components/Navbar.js`
- Displays navigation links
- Shows user authentication status
- Contains logout functionality

### LandingPage Component
**File**: `src/pages/LandingPage.js`
- Displays hero section with intro video
- Shows course content list
- Contains enroll button

#### HeroSection Component
**File**: `src/components/HeroSection.js`
- Displays intro video
- Shows course title and description
- Contains call-to-action

#### CourseContent Component
**File**: `src/components/CourseContent.js`
- Displays list of modules and lessons
- Shows course structure

#### EnrollButton Component
**File**: `src/components/EnrollButton.js`
- Handles enrollment requests
- Shows enrollment status

### LoginPage Component
**File**: `src/pages/LoginPage.js`
- Handles user login
- Form validation
- Error handling

### RegisterPage Component
**File**: `src/pages/RegisterPage.js`
- Handles user registration
- Form validation
- Error handling

### StudentDashboard Component
**File**: `src/pages/StudentDashboard.js`
- Main dashboard for students
- Shows current progress
- Displays current lesson

#### ProgressBar Component
**File**: `src/components/ProgressBar.js`
- Visual representation of course progress
- Percentage completion

#### VideoPlayer Component
**File**: `src/components/VideoPlayer.js`
- Displays video content
- Video controls
- Complete button

#### CompleteButton Component
**File**: `src/components/CompleteButton.js`
- Marks lesson as complete
- Triggers test display

#### TestComponent
**File**: `src/components/TestComponent.js`
- Displays test questions
- Handles answer submission
- Shows results

### ResultsPage Component
**File**: `src/pages/ResultsPage.js`
- Displays final results
- Shows certificate
- Displays analytics

#### Certificate Component
**File**: `src/components/Certificate.js`
- Displays completion certificate
- Shows total marks

#### Analytics Component
**File**: `src/components/Analytics.js`
- Displays progress analytics
- Shows performance metrics

### AdminDashboard Component
**File**: `src/pages/AdminDashboard.js`
- Main dashboard for admins
- Navigation to different admin sections

#### EnrollmentRequests Component
**File**: `src/components/EnrollmentRequests.js`
- Displays pending enrollment requests
- Approve/reject functionality

#### ManageCourses Component
**File**: `src/components/ManageCourses.js`
- Create/edit courses
- Manage modules and lessons

##### CourseForm Component
**File**: `src/components/CourseForm.js`
- Form for creating/editing courses

##### ModuleForm Component
**File**: `src/components/ModuleForm.js`
- Form for creating/editing modules

##### LessonForm Component
**File**: `src/components/LessonForm.js`
- Form for creating/editing lessons

#### ManageTests Component
**File**: `src/components/ManageTests.js`
- Create/edit tests
- Assign tests to lessons

##### TestForm Component
**File**: `src/components/TestForm.js`
- Form for creating/editing tests

#### GradeSubmissions Component
**File**: `src/components/GradeSubmissions.js`
- Review test submissions
- Assign marks

#### StudentProgress Component
**File**: `src/components/StudentProgress.js`
- View individual student progress
- Unlock next video functionality

### Footer Component
**File**: `src/components/Footer.js`
- Displays footer content
- Copyright information

## Services

### AuthService
**File**: `src/services/authService.js`
- Handle authentication API calls
- Store/retrieve JWT token
- Manage user session

### CourseService
**File**: `src/services/courseService.js`
- Handle course-related API calls
- Fetch course data
- Manage course content

### EnrollmentService
**File**: `src/services/enrollmentService.js`
- Handle enrollment API calls
- Manage enrollment status
- Track progress

### TestService
**File**: `src/services/testService.js`
- Handle test API calls
- Submit answers
- Fetch results

### ProgressService
**File**: `src/services/progressService.js`
- Handle progress tracking API calls
- Update lesson status
- Fetch progress data

### AdminService
**File**: `src/services/adminService.js`
- Handle admin-specific API calls
- Manage courses, modules, lessons
- Grade submissions

## Context Providers

### AuthContext
**File**: `src/context/AuthContext.js`
- Manage authentication state
- Provide user data to components
- Handle login/logout

### CourseContext
**File**: `src/context/CourseContext.js`
- Manage course data
- Provide course information to components

### EnrollmentContext
**File**: `src/context/EnrollmentContext.js`
- Manage enrollment data
- Track enrollment status
- Handle progress updates

## Custom Hooks

### useAuth
**File**: `src/hooks/useAuth.js`
- Handle authentication logic
- Provide authentication state and methods

### useCourse
**File**: `src/hooks/useCourse.js`
- Handle course data fetching
- Manage course state

### useEnrollment
**File**: `src/hooks/useEnrollment.js`
- Handle enrollment logic
- Track enrollment status

### useTest
**File**: `src/hooks/useTest.js`
- Handle test logic
- Manage test state and submission

### useProgress
**File**: `src/hooks/useProgress.js`
- Handle progress tracking
- Update and fetch progress data

## Utility Functions

### apiClient
**File**: `src/utils/apiClient.js`
- Configure axios instance
- Add authentication headers
- Handle API errors

### formatDate
**File**: `src/utils/formatDate.js`
- Format dates for display

### calculateProgress
**File**: `src/utils/calculateProgress.js`
- Calculate course progress percentage

### ProtectedRoute
**File**: `src/utils/ProtectedRoute.js`
- Route protection based on authentication
- Role-based access control

## Styling

### Tailwind CSS Configuration
**File**: `tailwind.config.js`
- Custom theme configuration
- Color palette
- Spacing scale

### Global Styles
**File**: `src/index.css`
- Import Tailwind CSS
- Global styling overrides
- Custom CSS classes

## Environment Variables

### .env
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_VIDEO_PLACEHOLDER=https://via.placeholder.com/800x450
```

## Routing

### AppRouter Component
**File**: `src/AppRouter.js`
- Define all application routes
- Implement route protection
- Lazy load components

## State Management

For this application, we'll use:
1. React Context API for global state management
2. useState and useReducer for local component state
3. Custom hooks to encapsulate business logic

## Responsive Design

All components should be designed with mobile-first approach:
- Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- Test on different screen sizes
- Ensure touch-friendly interfaces

## Accessibility

- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Provide alt text for images
- Maintain proper color contrast

## Performance Optimization

- Code splitting with React.lazy and Suspense
- Memoization with React.memo and useMemo
- Efficient re-rendering with useCallback
- Lazy loading images and videos
- Bundle size optimization