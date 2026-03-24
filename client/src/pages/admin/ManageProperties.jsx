import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/helpers';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaStar, FaSearch, FaUndo } from 'react-icons/fa';
import './ManageProperties.css';

const STATUS_COLORS = { approved: 'success', pending: 'warning', rejected: 'danger' };

export default function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const res = await propertyAPI.getAll({ limit: 500 });
      const list = res.properties || res || [];
      setProperties(list);
    } catch {
      showToast('Failed to load properties.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  useEffect(() => {
    let list = [...properties];
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [properties, search, statusFilter]);

  const handleApprove = async (id) => {
    try {
      await propertyAPI.approve(id);
      setProperties(ps => ps.map(p => p._id === id ? { ...p, status: 'approved' } : p));
      showToast('Property approved ✅');
    } catch { showToast('Action failed.'); }
  };

  const handleUnapprove = async (id) => {
    try {
      await propertyAPI.unapprove(id);
      setProperties(ps => ps.map(p => p._id === id ? { ...p, status: 'pending' } : p));
      showToast('Property moved back to pending.');
    } catch { showToast('Action failed.'); }
  };

  const handleReject = async (id) => {
    try {
      await propertyAPI.update(id, { status: 'rejected' });
      setProperties(ps => ps.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
      showToast('Property rejected.');
    } catch { showToast('Action failed.'); }
  };

  const handleFeature = async (id, current) => {
    try {
      await propertyAPI.toggleFeatured(id);
      setProperties(ps => ps.map(p => p._id === id ? { ...p, featured: !current } : p));
      showToast(current ? 'Removed from featured.' : 'Marked as featured ⭐');
    } catch { showToast('Action failed.'); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await propertyAPI.delete(id);
      setProperties(ps => ps.filter(p => p._id !== id));
      showToast('Property deleted.');
    } catch { showToast('Delete failed.'); }
  };

  return (
    <div className="mp-page">
      {toast && <div className="mp-toast">{toast}</div>}

      <div className="mp-header">
        <div>
          <h1 className="mp-title">Manage Properties</h1>
          <p className="mp-sub">{filtered.length} of {properties.length} properties</p>
        </div>
        <Link to="/admin/properties/add" className="btn btn-primary mp-add-btn">
          <FaPlus /> Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="mp-filters">
        <div className="mp-search-wrap">
          <FaSearch className="mp-search-icon" />
          <input
            type="text"
            className="form-control mp-search"
            placeholder="Search by title, location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="mp-status-pills">
          {['all', 'approved', 'pending', 'rejected'].map(s => (
            <button
              key={s}
              className={`mp-pill ${statusFilter === s ? 'mp-pill--active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mp-loading"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p>No properties found.</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table mp-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td className="mp-prop-title" title={p.title}>{p.title}</td>
                  <td><span className="badge badge-secondary">{p.type}</span></td>
                  <td className="mp-location">{p.location}</td>
                  <td>₹{formatPrice(p.price)}</td>
                  <td>
                    <span className={`badge badge-${STATUS_COLORS[p.status] || 'secondary'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`mp-feature-btn ${p.featured ? 'mp-feature-btn--on' : ''}`}
                      onClick={() => handleFeature(p._id, p.featured)}
                      title={p.featured ? 'Remove featured' : 'Mark featured'}
                    >
                      <FaStar />
                    </button>
                  </td>
                  <td className="mp-date">{formatDate(p.createdAt)}</td>
                  <td>
                    <div className="mp-actions">
                      {p.status === 'pending' && (
                        <>
                          <button className="mp-btn mp-btn--approve" onClick={() => handleApprove(p._id)} title="Approve"><FaCheck /></button>
                          <button className="mp-btn mp-btn--reject" onClick={() => handleReject(p._id)} title="Reject"><FaTimes /></button>
                        </>
                      )}
                      {p.status === 'approved' && (
                        <button className="mp-btn mp-btn--unapprove" onClick={() => handleUnapprove(p._id)} title="Unapprove (move to pending)"><FaUndo /></button>
                      )}
                      {p.status === 'rejected' && (
                        <button className="mp-btn mp-btn--approve" onClick={() => handleApprove(p._id)} title="Re-approve"><FaCheck /></button>
                      )}
                      <Link to={`/admin/properties/edit/${p._id}`} className="mp-btn mp-btn--edit" title="Edit">
                        <FaEdit />
                      </Link>
                      <button className="mp-btn mp-btn--delete" onClick={() => handleDelete(p._id, p.title)} title="Delete"><FaTrash /></button>
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
