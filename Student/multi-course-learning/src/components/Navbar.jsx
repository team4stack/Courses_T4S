import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const { profile, signOut, loading } = useAuth();

  const closeMenu = () => setExpanded(false);

  const handleToggle = () => setExpanded((prev) => !prev);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('[Navbar] Failed to sign out', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          MultiCourse Hub
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="mainNavbar"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
          onClick={handleToggle}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse${expanded ? ' show' : ''}`} id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/courses" onClick={closeMenu}>
                Courses
              </NavLink>
            </li>
            {profile && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile" onClick={closeMenu}>
                  Profile
                </NavLink>
              </li>
            )}
            {/* Admin panel link removed from navbar - only accessible via direct URL */}
          </ul>
          <div className="d-flex gap-3 align-items-center">
            {!loading && profile ? (
              <>
                <span className="text-secondary small">Hi, {profile.name}</span>
                <button className="btn btn-outline-primary btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link className="btn btn-primary btn-sm" to="/login" onClick={closeMenu}>
                  Login / Sign Up
                </Link>
                <Link className="btn btn-outline-secondary btn-sm" to="/admin-login" onClick={closeMenu}>
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

