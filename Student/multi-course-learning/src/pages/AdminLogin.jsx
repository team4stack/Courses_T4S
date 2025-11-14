import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const AdminLogin = () => {
  const { profile, loading, signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && profile) {
      // Only allow admin users to access the admin panel
      if (profile.role === 'admin') {
        const redirect = location.state?.redirectTo || '/admin';
        navigate(redirect, { replace: true });
      } else {
        // Non-admin users get redirected to the courses page
        navigate('/courses', { replace: true });
      }
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
      await signIn({ email: form.email, password: form.password });
    } catch (error) {
      setStatus({ loading: false, error: error.message || 'Invalid credentials. Please try again.' });
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
                Admin Login
              </h1>
              {status.error && (
                <div className="alert alert-danger" role="alert">
                  {status.error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="admin@example.com"
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
                  {status.loading ? 'Please wait...' : 'Log In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;