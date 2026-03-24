import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { propertyAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SearchFilters from '../components/SearchFilters';
import './Properties.css';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  // Build initial filter values from URL params
  const getInitialFilters = () => ({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    gender: searchParams.get('gender') || '',
    amenities: searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [],
  });

  const fetchProperties = useCallback(async (params) => {
    setLoading(true);
    setError('');
    try {
      const res = await propertyAPI.getAll(params);
      setProperties(res.properties || res || []);
      setTotal(res.count || res.total || (res.properties || res || []).length);
    } catch {
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount + when URL params change
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    fetchProperties(params);
  }, [searchParams, fetchProperties]);

  const handleFilter = (filters) => {
    // Push filters to URL so they're shareable
    const next = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) next[k] = v; });
    setSearchParams(next);
  };

  const activeType = searchParams.get('type');

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Page header */}
        <div className="properties-header">
          <div>
            <h1 className="page-title">
              {activeType ? `${activeType}s in Delhi NCR` : 'Browse PGs & Flats'}
            </h1>
            <p className="page-subtitle">
              {loading ? 'Searching…' : `${total} propert${total === 1 ? 'y' : 'ies'} found`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <SearchFilters onFilter={handleFilter} initialValues={getInitialFilters()} />

        {/* Results */}
        {loading ? (
          <div className="spinner-container"><div className="spinner" /><p>Finding properties…</p></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <FaHome />
            <h3>No properties found</h3>
            <p>Try adjusting your filters or search in a different area.</p>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
