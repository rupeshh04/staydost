import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI, leadAPI, userAPI } from '../../services/api';
import { formatDate, timeAgo } from '../../utils/helpers';
import { FaHome, FaClock, FaUsers, FaPhoneAlt, FaPlus, FaCheckCircle } from 'react-icons/fa';
import './Dashboard.css';

function StatCard({ icon, label, value, color, link }) {
  const card = (
    <div className="dash-stat-card" style={{ borderTopColor: color }}>
      <div className="dash-stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
      <div>
        <div className="dash-stat-value">{value ?? '…'}</div>
        <div className="dash-stat-label">{label}</div>
      </div>
    </div>
  );
  return link ? <Link to={link} className="dash-stat-link">{card}</Link> : card;
}

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentLeads, setRecentLeads] = useState([]);
  const [pendingProps, setPendingProps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [propsRes, leadsRes, usersRes] = await Promise.all([
          propertyAPI.getAll({ limit: 200 }),
          leadAPI.getAll({ limit: 200 }),
          userAPI.getAll(),
        ]);

        const allProps = propsRes.properties || propsRes || [];
        const allLeads = leadsRes.leads || leadsRes || [];
        const allUsers = usersRes.users || usersRes || [];

        const approved = allProps.filter(p => p.status === 'approved').length;
        const pending = allProps.filter(p => p.status === 'pending').length;
        const newLeads = allLeads.filter(l => l.status === 'new').length;

        setStats({ total: allProps.length, approved, pending, leads: allLeads.length, newLeads, users: allUsers.length });
        setRecentLeads(allLeads.slice(0, 6));
        setPendingProps(allProps.filter(p => p.status === 'pending').slice(0, 5));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="dash-loading"><div className="spinner" /></div>;

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-sub">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <Link to="/admin/properties/add" className="btn btn-primary dash-add-btn">
          <FaPlus /> Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <StatCard icon={<FaHome />} label="Total Properties" value={stats.total} color="#1d3557" link="/admin/properties" />
        <StatCard icon={<FaClock />} label="Pending Review" value={stats.pending} color="#f4a261" link="/admin/properties" />
        <StatCard icon={<FaPhoneAlt />} label="Total Leads" value={stats.leads} color="#e63946" link="/admin/leads" />
        <StatCard icon={<FaCheckCircle />} label="New Leads" value={stats.newLeads} color="#25d366" link="/admin/leads" />
        <StatCard icon={<FaUsers />} label="Users" value={stats.users} color="#6366f1" link="/admin/users" />
        <StatCard icon={<FaHome />} label="Live Listings" value={stats.approved} color="#06b6d4" link="/admin/properties" />
      </div>

      <div className="dash-two-col">
        {/* Recent Leads */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Recent Leads</h2>
            <Link to="/admin/leads" className="dash-view-all">View All →</Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="empty-state"><p>No leads yet.</p></div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Phone</th><th>Property</th><th>Status</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {recentLeads.map(l => (
                    <tr key={l._id}>
                      <td>{l.userName}</td>
                      <td><a href={`tel:${l.userPhone}`}>{l.userPhone}</a></td>
                      <td className="dash-prop-cell" title={l.propertyTitle}>{l.propertyTitle || '—'}</td>
                      <td><span className={`badge badge-${l.status === 'new' ? 'primary' : l.status === 'closed' ? 'success' : 'secondary'}`}>{l.status}</span></td>
                      <td className="dash-time">{timeAgo(l.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Properties */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Pending Approval</h2>
            <Link to="/admin/properties" className="dash-view-all">Manage →</Link>
          </div>
          {pendingProps.length === 0 ? (
            <div className="empty-state"><p>No pending properties.</p></div>
          ) : (
            <ul className="dash-pending-list">
              {pendingProps.map(p => (
                <li key={p._id} className="dash-pending-item">
                  <div className="dash-pending-info">
                    <div className="dash-pending-title">{p.title}</div>
                    <div className="dash-pending-meta">{p.location} · {formatDate(p.createdAt)}</div>
                  </div>
                  <Link to={`/admin/properties`} className="btn btn-sm btn-primary">Review</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
