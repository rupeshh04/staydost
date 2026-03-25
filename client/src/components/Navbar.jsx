import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBars, FaTimes, FaUserShield, FaSignOutAlt, FaSearch, FaEnvelope, FaPlusCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={close}>
          <span className="logo-icon">🏠</span>
          <span className="logo-text">
            Stay<span className="logo-accent">Dost</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="navbar-links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink></li>
          <li><NavLink to="/properties" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Browse</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contact</NavLink></li>
          <li><NavLink to="/submit-property" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>List Property</NavLink></li>
        </ul>

        {/* CTA area */}
        <div className="navbar-actions">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="btn btn-secondary btn-sm">
                <FaUserShield /> Admin
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="btn btn-primary btn-sm">
              Agent Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile dropdown menu (tablets: 769–900px) */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" end onClick={close} className="mobile-link">Home</NavLink>
          <NavLink to="/properties" onClick={close} className="mobile-link">Browse Properties</NavLink>
          <NavLink to="/contact" onClick={close} className="mobile-link">Contact</NavLink>
          <NavLink to="/submit-property" onClick={close} className="mobile-link">List Your Property</NavLink>
          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" onClick={close} className="mobile-link">Admin Dashboard</NavLink>
              <button className="mobile-link mobile-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/admin/login" onClick={close} className="mobile-link mobile-cta">Agent Login</NavLink>
          )}
        </div>
      )}

      {/* Bottom Tab Bar — phones only (≤768px) */}
      <div className="bottom-tabbar">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
          <FaHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="/properties" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
          <FaSearch />
          <span>Browse</span>
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
          <FaEnvelope />
          <span>Contact</span>
        </NavLink>
        <NavLink to="/submit-property" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
          <FaPlusCircle />
          <span>List</span>
        </NavLink>
        {isAdmin ? (
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
            <FaUserShield />
            <span>Admin</span>
          </NavLink>
        ) : (
          <NavLink to="/admin/login" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
            <FaUserShield />
            <span>Login</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
