# API Specification

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "string" // "student" or "admin"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "ObjectId",
        "name": "string",
        "email": "string",
        "role": "string"
      },
      "token": "string"
    }
  }
  ```

### Login User
**POST** `/api/auth/login`
- **Description**: Login user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "ObjectId",
        "name": "string",
        "email": "string",
        "role": "string"
      },
      "token": "string"
    }
  }
  ```

### Get Current User
**GET** `/api/auth/me`
- **Description**: Get current authenticated user
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "ObjectId",
        "name": "string",
        "email": "string",
        "role": "string"
      }
    }
  }
  ```

## User Endpoints

### Get All Users
**GET** `/api/users`
- **Description**: Get all users (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: 
  - `role` (optional): Filter by role
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "ObjectId",
        "name": "string",
        "email": "string",
        "role": "string"
      }
    ]
  }
  ```

### Get User by ID
**GET** `/api/users/:id`
- **Description**: Get user by ID
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```

### Update User
**PUT** `/api/users/:id`
- **Description**: Update user (admin or user themselves)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```

### Delete User
**DELETE** `/api/users/:id`
- **Description**: Delete user (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

## Course Endpoints

### Get All Courses
**GET** `/api/courses`
- **Description**: Get all courses
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "ObjectId",
        "title": "string",
        "description": "string",
        "introVideoUrl": "string",
        "createdAt": "Date",
        "updatedAt": "Date"
      }
    ]
  }
  ```

### Get Course by ID
**GET** `/api/courses/:id`
- **Description**: Get course by ID
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "title": "string",
      "description": "string",
      "introVideoUrl": "string",
      "modules": [
        {
          "_id": "ObjectId",
          "title": "string",
          "order": "number",
          "lessons": [
            {
              "_id": "ObjectId",
              "title": "string",
              "videoUrl": "string",
              "order": "number"
            }
          ]
        }
      ]
    }
  }
  ```

