import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient.js';
import { useAuth } from '../hooks/useAuth.js';
import ProgressBar from '../components/ProgressBar.jsx';
import Certificate from '../components/Certificate.jsx';

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { session, profile, enrollInCourse } = useAuth();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCourse = useCallback(async () => {
    if (!courseId || !session?.user) return;
    setLoading(true);
    setError(null);

    try {
      // Check if user is enrolled in this course
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('progress')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('course_id', courseId)
        .is('video_id', null)
        .maybeSingle();

      if (enrollmentError) throw enrollmentError;

      // If not enrolled and not admin, redirect or show error
      if (!enrollment && profile?.role !== 'admin') {
        setError('You are not enrolled in this course. Please enroll first.');
        setLoading(false);
        return;
      }

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, name, description, intro_video_url')
        .eq('id', courseId)
        .maybeSingle();

      if (courseError) throw courseError;
      if (!courseData) {
        setError('Course not found.');
        setLoading(false);
        return;
      }
      setCourse(courseData);

      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('id, title, description, video_url, thumbnail_url, order')
        .eq('course_id', courseId)
        .order('order', { ascending: true });

      if (videosError) throw videosError;
      setVideos(videosData || []);

      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select('id, video_id, completed, score')
        .eq('user_id', session.user.id)
        .eq('course_id', courseId);

      if (progressError) throw progressError;
      setProgressRecords(progressData || []);

      if (videosData && videosData.length > 0) {
        setSelectedVideoId(videosData[0].id);

        const hasInitialProgress = (progressData || []).some((row) => row.video_id === videosData[0].id);
        if (!hasInitialProgress) {
          await supabase.from('progress').upsert(
            {
              user_id: session.user.id,
              course_id: courseId,
              video_id: videosData[0].id,
              completed: false,
            },
            { onConflict: 'user_id,video_id' }
          );
        }
      }
    } catch (err) {
      console.error('[CourseView] Failed to load course', err);
      setError('Unable to load course content right now.');
    } finally {
      setLoading(false);
    }
  }, [courseId, session?.user, profile?.role]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const progressByVideo = useMemo(() => {
    const map = new Map();
    progressRecords.forEach((record) => {
      if (record.video_id) {
        map.set(record.video_id, record);
      }
    });
    return map;
  }, [progressRecords]);

  const completedCount = useMemo(
    () => progressRecords.filter((record) => record.video_id && record.completed).length,
    [progressRecords]
  );

  const unlockedVideoIds = useMemo(
    () => new Set(progressRecords.filter((record) => record.video_id).map((record) => record.video_id)),
    [progressRecords]
  );

  const totalVideos = videos.length;
  const courseCompleted = totalVideos > 0 && completedCount === totalVideos;

  const handleSelectVideo = (videoId, unlocked) => {
    if (!unlocked) return;
    setSelectedVideoId(videoId);
  };

  const handleRequestReview = async (videoId) => {
    try {
      const { error: updateError } = await supabase.from('progress').upsert(
        {
          user_id: session.user.id,
          course_id: courseId,
          video_id: videoId,
          completed: false,
        },
        { onConflict: 'user_id,video_id' }
      );
      if (updateError) throw updateError;
      await loadCourse();
    } catch (err) {
      console.error('[CourseView] Failed to update progress', err);
      setError('Unable to update progress. Please try again.');
    }
  };

  const handleOpenTest = (videoId) => {
    navigate(`/courses/${courseId}/tests/${videoId}`);
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
    const isEnrollmentError = error.includes('not enrolled');
    return (
      <div className="container py-5">
        <div className={`alert ${isEnrollmentError ? 'alert-warning' : 'alert-danger'}`} role="alert">
          <p className="mb-3">{error}</p>
          {isEnrollmentError && session?.user && (
            <button
              className="btn btn-primary"
              onClick={async () => {
                try {
                  await enrollInCourse(courseId);
                  await loadCourse();
                } catch (err) {
                  console.error('[CourseView] Failed to enroll', err);
                  setError('Unable to enroll. Please try again.');
                }
              }}
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const selectedVideo = videos.find((video) => video.id === selectedVideoId) || videos[0];
  const selectedProgress = selectedVideo ? progressByVideo.get(selectedVideo.id) : null;
  const selectedUnlocked = selectedVideo ? unlockedVideoIds.has(selectedVideo.id) || selectedVideo === videos[0] : false;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h1 className="h3 fw-bold mb-3">{course.name}</h1>
              <p className="text-muted">{course.description}</p>
              <ProgressBar completed={completedCount} total={totalVideos} />
              <p className="small text-muted mt-2">
                {completedCount} of {totalVideos} videos approved
              </p>
            </div>
          </div>

          {courseCompleted && profile && (
            <Certificate courseName={course.name} studentName={profile.name} />
          )}

          {selectedVideo && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h4 fw-semibold">{selectedVideo.title}</h2>
                <p className="text-muted">{selectedVideo.description}</p>
                <div className="ratio ratio-16x9 mb-3">
                  <iframe
                    src={selectedVideo.video_url}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleRequestReview(selectedVideo.id)}
                    disabled={!selectedUnlocked}
                  >
                    Mark as Watched
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOpenTest(selectedVideo.id)}
                    disabled={!selectedUnlocked}
                  >
                    Take Test
                  </button>
                  {selectedProgress && (
                    <span className={`badge ${selectedProgress.completed ? 'text-bg-success' : 'text-bg-warning'}`}>
                      {selectedProgress.completed ? 'Approved' : 'Pending Approval'}
                    </span>
                  )}
                  {selectedProgress?.score != null && (
                    <span className="badge text-bg-info">
                      Score: {selectedProgress.score}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-3">Course Content</h2>
              <div className="list-group">
                {videos.map((video, index) => {
                  const progress = progressByVideo.get(video.id);
                  const unlocked =
                    index === 0 ||
                    progressByVideo.has(video.id) ||
                    (index > 0 && progressByVideo.get(videos[index - 1].id)?.completed);
                  const active = selectedVideoId === video.id;
                  return (
                    <button
                      key={video.id}
                      type="button"
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                        active ? 'active' : ''
                      } ${!unlocked ? 'disabled' : ''}`}
                      onClick={() => handleSelectVideo(video.id, unlocked)}
                    >
                      <div className="text-start">
                        <div className="fw-semibold">{video.title}</div>
                        <div className="small text-muted">
                          {progress?.completed ? 'Approved' : unlocked ? 'In progress' : 'Locked'}
                        </div>
                      </div>
                      {progress?.score != null && (
                        <span className="badge text-bg-light text-dark">Score {progress.score}</span>
                      )}
                    </button>
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

export default CourseView;

