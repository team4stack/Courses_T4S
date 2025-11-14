import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { supabase } from '../utils/supabaseClient.js';
import ProgressBar from '../components/ProgressBar.jsx';

const CourseList = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session?.user) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: enrollmentRows, error: enrollmentError } = await supabase
          .from('progress')
          .select('course_id')
          .eq('user_id', session.user.id)
          .is('video_id', null);

        if (enrollmentError) {
          throw enrollmentError;
        }

        const courseIds = Array.from(new Set((enrollmentRows || []).map((row) => row.course_id))).filter(Boolean);

        if (courseIds.length === 0) {
          setCourses([]);
          setProgressMap({});
          setLoading(false);
          return;
        }

        const { data: courseRows, error: courseError } = await supabase
          .from('courses')
          .select('id, name, description, thumbnail_url')
          .in('id', courseIds)
          .order('name', { ascending: true });

        if (courseError) {
          throw courseError;
        }

        const { data: videosRows, error: videosError } = await supabase
          .from('videos')
          .select('id, course_id')
          .in('course_id', courseIds);
        if (videosError) {
          throw videosError;
        }

        const { data: progressRows, error: progressError } = await supabase
          .from('progress')
          .select('course_id, video_id, completed')
          .eq('user_id', session.user.id)
          .not('video_id', 'is', null);
        if (progressError) {
          throw progressError;
        }

        const videosByCourse = videosRows.reduce((acc, video) => {
          if (!acc[video.course_id]) acc[video.course_id] = [];
          acc[video.course_id].push(video);
          return acc;
        }, {});

        const progressByCourse = progressRows.reduce((acc, row) => {
          if (!acc[row.course_id]) acc[row.course_id] = { completed: 0, total: videosByCourse[row.course_id]?.length || 0 };
          if (row.completed) {
            acc[row.course_id].completed += 1;
          }
          return acc;
        }, {});

        Object.keys(videosByCourse).forEach((courseId) => {
          if (!progressByCourse[courseId]) {
            progressByCourse[courseId] = {
              completed: 0,
              total: videosByCourse[courseId]?.length || 0,
            };
          } else {
            progressByCourse[courseId].total = videosByCourse[courseId]?.length || 0;
          }
        });

        setCourses(courseRows || []);
        setProgressMap(progressByCourse);
      } catch (err) {
        console.error('[CourseList] Failed to load enrolled courses', err);
        setError('Unable to load your courses right now.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session?.user]);

  const courseStatus = useMemo(
    () =>
      courses.map((course) => ({
        ...course,
        progress: progressMap[course.id] || { completed: 0, total: 0 },
      })),
    [courses, progressMap]
  );

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold">My Courses</h1>
        <button className="btn btn-outline-primary" onClick={() => navigate('/')}>
          Browse Courses
        </button>
      </div>
      <div className="row g-4">
        {courseStatus.map((course) => (
          <div className="col-md-6" key={course.id}>
            <div className="card h-100 shadow-sm">
              {course.thumbnail_url && (
                <img src={course.thumbnail_url} alt={course.name} className="card-img-top" />
              )}
              <div className="card-body d-flex flex-column">
                <h2 className="h5 fw-semibold">{course.name}</h2>
                <p className="text-muted flex-grow-1">{course.description}</p>
                <div className="mb-3">
                  <ProgressBar completed={course.progress.completed} total={course.progress.total} />
                  <p className="small text-muted mt-1">
                    {course.progress.completed} of {course.progress.total} videos completed
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => handleViewCourse(course.id)}>
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        ))}
        {courseStatus.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info text-center">
              You are not enrolled in any courses yet. Visit the landing page to enroll.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;