### Create Course
**POST** `/api/courses`
- **Description**: Create new course (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "introVideoUrl": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "title": "string",
      "description": "string",
      "introVideoUrl": "string",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Update Course
**PUT** `/api/courses/:id`
- **Description**: Update course (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "introVideoUrl": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "title": "string",
      "description": "string",
      "introVideoUrl": "string",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Delete Course
**DELETE** `/api/courses/:id`
- **Description**: Delete course (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Course deleted successfully"
  }
  ```

## Module Endpoints

### Get Modules for Course
**GET** `/api/modules/course/:courseId`
- **Description**: Get all modules for a course
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "ObjectId",
        "courseId": "ObjectId",
        "title": "string",
        "order": "number",
        "createdAt": "Date",
        "updatedAt": "Date"
      }
    ]
  }
  ```

### Get Module by ID
**GET** `/api/modules/:id`
- **Description**: Get module by ID
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "courseId": "ObjectId",
      "title": "string",
      "order": "number",
      "lessons": [
        {
          "_id": "ObjectId",
          "title": "string",
          "videoUrl": "string",
          "order": "number"
        }
      ],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Create Module
**POST** `/api/modules`
- **Description**: Create new module (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "courseId": "ObjectId",
    "title": "string",
    "order": "number"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "courseId": "ObjectId",
      "title": "string",
      "order": "number",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Update Module
**PUT** `/api/modules/:id`
- **Description**: Update module (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "order": "number"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "courseId": "ObjectId",
      "title": "string",
      "order": "number",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Delete Module
**DELETE** `/api/modules/:id`
- **Description**: Delete module (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Module deleted successfully"
  }
  ```

## Lesson Endpoints

### Get Lessons for Module
**GET** `/api/lessons/module/:moduleId`
- **Description**: Get all lessons for a module
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "ObjectId",
        "moduleId": "ObjectId",
        "title": "string",
        "videoUrl": "string",
        "order": "number",
        "createdAt": "Date",
        "updatedAt": "Date"
      }
    ]
  }
  ```

### Get Lesson by ID
**GET** `/api/lessons/:id`
- **Description**: Get lesson by ID
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "moduleId": "ObjectId",
      "title": "string",
      "videoUrl": "string",
      "order": "number",
      "test": {
        "_id": "ObjectId",
        "title": "string",
        "questions": [
          {
            "questionText": "string",
            "options": ["string"],
            "correctAnswer": "number"
          }
        ]
      },
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Create Lesson
**POST** `/api/lessons`
- **Description**: Create new lesson (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "moduleId": "ObjectId",
    "title": "string",
    "videoUrl": "string",
    "order": "number"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "moduleId": "ObjectId",
      "title": "string",
      "videoUrl": "string",
      "order": "number",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Update Lesson
**PUT** `/api/lessons/:id`
- **Description**: Update lesson (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "videoUrl": "string",
    "order": "number"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "moduleId": "ObjectId",
      "title": "string",
      "videoUrl": "string",
      "order": "number",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Delete Lesson
**DELETE** `/api/lessons/:id`
- **Description**: Delete lesson (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Lesson deleted successfully"
  }
  ```

## Enrollment Endpoints

### Get All Enrollments
**GET** `/api/enrollments`
- **Description**: Get all enrollments (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `status` (optional): Filter by status
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "ObjectId",
        "userId": "ObjectId",
        "courseId": "ObjectId",
        "status": "string",
        "progress": "number",
        "currentLessonId": "ObjectId",
        "enrolledAt": "Date",
        "approvedAt": "Date",
        "completedAt": "Date",
        "user": {
          "name": "string",
          "email": "string"
        },
        "course": {
          "title": "string"
        }
      }
    ]
  }
  ```

### Get My Enrollments
**GET** `/api/enrollments/my-enrollments`
- **Description**: Get current user's enrollments
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "ObjectId",
        "userId": "ObjectId",
        "courseId": "ObjectId",
        "status": "string",
        "progress": "number",
        "currentLessonId": "ObjectId",
        "enrolledAt": "Date",
        "approvedAt": "Date",
        "completedAt": "Date",
        "course": {
          "title": "string",
          "description": "string",
          "introVideoUrl": "string"
        }
      }
    ]
  }
  ```

### Get Enrollment by ID
**GET** `/api/enrollments/:id`
- **Description**: Get enrollment by ID
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "courseId": "ObjectId",
      "status": "string",
      "progress": "number",
      "currentLessonId": "ObjectId",
      "enrolledAt": "Date",
      "approvedAt": "Date",
      "completedAt": "Date"
    }
  }
  ```

### Create Enrollment
**POST** `/api/enrollments`
- **Description**: Create new enrollment request
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "courseId": "ObjectId"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "courseId": "ObjectId",
      "status": "pending",
      "progress": 0,
      "enrolledAt": "Date"
    }
  }
  ```

### Approve Enrollment
**PUT** `/api/enrollments/:id/approve`
- **Description**: Approve enrollment (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "courseId": "ObjectId",
      "status": "approved",
      "progress": 0,
      "currentLessonId": "ObjectId", // First lesson of the course
      "approvedAt": "Date"
    }
  }
  ```

### Reject Enrollment
**PUT** `/api/enrollments/:id/reject`
- **Description**: Reject enrollment (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "courseId": "ObjectId",
      "status": "rejected",
      "progress": 0,
      "rejectedAt": "Date"
    }
  }
  ```

### Update Enrollment Progress
**PUT** `/api/enrollments/:id/update-progress`
- **Description**: Update enrollment progress
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "progress": "number", // 0-100
    "currentLessonId": "ObjectId" // Optional
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "courseId": "ObjectId",
      "status": "string",
      "progress": "number",
      "currentLessonId": "ObjectId",
      "enrolledAt": "Date",
      "approvedAt": "Date"
    }
  }
  ```

## Test Endpoints

### Get Test for Lesson
**GET** `/api/tests/lesson/:lessonId`
- **Description**: Get test for a lesson
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "lessonId": "ObjectId",
      "title": "string",
      "questions": [
        {
          "questionText": "string",
          "options": ["string"],
          "correctAnswer": "number"
        }
      ],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Get Test by ID
**GET** `/api/tests/:id`
- **Description**: Get test by ID
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "lessonId": "ObjectId",
      "title": "string",
      "questions": [
        {
          "questionText": "string",
          "options": ["string"],
          "correctAnswer": "number"
        }
      ],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Create Test
