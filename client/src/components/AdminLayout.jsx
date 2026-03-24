import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  FaTachometerAlt, FaHome, FaClipboardList, FaUsers,
  FaPlusCircle, FaSignOutAlt, FaBars, FaTimes, FaKey,
} from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { to: '/admin/properties', icon: <FaHome />, label: 'Properties' },
  { to: '/admin/properties/add', icon: <FaPlusCircle />, label: 'Add Property' },
  { to: '/admin/leads', icon: <FaClipboardList />, label: 'Leads' },
  { to: '/admin/users', icon: <FaUsers />, label: 'Users' },
  { to: '/admin/change-password', icon: <FaKey />, label: 'Change Password' },
];

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <span className="admin-logo">🏠 StayDost</span>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin/dashboard'}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>
          <h1 className="topbar-title">Admin Panel</h1>
          <div className="topbar-right">
            <span className="topbar-badge">Admin</span>
          </div>
        </header>

        <main className="admin-content">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
