import { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { FaUserSlash, FaUserCheck, FaTrash, FaSearch } from 'react-icons/fa';
import './ManageUsers.css';

const ROLE_COLORS = { admin: 'primary', owner: 'warning', user: 'secondary' };

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userAPI.getAll();
      setUsers(res.users || res || []);
    } catch { showToast('Failed to load users.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    let list = [...users];
    if (roleFilter !== 'all') list = list.filter(u => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q)
      );
    }
    setFiltered(list);
  }, [users, search, roleFilter]);

  const handleToggle = async (user) => {
    if (user.role === 'admin') { showToast('Cannot deactivate admin.'); return; }
    try {
      await userAPI.toggle(user._id);
      setUsers(us => us.map(u => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
      showToast(user.isActive ? 'User deactivated.' : 'User activated.');
    } catch { showToast('Action failed.'); }
  };

  const handleDelete = async (id, name, role) => {
    if (role === 'admin') { showToast('Cannot delete admin.'); return; }
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await userAPI.delete(id);
      setUsers(us => us.filter(u => u._id !== id));
      showToast('User deleted.');
    } catch { showToast('Delete failed.'); }
  };

  return (
    <div className="mu-page">
      {toast && <div className="mu-toast">{toast}</div>}

      <div className="mu-header">
        <div>
          <h1 className="mu-title">Manage Users</h1>
          <p className="mu-sub">{filtered.length} of {users.length} users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mu-filters">
        <div className="mu-search-wrap">
          <FaSearch className="mu-search-icon" />
          <input
            type="text"
            className="form-control mu-search"
            placeholder="Search by name, email, phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="mu-role-pills">
          {['all', 'admin'].map(r => (
            <button
              key={r}
              className={`mu-pill ${roleFilter === r ? 'mu-pill--active' : ''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mu-loading"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p>No users found.</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table mu-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} className={!u.isActive ? 'mu-row--inactive' : ''}>
                  <td className="mu-name">{u.name}</td>
                  <td className="mu-email">{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td>
                    <span className={`badge badge-${ROLE_COLORS[u.role] || 'secondary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="mu-date">{formatDate(u.createdAt)}</td>
                  <td>
                    <div className="mu-actions">
                      <button
                        className={`mu-btn ${u.isActive ? 'mu-btn--deactivate' : 'mu-btn--activate'}`}
                        onClick={() => handleToggle(u)}
                        title={u.isActive ? 'Deactivate' : 'Activate'}
                        disabled={u.role === 'admin'}
                      >
                        {u.isActive ? <FaUserSlash /> : <FaUserCheck />}
                      </button>
                      <button
                        className="mu-btn mu-btn--delete"
                        onClick={() => handleDelete(u._id, u.name, u.role)}
                        title="Delete"
                        disabled={u.role === 'admin'}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
