import { useState, useEffect, useCallback } from 'react';
import { leadAPI } from '../../services/api';
import { formatDate, timeAgo } from '../../utils/helpers';
import { FaPhone, FaEnvelope, FaTrash, FaSearch, FaWhatsapp } from 'react-icons/fa';
import { whatsappLink } from '../../utils/helpers';
import './ManageLeads.css';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '917279937535';

const STATUSES = ['new', 'contacted', 'visit_scheduled', 'closed', 'cancelled'];
const STATUS_COLORS = {
  new: 'primary', contacted: 'secondary', visit_scheduled: 'warning',
  closed: 'success', cancelled: 'danger',
};

export default function ManageLeads() {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await leadAPI.getAll({ limit: 500 });
      setLeads(res.leads || res || []);
    } catch { showToast('Failed to load leads.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => {
    let list = [...leads];
    if (statusFilter !== 'all') list = list.filter(l => l.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l =>
        l.userName?.toLowerCase().includes(q) ||
        l.userPhone?.includes(q) ||
        l.propertyTitle?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [leads, search, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await leadAPI.update(id, { status: newStatus });
      setLeads(ls => ls.map(l => l._id === id ? { ...l, status: newStatus } : l));
      showToast('Status updated.');
    } catch { showToast('Update failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await leadAPI.delete(id);
      setLeads(ls => ls.filter(l => l._id !== id));
      showToast('Lead deleted.');
    } catch { showToast('Delete failed.'); }
  };

  const newCount = leads.filter(l => l.status === 'new').length;

  return (
    <div className="ml-page">
      {toast && <div className="ml-toast">{toast}</div>}

      <div className="ml-header">
        <div>
          <h1 className="ml-title">Manage Leads</h1>
          <p className="ml-sub">
            {filtered.length} of {leads.length} leads
            {newCount > 0 && <span className="ml-new-badge">{newCount} new</span>}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="ml-filters">
        <div className="ml-search-wrap">
          <FaSearch className="ml-search-icon" />
          <input
            type="text"
            className="form-control ml-search"
            placeholder="Search by name, phone, property…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="ml-status-pills">
          {['all', ...STATUSES].map(s => (
            <button
              key={s}
              className={`ml-pill ${statusFilter === s ? 'ml-pill--active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="ml-loading"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p>No leads found.</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table ml-table">
            <thead>
              <tr><th>Name</th><th>Contact</th><th>Property</th><th>Source</th><th>Status</th><th>Visit Date</th><th>Time</th><th>Del</th></tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l._id} className={l.status === 'new' ? 'ml-row--new' : ''}>
                  <td className="ml-name">{l.userName}</td>
                  <td>
                    <div className="ml-contact">
                      <a href={`tel:${l.userPhone}`} className="ml-contact-link" title="Call">
                        <FaPhone /> {l.userPhone}
                      </a>
                      {l.userEmail && (
                        <a href={`mailto:${l.userEmail}`} className="ml-contact-link ml-email" title={l.userEmail}>
                          <FaEnvelope />
                        </a>
                      )}
                      <a
                        href={whatsappLink(l.userPhone.startsWith('91') ? l.userPhone : `91${l.userPhone}`, `Hi ${l.userName}, this is StayDost regarding your enquiry about ${l.propertyTitle || 'our property'}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-wa-link"
                        title="WhatsApp"
                      >
                        <FaWhatsapp />
                      </a>
                    </div>
                  </td>
                  <td className="ml-prop" title={l.propertyTitle}>{l.propertyTitle || '—'}</td>
                  <td><span className="ml-source">{l.source?.replace('_', ' ')}</span></td>
                  <td>
                    <select
                      className="ml-status-select"
                      value={l.status}
                      onChange={e => handleStatusChange(l._id, e.target.value)}
                      style={{ '--status-color': `var(--badge-${STATUS_COLORS[l.status] || 'secondary'})` }}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="ml-visit">{l.visitDate ? formatDate(l.visitDate) : '—'}</td>
                  <td className="ml-time">{timeAgo(l.createdAt)}</td>
                  <td>
                    <button className="ml-del-btn" onClick={() => handleDelete(l._id)} title="Delete lead">
                      <FaTrash />
                    </button>
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
