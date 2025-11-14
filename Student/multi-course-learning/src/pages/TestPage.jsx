import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient.js';
import { useAuth } from '../hooks/useAuth.js';

const TestPage = () => {
  const { courseId, videoId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [test, setTest] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [status, setStatus] = useState({ loading: true, error: null, success: null });

  useEffect(() => {
    const loadTest = async () => {
      setStatus({ loading: true, error: null, success: null });
      try {
        const { data, error } = await supabase
          .from('tests')
          .select('id, question, options, answer')
          .eq('video_id', videoId)
          .maybeSingle();
        if (error) {
          throw error;
        }
        if (!data) {
          setStatus({ loading: false, error: 'No test found for this video.', success: null });
          return;
        }
        setTest(data);
        setStatus({ loading: false, error: null, success: null });
      } catch (err) {
        console.error('[TestPage] Failed to load test', err);
        setStatus({ loading: false, error: 'Unable to load test right now.', success: null });
      }
    };

    loadTest();
  }, [videoId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedOption) {
      setStatus((prev) => ({ ...prev, error: 'Please select an answer before submitting.' }));
      return;
    }

    const isCorrect = test.answer.trim().toLowerCase() === selectedOption.trim().toLowerCase();
    const score = isCorrect ? 100 : 0;

    try {
      const { error } = await supabase.from('progress').upsert(
        {
          user_id: session.user.id,
          course_id: courseId,
          video_id: videoId,
          score,
          completed: false,
        },
        { onConflict: 'user_id,video_id' }
      );

      if (error) throw error;

      setStatus({
        loading: false,
        error: null,
        success: isCorrect
          ? 'Great job! Your answers will be reviewed by an instructor.'
          : 'Submitted. Review your answers and await instructor feedback.',
      });

      setTimeout(() => {
        navigate(`/courses/${courseId}`);
      }, 2000);
    } catch (err) {
      console.error('[TestPage] Failed to submit answers', err);
      setStatus({ loading: false, error: 'Unable to submit your answers right now.', success: null });
    }
  };

  if (status.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (status.error && !test) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {status.error}
        </div>
      </div>
    );
  }

  if (!test) {
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="h4 fw-bold mb-3">Video Assessment</h1>
              <p className="text-muted">Answer the question below to continue your learning journey.</p>
              {status.error && (
                <div className="alert alert-danger" role="alert">
                  {status.error}
                </div>
              )}
              {status.success && (
                <div className="alert alert-success" role="alert">
                  {status.success}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h2 className="h5">{test.question}</h2>
                </div>
                <div className="list-group mb-4">
                  {test.options?.map((option, index) => (
                    <label
                      key={option}
                      className={`list-group-item list-group-item-action ${
                        selectedOption === option ? 'active' : ''
                      }`}
                    >
                      <input
                        className="form-check-input me-2"
                        type="radio"
                        name="testOption"
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => setSelectedOption(option)}
                      />
                      <span className="fw-semibold me-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </label>
                  ))}
                </div>
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Answers
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;

