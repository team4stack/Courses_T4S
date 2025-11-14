# MultiCourse Hub

A multi-course learning platform built with **React**, **Bootstrap**, and **Supabase**. Students can enroll, follow structured video lessons, attempt assessments, and track their progress while administrators manage courses, content, and approvals.

## Features

- Responsive landing page with featured intro video and gated enrollment.
- Supabase authentication (email/password) with role-based access (student/admin).
- Protected student dashboard that lists enrolled courses and progress.
- Course view with sequential video unlocking, embedded players, progress tracking, and test access.
- Assessment workflow storing scores in Supabase and admin approvals to unlock subsequent videos.
- Admin panel for managing courses, videos, tests, and reviewing student submissions.
- Profile page summarizing learner progress, best scores, and course completions.

## Project Structure

```
src/
 ├── components/
 │   ├── Certificate.jsx
 │   ├── Footer.jsx
 │   ├── Navbar.jsx
 │   └── ProgressBar.jsx
 ├── context/
 │   └── AuthContext.jsx
 ├── pages/
 │   ├── AdminPanel.jsx
 │   ├── CourseList.jsx
 │   ├── CourseView.jsx
 │   ├── LandingPage.jsx
 │   ├── Login.jsx
 │   ├── Profile.jsx
 │   └── TestPage.jsx
 ├── utils/
 │   └── supabaseClient.js
 ├── App.jsx
 └── index.js
```

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

### 2. Set Up Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy and paste the contents of `supabase-schema-fixed.sql` into the editor (this version fixes the infinite recursion issue in RLS policies)
3. Click **Run** to execute the SQL script
4. This will create all necessary tables, indexes, triggers, and Row Level Security (RLS) policies

> ⚠️ **Note**: If you're using the original `supabase-schema.sql`, you may encounter an "infinite recursion detected in policy" error. The fixed version uses `auth.jwt() ->> 'role' = 'admin'` instead of querying the users table within policies to avoid this issue.
>
> ✅ The updated `supabase-schema-fixed.sql` also handles existing triggers gracefully by using `DROP TRIGGER IF EXISTS` to prevent "trigger already exists" errors.

The schema includes:
- `users` (id, name, email, role) - extends Supabase auth.users
- `courses` (id, name, description, intro_video_url, thumbnail_url)
- `videos` (id, course_id, title, description, video_url, thumbnail_url, order)
- `tests` (id, video_id, question, options [jsonb], answer)
- `progress` (id, user_id, course_id, video_id, completed, score)

### 3. Create Admin User

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add User** and create a user with email/password
3. Go to **SQL Editor** and run:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
   ```

### 4. Configure Environment Variables

Create a `.env` file in the project root (or configure in Vercel dashboard):

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

To find these values:
1. Go to **Project Settings** → **API** in Supabase
2. Copy the **Project URL** (for `VITE_SUPABASE_URL`)
3. Copy the **anon/public** key (for `VITE_SUPABASE_ANON_KEY`)

> ⚠️ **Important**: Never commit your `.env` file to version control. The `.env.example` file is provided as a template only.

## Development

```bash
npm install
npm run dev
```

The development server runs with Vite at `http://localhost:5173`.

## Deployment on Vercel

1. Push this project to GitHub (or another Git provider).
2. Create a new Vercel project and import the repository.
3. Set the build command to `npm run build` and the output directory to `dist`.
4. Configure the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel.
5. Trigger a deploy — Vercel will build the Vite app and host it globally.

## Usage Guide

### For Students

1. **Sign Up**: Create an account on the landing page
2. **Browse Courses**: View available courses on the homepage
3. **Enroll**: Click "View Course" to automatically enroll in a course
4. **Learn**: Watch videos in sequence, complete tests, and track progress
5. **Get Certified**: Complete all videos and tests to receive a certificate

### For Administrators

1. **Login**: Sign in with an admin account
2. **Access Admin Panel**: Navigate to "Admin Panel" from the navbar
3. **Add Courses**: Create new courses with intro videos and thumbnails
4. **Add Videos**: Add video lessons to courses in sequential order
5. **Create Tests**: Add assessments for each video with multiple-choice questions
6. **Review Progress**: Approve student test submissions to unlock next videos

## Features Implemented

✅ **Authentication & Authorization**
- Email/password authentication via Supabase Auth
- Role-based access control (student/admin)
- Protected routes for authenticated users
- Admin-only routes for admin panel

✅ **Course Management**
- Dynamic course listing with thumbnails
- Course enrollment on demand
- Intro video display on landing page

✅ **Video Learning System**
- Sequential video unlocking
- Embedded video players (YouTube/Vimeo support)
- Progress tracking per video
- Video completion marking

✅ **Assessment System**
- Multiple-choice tests per video
- Score calculation and storage
- Admin approval workflow
- Automatic next video unlocking on approval

✅ **Progress Tracking**
- Course-level progress bars
- Video completion status
- Test scores display
- Certificate generation on course completion

✅ **Admin Dashboard**
- Course creation and management
- Video addition with ordering
- Test creation with multiple options
- Student progress review and approval

## Next Steps / Future Enhancements

- [ ] Email notifications for course enrollment and progress updates
- [ ] PDF certificate generation and download
- [ ] Video playback speed controls
- [ ] Course search and filtering
- [ ] Discussion forums for courses
- [ ] Mobile app version
- [ ] Analytics dashboard for admins
