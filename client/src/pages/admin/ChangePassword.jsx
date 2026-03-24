import { useState } from 'react';
import { authAPI } from '../../services/api';
import { FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import './ChangePassword.css';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState({ current: false, newP: false, confirm: false });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const toggle = key => setShow(s => ({ ...s, [key]: !s[key] }));

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    if (form.newPassword.length < 6) {
      setStatus('error'); setMsg('New password must be at least 6 characters.'); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus('error'); setMsg('New passwords do not match.'); return;
    }
    try {
      setStatus('loading');
      const res = await authAPI.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setStatus('success');
      setMsg(res.message || 'Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus('error');
      setMsg(err.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <div className="cp-page">
      <div className="cp-card">
        <div className="cp-icon-wrap"><FaKey className="cp-icon" /></div>
        <h1 className="cp-title">Change Password</h1>
        <p className="cp-sub">Update your admin account password below.</p>

        {status === 'success' && <div className="cp-alert cp-alert--success">{msg}</div>}
        {status === 'error'   && <div className="cp-alert cp-alert--error">{msg}</div>}

        <form onSubmit={handleSubmit} noValidate className="cp-form">
          <div className="form-group cp-field">
            <label>Current Password</label>
            <div className="cp-input-wrap">
              <input
                name="currentPassword"
                type={show.current ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={handleChange}
                required
              />
              <button type="button" className="cp-eye" onClick={() => toggle('current')}>
                {show.current ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group cp-field">
            <label>New Password</label>
            <div className="cp-input-wrap">
              <input
                name="newPassword"
                type={show.newP ? 'text' : 'password'}
                className="form-control"
                placeholder="Min. 6 characters"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
              <button type="button" className="cp-eye" onClick={() => toggle('newP')}>
                {show.newP ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group cp-field">
            <label>Confirm New Password</label>
            <div className="cp-input-wrap">
              <input
                name="confirmPassword"
                type={show.confirm ? 'text' : 'password'}
                className="form-control"
                placeholder="Repeat new password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="button" className="cp-eye" onClick={() => toggle('confirm')}>
                {show.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary cp-submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Saving…' : '🔒 Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
