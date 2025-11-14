import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabaseClient.js';
import { useAuth } from '../hooks/useAuth.js';

const defaultCourseForm = {
  name: '',
  description: '',
  intro_video_url: '',
  thumbnail_url: '',
};

const defaultVideoForm = {
  course_id: '',
  title: '',
  description: '',
  video_url: '',
  thumbnail_url: '',
  order: 1,
};

const defaultTestForm = {
  course_id: '',
  video_id: '',
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  answer: '',
};

const AdminPanel = () => {
  const { profile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [courseForm, setCourseForm] = useState(defaultCourseForm);
  const [videoForm, setVideoForm] = useState(defaultVideoForm);
  const [testForm, setTestForm] = useState(defaultTestForm);
  const [progressRecords, setProgressRecords] = useState([]);
  const [status, setStatus] = useState({ message: null, variant: 'success' });

  const showStatus = useCallback((message, variant = 'success') => {
    setStatus({ message, variant });
    setTimeout(() => setStatus({ message: null, variant: 'success' }), 4000);
  }, []);

  const fetchCourses = useCallback(async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('id, name, description, intro_video_url, thumbnail_url')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }
    return data || [];
  }, []);

  const refreshCourses = useCallback(async () => {
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (error) {
      console.error('[AdminPanel] Failed to load courses', error);
      showStatus('Unable to load courses.', 'danger');
    }
  }, [fetchCourses, showStatus]);

  const fetchVideos = useCallback(async (courseId) => {
    if (!courseId) {
      return [];
    }
    const { data, error } = await supabase
      .from('videos')
      .select('id, course_id, title, order')
      .eq('course_id', courseId)
      .order('order', { ascending: true });

    if (error) {
      throw error;
    }
    return data || [];
  }, []);

  const refreshVideos = useCallback(
    async (courseId) => {
      if (!courseId) {
        setVideos([]);
        return;
      }
      try {
        const data = await fetchVideos(courseId);
        setVideos(data);
      } catch (error) {
        console.error('[AdminPanel] Failed to load videos', error);
        showStatus('Unable to load course videos.', 'danger');
      }
    },
    [fetchVideos, showStatus]
  );

  const fetchProgressRecords = useCallback(async () => {
    const { data, error } = await supabase
      .from('progress')
      .select(
        `
          id,
          completed,
          score,
          course_id,
          video_id,
          user_id,
          users ( name, email ),
          courses ( name ),
          videos ( title, order )
        `
      )
      .not('video_id', 'is', null)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }
    return data || [];
  }, []);

  const refreshProgressRecords = useCallback(async () => {
    try {
      const data = await fetchProgressRecords();
      setProgressRecords(data);
    } catch (error) {
      console.error('[AdminPanel] Failed to load progress records', error);
      showStatus('Unable to load student progress.', 'danger');
    }
  }, [fetchProgressRecords, showStatus]);

  useEffect(() => {
    let isMounted = true;
    const initialise = async () => {
      try {
        const [courseList, progressList] = await Promise.all([fetchCourses(), fetchProgressRecords()]);
        if (!isMounted) return;
        setCourses(courseList);
        setProgressRecords(progressList);
      } catch (error) {
        console.error('[AdminPanel] Initial load failed', error);
        if (isMounted) {
          showStatus('Unable to load admin data.', 'danger');
        }
      }
    };
    initialise();
    return () => {
      isMounted = false;
    };
  }, [fetchCourses, fetchProgressRecords, showStatus]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!testForm.course_id) {
        if (isMounted) setVideos([]);
        return;
      }
      try {
        const data = await fetchVideos(testForm.course_id);
        if (isMounted) {
          setVideos(data);
        }
      } catch (error) {
        console.error('[AdminPanel] Failed to load videos', error);
        if (isMounted) {
          showStatus('Unable to load course videos.', 'danger');
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [testForm.course_id, fetchVideos, showStatus]);

  const handleCourseChange = (event) => {
    const { name, value } = event.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (event) => {
    const { name, value } = event.target;
    setVideoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestChange = (event) => {
    const { name, value } = event.target;
    setTestForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = async (event) => {
    event.preventDefault();
    const { error } = await supabase.from('courses').insert(courseForm);
    if (error) {
      console.error('[AdminPanel] Failed to add course', error);
      showStatus(error.message || 'Unable to add course.', 'danger');
      return;
    }
    showStatus('Course added successfully.');
    setCourseForm(defaultCourseForm);
    refreshCourses();
  };

  const handleAddVideo = async (event) => {
    event.preventDefault();
    const payload = {
      ...videoForm,
      course_id: videoForm.course_id || null,
      order: Number(videoForm.order) || 1,
    };
    const { error } = await supabase.from('videos').insert(payload);
    if (error) {
      console.error('[AdminPanel] Failed to add video', error);
      showStatus(error.message || 'Unable to add video.', 'danger');
      return;
    }
    showStatus('Video added successfully.');
    setVideoForm({ ...defaultVideoForm, course_id: videoForm.course_id });
    refreshVideos(payload.course_id);
  };

  const handleAddTest = async (event) => {
    event.preventDefault();
    const options = [testForm.optionA, testForm.optionB, testForm.optionC, testForm.optionD].filter(Boolean);
    const payload = {
      video_id: testForm.video_id || null,
      question: testForm.question,
      options,
      answer: testForm.answer,
    };

    const { error } = await supabase.from('tests').insert(payload);
    if (error) {
      console.error('[AdminPanel] Failed to add test', error);
      showStatus(error.message || 'Unable to add test.', 'danger');
      return;
    }
    showStatus('Test added successfully.');
    setTestForm(defaultTestForm);
  };

  const handleApproveProgress = async (record) => {
    const { error } = await supabase
      .from('progress')
      .update({ completed: true })
      .eq('id', record.id);
    if (error) {
      console.error('[AdminPanel] Failed to approve progress', error);
      showStatus('Unable to approve test results.', 'danger');
      return;
    }

    if (record.videos?.order != null) {
      const { data: nextVideos, error: nextError } = await supabase
        .from('videos')
        .select('id, course_id, order')
        .eq('course_id', record.course_id)
        .gt('order', record.videos.order)
        .order('order', { ascending: true })
        .limit(1);

      if (!nextError && nextVideos && nextVideos.length > 0) {
        const nextVideo = nextVideos[0];
        const { error: progressError } = await supabase.from('progress').upsert(
          {
            user_id: record.user_id,
            course_id: record.course_id,
            video_id: nextVideo.id,
            completed: false,
          },
          { onConflict: 'user_id,video_id' }
        );
        if (progressError) {
          console.error('[AdminPanel] Failed to unlock next video', progressError);
        }
      }
    }

    showStatus('Progress approved and next video unlocked (if available).');
    refreshProgressRecords();
  };

  const pendingProgress = useMemo(
    () => progressRecords.filter((record) => record.completed === false),
    [progressRecords]
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold">Admin Panel</h1>
        <span className="badge text-bg-primary text-uppercase">
          {profile?.role === 'admin' ? 'Administrator' : 'Staff'}
        </span>
      </div>

      {status.message && (
        <div className={`alert alert-${status.variant}`} role="alert">
          {status.message}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h4 fw-semibold mb-3">Add New Course</h2>
              <form onSubmit={handleAddCourse} className="row g-3">
                <div className="col-12">
                  <label className="form-label" htmlFor="course-name">
                    Course Name
                  </label>
                  <input
                    id="course-name"
                    name="name"
                    className="form-control"
                    value={courseForm.name}
                    onChange={handleCourseChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="course-description">
                    Description
                  </label>
                  <textarea
                    id="course-description"
                    name="description"
                    className="form-control"
                    rows="3"
                    value={courseForm.description}
                    onChange={handleCourseChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="course-intro">
                    Intro Video URL
                  </label>
                  <input
                    id="course-intro"
                    name="intro_video_url"
                    type="url"
                    className="form-control"
                    placeholder="https://youtube.com/embed/..."
                    value={courseForm.intro_video_url}
                    onChange={handleCourseChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="course-thumbnail">
                    Thumbnail URL
                  </label>
                  <input
                    id="course-thumbnail"
                    name="thumbnail_url"
                    type="url"
                    className="form-control"
                    value={courseForm.thumbnail_url}
                    onChange={handleCourseChange}
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-primary w-100" type="submit">
                    Save Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h4 fw-semibold mb-3">Add Course Video</h2>
              <form onSubmit={handleAddVideo} className="row g-3">
                <div className="col-12">
                  <label className="form-label" htmlFor="video-course">
                    Course
                  </label>
                  <select
                    id="video-course"
                    name="course_id"
                    className="form-select"
                    value={videoForm.course_id}
                    onChange={handleVideoChange}
                    required
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="video-title">
                    Video Title
                  </label>
                  <input
                    id="video-title"
                    name="title"
                    className="form-control"
                    value={videoForm.title}
                    onChange={handleVideoChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="video-description">
                    Description
                  </label>
                  <textarea
                    id="video-description"
                    name="description"
                    className="form-control"
                    rows="2"
                    value={videoForm.description}
                    onChange={handleVideoChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="video-url">
                    Video URL
                  </label>
                  <input
                    id="video-url"
                    name="video_url"
                    type="url"
                    className="form-control"
                    placeholder="https://youtube.com/embed/..."
                    value={videoForm.video_url}
                    onChange={handleVideoChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="video-thumbnail">
                    Thumbnail URL
                  </label>
                  <input
                    id="video-thumbnail"
                    name="thumbnail_url"
                    type="url"
                    className="form-control"
                    value={videoForm.thumbnail_url}
                    onChange={handleVideoChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="video-order">
                    Order
                  </label>
                  <input
                    id="video-order"
                    name="order"
                    type="number"
                    min="1"
                    className="form-control"
                    value={videoForm.order}
                    onChange={handleVideoChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-primary w-100" type="submit">
                    Save Video
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h4 fw-semibold mb-3">Add Video Test</h2>
              <form onSubmit={handleAddTest} className="row g-3">
                <div className="col-md-4">
                  <label className="form-label" htmlFor="test-course">
                    Course
                  </label>
                  <select
                    id="test-course"
                    name="course_id"
                    className="form-select"
                    value={testForm.course_id}
                    onChange={handleTestChange}
                    required
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="test-video">
                    Video
                  </label>
                  <select
                    id="test-video"
                    name="video_id"
                    className="form-select"
                    value={testForm.video_id}
                    onChange={handleTestChange}
                    required
                  >
                    <option value="">Select video</option>
                    {videos
                      .filter((video) => !testForm.course_id || video.course_id === testForm.course_id)
                      .map((video) => (
                        <option key={video.id} value={video.id}>
                          {video.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="test-answer">
                    Correct Answer
                  </label>
                  <input
                    id="test-answer"
                    name="answer"
                    className="form-control"
                    placeholder="A, B, C, or D"
                    value={testForm.answer}
                    onChange={handleTestChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="test-question">
                    Question
                  </label>
                  <textarea
                    id="test-question"
                    name="question"
                    className="form-control"
                    rows="2"
                    value={testForm.question}
                    onChange={handleTestChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <label className="form-label" htmlFor="optionA">
                    Option A
                  </label>
                  <input
                    id="optionA"
                    name="optionA"
                    className="form-control"
                    value={testForm.optionA}
                    onChange={handleTestChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <label className="form-label" htmlFor="optionB">
                    Option B
                  </label>
                  <input
                    id="optionB"
                    name="optionB"
                    className="form-control"
                    value={testForm.optionB}
                    onChange={handleTestChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <label className="form-label" htmlFor="optionC">
                    Option C
                  </label>
                  <input
                    id="optionC"
                    name="optionC"
                    className="form-control"
                    value={testForm.optionC}
                    onChange={handleTestChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <label className="form-label" htmlFor="optionD">
                    Option D
                  </label>
                  <input
                    id="optionD"
                    name="optionD"
                    className="form-control"
                    value={testForm.optionD}
                    onChange={handleTestChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-primary" type="submit">
                    Save Test
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 fw-semibold mb-0">Pending Test Approvals</h2>
              <span className="badge text-bg-warning">{pendingProgress.length}</span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Student</th>
                    <th scope="col">Course</th>
                    <th scope="col">Video</th>
                    <th scope="col">Score</th>
                    <th scope="col" className="text-end">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProgress.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <div className="fw-semibold">{record.users?.name}</div>
                        <div className="small text-muted">{record.users?.email}</div>
                      </td>
                      <td>{record.courses?.name}</td>
                      <td>{record.videos?.title}</td>
                      <td>{record.score ?? 'N/A'}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApproveProgress(record)}
                        >
                          Approve & Unlock Next
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingProgress.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        No pending approvals.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;

