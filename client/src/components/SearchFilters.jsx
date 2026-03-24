import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import './SearchFilters.css';

const LOCATIONS = [
  'Laxmi Nagar', 'Mukherjee Nagar', 'Karol Bagh', 'Safdarjung',
  'Noida Sector 62', 'Greater Noida Knowledge Park', 'Greater Noida West', 'Greater Noida Alpha',
  'Near Sharda University, Greater Noida', 'Near Galgotias University, Greater Noida',
  'Near Bennett University, Greater Noida', 'Near GL Bajaj College, Greater Noida',
  'Near GNIOT, Greater Noida', 'Near NIET, Greater Noida',
  'Near Amity University, Noida',
  'Dwarka', 'Rohini', 'Pitampura', 'Gurgaon',
  'Vijay Nagar', 'Rajendra Place', 'Kalkaji', 'Cyber City, Gurgaon',
  'Vasant Kunj', 'Dwarka Mor',
];

const AMENITIES = ['WiFi', 'AC', 'Food', 'Furnished', 'Parking', 'Security', 'Laundry', 'Power Backup', 'Gym'];

const SearchFilters = ({ onFilter, initialValues = {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    gender: '',
    amenities: [],
    ...initialValues,
  });

  // Sync on external initialValues change (e.g. URL params)
  useEffect(() => {
    setFilters((f) => ({ ...f, ...initialValues }));
  }, [JSON.stringify(initialValues)]);

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  const toggleAmenity = (a) => {
    setFilters((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  const applyFilters = () => {
    onFilter({ ...filters, amenities: filters.amenities.join(',') });
    setShowFilters(false);
  };

  const reset = () => {
    const blank = { search: '', type: '', location: '', minPrice: '', maxPrice: '', gender: '', amenities: [] };
    setFilters(blank);
    onFilter({ ...blank, amenities: '' });
    setShowFilters(false);
  };

  const hasActiveFilters = filters.type || filters.location || filters.minPrice || filters.maxPrice || filters.gender || filters.amenities.length;

  return (
    <div className="search-filters">
      {/* Search bar row */}
      <div className="search-bar-row">
        <div className="search-input-wrap">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or area…"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />
          {filters.search && (
            <button className="search-clear" onClick={() => { set('search', ''); onFilter({ ...filters, search: '', amenities: filters.amenities.join(',') }); }}>
              <FaTimes />
            </button>
          )}
        </div>

        <button className={`btn btn-outline filter-toggle-btn ${hasActiveFilters ? 'filter-active' : ''}`} onClick={() => setShowFilters((s) => !s)}>
          <FaFilter /> Filters {hasActiveFilters ? `(${[filters.type, filters.location, filters.gender, ...filters.amenities].filter(Boolean).length})` : ''}
        </button>

        <button className="btn btn-primary" onClick={applyFilters}>Search</button>
      </div>

      {/* Expandable filter panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-grid">
            {/* Property Type */}
            <div className="filter-group">
              <label className="filter-label">Property Type</label>
              <div className="filter-radio-group">
                {['', 'PG', 'Flat'].map((t) => (
                  <label key={t} className={`filter-radio ${filters.type === t ? 'selected' : ''}`}>
                    <input type="radio" name="type" value={t} checked={filters.type === t} onChange={() => set('type', t)} />
                    {t || 'All'}
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="filter-group">
              <label className="filter-label">Location</label>
              <select className="form-control" value={filters.location} onChange={(e) => set('location', e.target.value)}>
                <option value="">All Locations</option>
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Gender */}
            <div className="filter-group">
              <label className="filter-label">Gender</label>
              <div className="filter-radio-group">
                {['', 'Male', 'Female', 'Any'].map((g) => (
                  <label key={g} className={`filter-radio ${filters.gender === g ? 'selected' : ''}`}>
                    <input type="radio" name="gender" value={g} checked={filters.gender === g} onChange={() => set('gender', g)} />
                    {g || 'All'}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label className="filter-label">Price Range (₹/month)</label>
              <div className="price-range-row">
                <input type="number" className="form-control" placeholder="Min" value={filters.minPrice} onChange={(e) => set('minPrice', e.target.value)} min="0" />
                <span className="price-sep">–</span>
                <input type="number" className="form-control" placeholder="Max" value={filters.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} min="0" />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="filter-group">
            <label className="filter-label">Amenities</label>
            <div className="amenity-chips">
              {AMENITIES.map((a) => (
                <button
                  key={a}
                  className={`amenity-chip ${filters.amenities.includes(a) ? 'selected' : ''}`}
                  onClick={() => toggleAmenity(a)}
                  type="button"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn-ghost" onClick={reset}>Clear All</button>
            <button className="btn btn-primary" onClick={applyFilters}>Apply Filters</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
