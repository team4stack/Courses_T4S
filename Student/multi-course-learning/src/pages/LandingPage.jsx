import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient.js';
import { useAuth } from '../hooks/useAuth.js';

const LandingPage = () => {
  const { profile, loading, enrollInCourse, session } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [featuredCourse, setFeaturedCourse] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, name, description, intro_video_url, thumbnail_url')
          .order('name', { ascending: true });
        if (error) {
          throw error;
        }
        setCourses(data ?? []);
        setFeaturedCourse(data && data.length > 0 ? data[0] : null);
      } catch (err) {
        console.error('[LandingPage] Failed to fetch courses', err);
        setStatus({ loading: false, error: 'Unable to load courses right now.' });
        return;
      }
      setStatus({ loading: false, error: null });
    };

    loadCourses();
  }, []);

  const handleViewCourse = async (courseId) => {
    if (!profile && !loading) {
      navigate('/login', { state: { redirectTo: `/courses/${courseId}` } });
      return;
    }

    if (profile && session?.user) {
      setEnrolling(true);
      try {
        // Check if already enrolled
        const { data: existing } = await supabase
          .from('progress')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('course_id', courseId)
          .is('video_id', null)
          .maybeSingle();

        if (!existing) {
          await enrollInCourse(courseId);
        }
        navigate(`/courses/${courseId}`);
      } catch (error) {
        console.error('[LandingPage] Failed to enroll', error);
        setStatus({ ...status, error: 'Unable to enroll in course. Please try again.' });
      } finally {
        setEnrolling(false);
      }
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  const handleEnroll = () => {
    navigate('/login', { state: { redirectTo: '/courses' } });
  };

  return (
    <div className="bg-light">
      <section className="py-5 bg-primary text-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-5 fw-bold">Master in-demand tech skills</h1>
              <p className="lead">
                Explore structured courses like Flutter, MERN Stack, and more. Learn from curated video lessons,
                complete knowledge checks, and track your progress toward certification.
              </p>
              {!profile && (
                <button className="btn btn-light btn-lg text-primary fw-semibold" onClick={handleEnroll}>
                  Enroll Now
                </button>
              )}
            </div>
            <div className="col-lg-6">
              <div className="ratio ratio-16x9 rounded shadow">
                {featuredCourse?.intro_video_url ? (
                  <iframe
                    src={featuredCourse.intro_video_url}
                    title={featuredCourse.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center bg-dark bg-opacity-25 rounded">
                    <span className="text-light fw-semibold mb-2">Intro video</span>
                    <span className="text-light-50 small">Upload an intro URL in Supabase</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 fw-bold mb-0">Available Courses</h2>
            <p className="text-muted mb-0">
              {courses.length > 0 ? `${courses.length} courses ready to explore` : 'New courses coming soon'}
            </p>
          </div>
          {status.loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : status.error ? (
            <div className="alert alert-danger" role="alert">
              {status.error}
            </div>
          ) : (
            <div className="row g-4">
              {courses.map((course) => (
                <div className="col-md-6 col-lg-4" key={course.id}>
                  <div className="card h-100 shadow-sm">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.name} className="card-img-top" />
                    ) : (
                      <div className="card-img-top bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center text-muted py-5">
                        Thumbnail coming soon
                      </div>
                    )}
                    <div className="card-body d-flex flex-column">
                      <h3 className="h5 fw-semibold">{course.name}</h3>
                      <p className="text-muted flex-grow-1">{course.description}</p>
                      <button
                        className="btn btn-outline-primary mt-3"
                        onClick={() => handleViewCourse(course.id)}
                        disabled={enrolling}
                      >
                        {enrolling ? 'Enrolling...' : 'View Course'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-info">No courses available yet. Check back soon.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