**POST** `/api/tests`
- **Description**: Create new test (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "lessonId": "ObjectId",
    "title": "string",
    "questions": [
      {
        "questionText": "string",
        "options": ["string"],
        "correctAnswer": "number"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "lessonId": "ObjectId",
      "title": "string",
      "questions": [
        {
          "questionText": "string",
          "options": ["string"],
          "correctAnswer": "number"
        }
      ],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Update Test
**PUT** `/api/tests/:id`
- **Description**: Update test (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "questions": [
      {
        "questionText": "string",
        "options": ["string"],
        "correctAnswer": "number"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "lessonId": "ObjectId",
      "title": "string",
      "questions": [
        {
          "questionText": "string",
          "options": ["string"],
          "correctAnswer": "number"
        }
      ],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  }
  ```

### Delete Test
**DELETE** `/api/tests/:id`
- **Description**: Delete test (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Test deleted successfully"
  }
  ```

## Test Submission Endpoints

### Get Submissions for Test
**GET** `/api/submissions/test/:testId`
- **Description**: Get all submissions for a test (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "ObjectId",
        "userId": "ObjectId",
        "testId": "ObjectId",
        "answers": [
          {
            "questionIndex": "number",
            "selectedOption": "number"
          }
        ],
        "score": "number",
        "submittedAt": "Date",
        "graded": "boolean",
        "gradedBy": "ObjectId",
        "gradedAt": "Date",
        "marks": "number",
        "user": {
          "name": "string",
          "email": "string"
        }
      }
    ]
  }
  ```

### Get My Submissions
**GET** `/api/submissions/my-submissions`
- **Description**: Get current user's submissions
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "ObjectId",
        "userId": "ObjectId",
        "testId": "ObjectId",
        "answers": [
          {
            "questionIndex": "number",
            "selectedOption": "number"
          }
        ],
        "score": "number",
        "submittedAt": "Date",
        "graded": "boolean",
        "gradedBy": "ObjectId",
        "gradedAt": "Date",
        "marks": "number",
        "test": {
          "title": "string"
        }
      }
    ]
  }
  ```

### Get Submission by ID
**GET** `/api/submissions/:id`
- **Description**: Get submission by ID
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "testId": "ObjectId",
      "answers": [
        {
          "questionIndex": "number",
          "selectedOption": "number"
        }
      ],
      "score": "number",
      "submittedAt": "Date",
      "graded": "boolean",
      "gradedBy": "ObjectId",
      "gradedAt": "Date",
      "marks": "number"
    }
  }
  ```

### Create Submission
**POST** `/api/submissions`
- **Description**: Create new submission
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "testId": "ObjectId",
    "answers": [
      {
        "questionIndex": "number",
        "selectedOption": "number"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "testId": "ObjectId",
      "answers": [
        {
          "questionIndex": "number",
          "selectedOption": "number"
        }
      ],
      "score": "number", // Auto-calculated based on correct answers
      "submittedAt": "Date",
      "graded": false
    }
  }
  ```

### Grade Submission
**PUT** `/api/submissions/:id/grade`
- **Description**: Grade submission (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "marks": "number"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "testId": "ObjectId",
      "answers": [
        {
          "questionIndex": "number",
          "selectedOption": "number"
        }
      ],
      "score": "number",
      "submittedAt": "Date",
      "graded": true,
      "gradedBy": "ObjectId",
      "gradedAt": "Date",
      "marks": "number"
    }
  }
  ```

## Progress Tracking Endpoints

### Get User Progress
**GET** `/api/progress/user/:userId`
- **Description**: Get progress for a user
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "ObjectId",
        "userId": "ObjectId",
        "lessonId": "ObjectId",
        "status": "string",
        "startedAt": "Date",
        "completedAt": "Date",
        "testSubmitted": "boolean"
      }
    ]
  }
  ```

### Get Lesson Progress for User
**GET** `/api/progress/lesson/:lessonId/user/:userId`
- **Description**: Get progress for a user in a lesson
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "lessonId": "ObjectId",
      "status": "string",
      "startedAt": "Date",
      "completedAt": "Date",
      "testSubmitted": "boolean"
    }
  }
  ```

### Create/Update Progress
**POST** `/api/progress`
- **Description**: Create/update progress record
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "lessonId": "ObjectId",
    "status": "string", // "not_started", "in_progress", "completed"
    "testSubmitted": "boolean" // Optional
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "lessonId": "ObjectId",
      "status": "string",
      "startedAt": "Date", // Set if status is "in_progress"
      "completedAt": "Date", // Set if status is "completed"
      "testSubmitted": "boolean"
    }
  }
  ```

### Update Progress
**PUT** `/api/progress/:id`
- **Description**: Update progress record
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "status": "string", // "not_started", "in_progress", "completed"
    "testSubmitted": "boolean" // Optional
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "lessonId": "ObjectId",
      "status": "string",
      "startedAt": "Date",
      "completedAt": "Date",
      "testSubmitted": "boolean"
    }
  }
  ```