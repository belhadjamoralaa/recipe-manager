import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navStyle: React.CSSProperties = {
    backdropFilter: 'blur(10px)',
    background:
      'linear-gradient(90deg, rgba(248, 250, 252, 0.9), rgba(239, 246, 255, 0.9))',
    borderBottom: '1px solid rgba(148, 163, 184, 0.35)',
  };

  const brandStyle: React.CSSProperties = {
    fontWeight: 800,
    letterSpacing: '0.04em',
    fontSize: '1.1rem',
    background:
      'linear-gradient(120deg, #2563eb, #7c3aed, #db2777, #ea580c)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textTransform: 'uppercase',
  };

  const linkBase =
    'nav-link px-3 py-2 d-flex align-items-center position-relative';
  const activeDotStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '6px',
    height: '6px',
    borderRadius: '999px',
    background: '#2563eb',
  };

  const authBtnBase =
    'btn btn-sm ms-2 d-flex align-items-center justify-content-center';

  const logoutBtnStyle: React.CSSProperties = {
    borderRadius: '999px',
    border: '1px solid rgba(148, 163, 184, 0.8)',
    background: '#0f172a',
    color: '#f9fafb',
    paddingInline: '1.1rem',
  };

  const profilePillStyle: React.CSSProperties = {
    borderRadius: '999px',
    background: 'rgba(226, 232, 240, 0.9)',
    color: '#0f172a',
    fontSize: '0.85rem',
    paddingInline: '0.9rem',
    paddingBlock: '0.45rem',
  };

  const ghostLinkStyle: React.CSSProperties = {
    borderRadius: '999px',
    paddingInline: '0.9rem',
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow-sm"
      style={navStyle}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span style={brandStyle}>Recipes App</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? 'fw-semibold text-primary' : 'text-secondary'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Home</span>
                    {isActive && <span style={activeDotStyle} />}
                  </>
                )}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/recipes"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? 'fw-semibold text-primary' : 'text-secondary'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Recipes</span>
                    {isActive && <span style={activeDotStyle} />}
                  </>
                )}
              </NavLink>
            </li>

            {isAuthenticated && (
              <li className="nav-item">
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? 'fw-semibold text-primary' : 'text-secondary'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>Favorites</span>
                      {isActive && <span style={activeDotStyle} />}
                    </>
                  )}
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right side auth section */}
          <ul className="navbar-nav ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <li className="nav-item me-1">
                  <Link className="nav-link p-0" to="/profile">
                    <div style={profilePillStyle}>
                      👤 {user?.username || 'Profile'}
                    </div>
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className={authBtnBase}
                    style={logoutBtnStyle}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <span style={ghostLinkStyle}>Login</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <span style={ghostLinkStyle}>Register</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
