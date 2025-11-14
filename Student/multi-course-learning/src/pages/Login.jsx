import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Login = () => {
  const { profile, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [status, setStatus] = useState({ loading: false, error: null });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && profile) {
      const redirect =
        (location.state && location.state.redirectTo) ||
        (profile.role === 'admin' ? '/admin' : '/courses');
      navigate(redirect, { replace: true });
    }
  }, [profile, loading, navigate, location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: null });

    try {
      if (mode === 'login') {
        await signIn({ email: form.email, password: form.password });
      } else {
        await signUp({ email: form.email, password: form.password, name: form.name });
      }
    } catch (error) {
      setStatus({ loading: false, error: error.message || 'Something went wrong. Please try again.' });
      return;
    }

    setStatus({ loading: false, error: null });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="h3 fw-bold text-center mb-4">
                {mode === 'login' ? 'Log in to continue learning' : 'Create your student account'}
              </h1>
              {status.error && (
                <div className="alert alert-danger" role="alert">
                  {status.error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                {mode === 'signup' && (
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={status.loading}>
                  {status.loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              </form>
              <p className="text-center mt-4 small text-muted">
                {mode === 'login' ? 'New to MultiCourse Hub?' : 'Already have an account?'}
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none ms-1"
                  onClick={() => setMode((prev) => (prev === 'login' ? 'signup' : 'login'))}
                >
                  {mode === 'login' ? 'Create an account' : 'Log in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;