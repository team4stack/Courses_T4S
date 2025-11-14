import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { supabase } from '../utils/supabaseClient.js';
import ProgressBar from '../components/ProgressBar.jsx';

const Profile = () => {
  const { session, profile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progressRows, setProgressRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session?.user) return;

    const loadProfileData = async () => {
      setLoading(true);
      try {
        const { data: courseRows, error: courseError } = await supabase
          .from('courses')
          .select('id, name, thumbnail_url');
        if (courseError) throw courseError;
        setCourses(courseRows || []);

        const { data: progressData, error: progressError } = await supabase
          .from('progress')
          .select('course_id, video_id, completed, score')
          .eq('user_id', session.user.id);
        if (progressError) throw progressError;
        setProgressRows(progressData || []);
      } catch (err) {
        console.error('[Profile] Failed to load data', err);
        setError('Unable to load profile information right now.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [session?.user]);

  const progressByCourse = useMemo(() => {
    const grouped = {};
    progressRows
      .filter((row) => row.video_id)
      .forEach((row) => {
        if (!grouped[row.course_id]) {
          grouped[row.course_id] = { completed: 0, total: 0, bestScore: 0 };
        }
        grouped[row.course_id].total += 1;
        if (row.completed) grouped[row.course_id].completed += 1;
        if (row.score != null) {
          grouped[row.course_id].bestScore = Math.max(grouped[row.course_id].bestScore, row.score);
        }
      });
    return grouped;
  }, [progressRows]);

  const enrolledCourseIds = useMemo(
    () =>
      new Set(
        progressRows
          .filter((row) => !row.video_id && row.course_id)
          .map((row) => row.course_id)
      ),
    [progressRows]
  );

  const enrolledCourses = courses.filter((course) => enrolledCourseIds.has(course.id));
  const completedCourses = enrolledCourses.filter((course) => {
    const progress = progressByCourse[course.id];
    return progress && progress.completed > 0 && progress.completed === progress.total;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                <span className="h3 mb-0 fw-bold">{profile?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <h1 className="h4 fw-bold">{profile?.name}</h1>
              <p className="text-muted mb-1">{profile?.email}</p>
              <span className="badge text-bg-primary text-uppercase">{profile?.role}</span>
              <div className="mt-4 row text-center">
                <div className="col-6">
                  <p className="fw-semibold mb-0">{enrolledCourses.length}</p>
                  <p className="text-muted small mb-0">Enrolled</p>
                </div>
                <div className="col-6">
                  <p className="fw-semibold mb-0">{completedCourses.length}</p>
                  <p className="text-muted small mb-0">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-4">Course Progress</h2>
              {enrolledCourses.length === 0 && (
                <div className="alert alert-info">Enroll in a course to start learning.</div>
              )}
              <div className="row g-4">
                {enrolledCourses.map((course) => {
                  const progress = progressByCourse[course.id] || { completed: 0, total: 0, bestScore: 0 };
                  return (
                    <div className="col-sm-6" key={course.id}>
                      <div className="border rounded p-3 h-100">
                        <div className="d-flex align-items-center mb-3">
                          {course.thumbnail_url && (
                            <img
                              src={course.thumbnail_url}
                              alt={course.name}
                              className="rounded me-3"
                              style={{ width: 60, height: 40, objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <h3 className="h6 fw-semibold mb-0">{course.name}</h3>
                            <p className="small text-muted mb-0">
                              Best Score: {progress.bestScore ? `${progress.bestScore}%` : '–'}
                            </p>
                          </div>
                        </div>
                        <ProgressBar completed={progress.completed} total={progress.total} />
                        <p className="small text-muted mt-2">
                          {progress.completed} of {progress.total} videos approved
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

