import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Both fields are required.'); return; }
    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-page">
      <div className="al-card">
        <div className="al-brand">
          <span className="al-brand-icon">🏠</span>
          <span className="al-brand-name">StayDost</span>
          <span className="al-brand-badge">Admin</span>
        </div>

        <h1 className="al-title">Welcome Back</h1>
        <p className="al-sub">Sign in to access the admin panel</p>

        <form className="al-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="al-email">Email</label>
            <div className="al-input-wrap">
              <FaEnvelope className="al-input-icon" />
              <input
                id="al-email"
                name="email"
                type="email"
                className="form-control al-input"
                placeholder="admin@staydost.com"
                autoComplete="username"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="al-pwd">Password</label>
            <div className="al-input-wrap">
              <FaLock className="al-input-icon" />
              <input
                id="al-pwd"
                name="password"
                type={showPwd ? 'text' : 'password'}
                className="form-control al-input"
                placeholder="••••••••"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="al-toggle-pwd"
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <p className="al-error">{error}</p>}

          <button type="submit" className="btn btn-primary al-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* <p className="al-hint">Default: admin@staydost.com / admin123</p> */}
      </div>
    </div>
  );
}
