import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorAlert from '../../components/ErrorAlert';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/recipes');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    background:
      'radial-gradient(circle at top left, #1e1b4b 0, #020617 45%, #020617 100%)',
    color: '#e5e7eb',
    fontFamily:
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  const cardWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 420,
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: 24,
    padding: '2rem 1.75rem',
    background:
      'radial-gradient(circle at top, #020617, #020617 55%, #111827 100%)',
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(148, 163, 184, 0.4)',
  };

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.2rem 0.8rem',
    borderRadius: '999px',
    background: 'rgba(92, 107, 242, 0.18)',
    color: '#c7d2fe',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '1rem',
  };

  const dotStyle: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: '999px',
    background: '#f4a261',
    boxShadow: '0 0 10px rgba(244, 162, 97, 0.9)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '0.4rem',
    color: '#f9fafb',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: '#9ca3af',
    marginBottom: '1.5rem',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#e5e7eb',
    marginBottom: '0.25rem',
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#020617',
    borderRadius: 12,
    border: '1px solid rgba(148, 163, 184, 0.7)',
    color: '#e5e7eb',
    fontSize: '0.9rem',
  };

  const hintStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  };

  const buttonStyle: React.CSSProperties = {
    borderRadius: '999px',
    padding: '0.65rem 1.4rem',
    background:
      'linear-gradient(120deg, #5c6bf2, #6366f1)',
    border: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    boxShadow: '0 16px 40px rgba(79, 70, 229, 0.6)',
  };

  const footerTextStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    color: '#9ca3af',
  };

  const footerLinkStyle: React.CSSProperties = {
    color: '#c7d2fe',
    textDecoration: 'none',
    fontWeight: 600,
  };

  return (
    <div style={pageStyle}>
      <div style={cardWrapperStyle}>
        <div style={cardStyle}>
          {/* Header */}
          <div className="mb-4 text-center text-md-start">
            <div style={badgeStyle}>
              <span style={dotStyle} />
              <span>Recipes App · Login</span>
            </div>
            <h2 style={titleStyle}>Welcome back</h2>
            <p style={subtitleStyle}>
              Log in to access your saved favorites, manage recipes, and continue where you left off.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3">
              <ErrorAlert message={error} onClose={() => setError(null)} />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <div style={hintStyle}>Make sure no one is looking over your shoulder 😉</div>
            </div>

            <button
              className="btn w-100 mt-2"
              type="submit"
              style={buttonStyle}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="mt-3 mb-0 text-center" style={footerTextStyle}>
              No account yet?{' '}
              <Link to="/register" style={footerLinkStyle}>
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
