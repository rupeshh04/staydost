import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaStar, FaShieldAlt, FaHandshake, FaHeadset } from 'react-icons/fa';
import { propertyAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import './Home.css';

const HERO_LOCATIONS = ['Laxmi Nagar', 'Mukherjee Nagar', 'Karol Bagh', 'Noida', 'Greater Noida', 'Gurgaon', 'Dwarka'];

const Home = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    propertyAPI
      .getAll({ featured: true })
      .then((r) => setFeatured((r.properties || r || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type) params.set('type', type);
    navigate(`/properties?${params}`);
  };

  return (
    <div className="home">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content container">
          <span className="hero-tag">🏠 Trusted PG & Flat Finder</span>
          <h1 className="hero-title">
            Find Your Perfect Home<br />
            <span>in Delhi NCR</span>
          </h1>
          <p className="hero-subtitle">
            Browse verified PGs and flats. Our agent handles everything — visits, negotiations, and paperwork.
          </p>

          {/* Search Form */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-input-wrap">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by area, locality…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All Types</option>
              <option value="PG">PG</option>
              <option value="Flat">Flat</option>
            </select>
            <button type="submit" className="btn btn-primary btn-lg">
              Search
            </button>
          </form>

          {/* Quick location links */}
          <div className="hero-locations">
            <FaMapMarkerAlt />
            {HERO_LOCATIONS.map((loc) => (
              <Link key={loc} to={`/properties?location=${encodeURIComponent(loc)}`} className="hero-location-chip">
                {loc}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="stats-bar">
        <div className="container stats-grid">
          {[
            { n: '500+', label: 'Properties Listed' },
            { n: '1,200+', label: 'Happy Tenants' },
            { n: '98%', label: 'Satisfaction Rate' },
            { n: '5+', label: 'Years Experience' },
          ].map(({ n, label }) => (
            <div key={label} className="stat-item">
              <strong>{n}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Properties ───────────────────────────────────────── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">Hand-picked, verified listings across Delhi NCR</p>
          </div>
          <Link to="/properties" className="btn btn-outline">View All →</Link>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner" /></div>
        ) : (
          <div className="property-grid">
            {featured.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </section>

      {/* ── Browse by Type ────────────────────────────────────────────── */}
      <section className="type-section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 8 }}>What Are You Looking For?</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Browse properties by your preferred type</p>
          <div className="type-cards">
            <Link to="/properties?type=PG" className="type-card">
              <div className="type-card-icon">🏨</div>
              <h3>Paying Guest (PG)</h3>
              <p>Furnished rooms with meals, WiFi, and all utilities included</p>
              <span className="btn btn-primary btn-sm">Browse PGs →</span>
            </Link>
            <Link to="/properties?type=Flat" className="type-card">
              <div className="type-card-icon">🏠</div>
              <h3>Flat / Apartment</h3>
              <p>Independent 1BHK, 2BHK &amp; 3BHK flats across all areas</p>
              <span className="btn btn-secondary btn-sm">Browse Flats →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it Works ──────────────────────────────────────────────── */}
      <section className="section how-it-works">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>How StayDost Works</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Simple, transparent, and agent-assisted</p>
          <div className="steps-grid">
            {[
              { step: '01', icon: '🔍', title: 'Browse Listings', desc: 'Explore PGs and flats without registration. Use filters to find your match.' },
              { step: '02', icon: '📩', title: 'Contact Agent', desc: 'Click "Contact Agent" or WhatsApp us. We handle the owner coordination.' },
              { step: '03', icon: '🏠', title: 'Visit Property', desc: 'Our agent arranges a hassle-free visit at your convenient time.' },
              { step: '04', icon: '🤝', title: 'Move In!', desc: 'Agent handles negotiations and paperwork. You just move in!' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="step-card">
                <div className="step-number">{step}</div>
                <div className="step-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────── */}
      <section className="section container">
        <h2 className="section-title" style={{ textAlign: 'center' }}>Why Choose StayDost?</h2>
        <p className="section-subtitle" style={{ textAlign: 'center' }}>We exist to make renting stress-free</p>
        <div className="features-grid">
          {[
            { icon: <FaShieldAlt />, title: 'Verified Listings', desc: 'Every property is personally verified by our agent before listing.' },
            { icon: <FaStar />, title: 'No Hidden Costs', desc: 'Transparent pricing. What you see is what you pay.' },
            { icon: <FaHandshake />, title: 'Agent Assisted', desc: 'Dedicated agent with you from search to move-in.' },
            { icon: <FaHeadset />, title: '24/7 Support', desc: 'WhatsApp us anytime. We\'re always available to help.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      <section className="cta-banner">
        <div className="container cta-content">
          <h2>Own a Property? List it with StayDost!</h2>
          <p>Submit your PG or flat. We'll handle tenants, visits, and agreements.</p>
          <div className="cta-actions">
            <Link to="/submit-property" className="btn btn-accent btn-lg">List Your Property</Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">Talk to Agent</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
