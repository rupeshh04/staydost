import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertyAPI } from '../../services/api';
import './AddProperty.css';

const AMENITY_OPTIONS = [
  'WiFi', 'AC', 'Geyser', 'Laundry', 'Parking', 'Security',
  'CCTV', 'Gym', 'Meals', 'Power Backup', 'TV', 'Fridge',
];

const OCCUPANCY_BY_TYPE = {
  PG:     ['Single', 'Double', 'Triple', 'Dormitory'],
  Hostel: ['Single', 'Double', 'Triple', 'Dormitory'],
  Room:   ['Single', 'Double'],
  Flat:   ['1BHK', '2BHK', '3BHK', '4BHK+', 'Studio'],
};

const LOCATIONS = [
  'Noida Sector 15', 'Noida Sector 18', 'Noida Sector 62',
  'Greater Noida Knowledge Park', 'Greater Noida West (Noida Extension)', 'Greater Noida Alpha', 'Greater Noida Sector Omega',
  'Near Sharda University, Greater Noida', 'Near Galgotias University, Greater Noida',
  'Near Bennett University, Greater Noida', 'Near GL Bajaj College, Greater Noida',
  'Near GNIOT, Greater Noida', 'Near NIET, Greater Noida',
  'Near Amity University, Noida', 'Near AKTU (UPTU), Lucknow Road',
  'Gurgaon Sector 29', 'Gurgaon Cyber City', 'Gurgaon DLF Phase',
  'Faridabad NIT', 'Faridabad Sector 14',
  'Ghaziabad Indirapuram', 'Ghaziabad Raj Nagar',
  'Delhi Laxmi Nagar', 'Delhi Dwarka', 'Delhi Rohini',
  'Delhi Saket', 'Delhi Karol Bagh',
];

const INIT = {
  title: '', type: 'PG', location: '', city: 'Noida',
  price: '', priceType: 'month', description: '',
  amenities: [], gender: 'Any', occupancy: [],
  images: ['', '', ''],
  ownerName: '', ownerPhone: '', ownerEmail: '',
  status: 'approved', featured: false, available: true,
};

export default function AddProperty() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load existing property when editing
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res = await propertyAPI.getById(id);
        const p = res.property || res;
        setForm({
          title: p.title || '',
          type: p.type || 'PG',
          location: p.location || '',
          city: p.city || 'Noida',
          price: p.price || '',
          priceType: p.priceType || 'month',
          description: p.description || '',
          amenities: p.amenities || [],
          gender: p.gender || 'Any',
          occupancy: Array.isArray(p.occupancy) ? p.occupancy : (p.occupancy ? [p.occupancy] : []),
          images: [...(p.images || []), '', '', ''].slice(0, 3),
          ownerName: p.ownerName || '',
          ownerPhone: p.ownerPhone || '',
          ownerEmail: p.ownerEmail || '',
          status: p.status || 'approved',
          featured: p.featured || false,
          available: p.available !== false,
        });
      } catch {
        setError('Failed to load property.');
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'type' ? { occupancy: [] } : {}),
    }));
  };

  const toggleAmenity = a => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter(x => x !== a)
        : [...f.amenities, a],
    }));
  };

  const toggleOccupancy = o => {
    setForm(f => ({
      ...f,
      occupancy: f.occupancy.includes(o)
        ? f.occupancy.filter(x => x !== o)
        : [...f.occupancy, o],
    }));
  };

  const handleImageChange = (idx, val) => {
    setForm(f => { const imgs = [...f.images]; imgs[idx] = val; return { ...f, images: imgs }; });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.location) { setError('Please select a location.'); return; }
    if (!form.price || Number(form.price) <= 0) { setError('Enter a valid price.'); return; }

    try {
      setLoading(true);
      const payload = { ...form, price: Number(form.price), images: form.images.filter(Boolean) };
      if (isEdit) {
        await propertyAPI.update(id, payload);
        setSuccess('Property updated successfully!');
      } else {
        await propertyAPI.create(payload);
        setSuccess('Property created & published!');
        setForm(INIT);
      }
      setTimeout(() => navigate('/admin/properties'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="ap-loading"><div className="spinner" /></div>;

  return (
    <div className="ap-page">
      <div className="ap-header">
        <h1 className="ap-title">{isEdit ? 'Edit Property' : 'Add New Property'}</h1>
        <button className="ap-back-btn" onClick={() => navigate('/admin/properties')}>← Back</button>
      </div>

      <form className="ap-form" onSubmit={handleSubmit} noValidate>
        {/* Basic */}
        <div className="ap-section">
          <h2 className="ap-section-title">Basic Information</h2>
          <div className="form-group">
            <label>Title *</label>
            <input name="title" className="form-control" placeholder="Property title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="ap-row">
            <div className="form-group">
              <label>Type</label>
              <select name="type" className="form-control" value={form.type} onChange={handleChange}>
                {['PG', 'Flat', 'Room', 'Hostel'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="form-control" value={form.gender} onChange={handleChange}>
                {['Any', 'Male', 'Female'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Occupancy</label>
              <div className="ap-amenities">
                {(OCCUPANCY_BY_TYPE[form.type] || []).map(o => (
                  <label key={o} className={`ap-chip ${form.occupancy.includes(o) ? 'ap-chip--on' : ''}`}>
                    <input type="checkbox" checked={form.occupancy.includes(o)} onChange={() => toggleOccupancy(o)} />
                    {o}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" className="form-control" rows={4} placeholder="Describe the property…" value={form.description} onChange={handleChange} />
          </div>
        </div>

        {/* Location */}
        <div className="ap-section">
          <h2 className="ap-section-title">Location</h2>
          <div className="ap-row">
            <div className="form-group">
              <label>Area / Locality *</label>
              <select name="location" className="form-control" value={form.location} onChange={handleChange} required>
                <option value="">Select…</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>City</label>
              <select name="city" className="form-control" value={form.city} onChange={handleChange}>
                {['Noida', 'Greater Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Delhi'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="ap-section">
          <h2 className="ap-section-title">Pricing</h2>
          <div className="ap-row">
            <div className="form-group">
              <label>Rent (₹) *</label>
              <input name="price" type="number" min="100" className="form-control" placeholder="e.g. 8000" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Per</label>
              <select name="priceType" className="form-control" value={form.priceType} onChange={handleChange}>
                <option value="month">Month</option>
                <option value="day">Day</option>
              </select>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="ap-section">
          <h2 className="ap-section-title">Amenities</h2>
          <div className="ap-amenities">
            {AMENITY_OPTIONS.map(a => (
              <label key={a} className={`ap-chip ${form.amenities.includes(a) ? 'ap-chip--on' : ''}`}>
                <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                {a}
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="ap-section">
          <h2 className="ap-section-title">Images (URLs)</h2>
          {form.images.map((img, i) => (
            <div key={i} className="form-group">
              <label>Image {i + 1} {i === 0 && '(cover)'}</label>
              <input type="url" className="form-control" placeholder="https://…" value={img} onChange={e => handleImageChange(i, e.target.value)} />
            </div>
          ))}
        </div>

        {/* Owner Info */}
        <div className="ap-section">
          <h2 className="ap-section-title">Owner Information</h2>
          <div className="ap-row">
            <div className="form-group">
              <label>Owner Name</label>
              <input name="ownerName" className="form-control" placeholder="Owner's name" value={form.ownerName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Owner Phone</label>
              <input name="ownerPhone" type="tel" className="form-control" placeholder="10-digit" maxLength={10} value={form.ownerPhone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Owner Email</label>
              <input name="ownerEmail" type="email" className="form-control" placeholder="owner@email.com" value={form.ownerEmail} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Publishing */}
        <div className="ap-section">
          <h2 className="ap-section-title">Publishing</h2>
          <div className="ap-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" className="form-control" value={form.status} onChange={handleChange}>
                <option value="approved">Approved (Live)</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="ap-toggles">
            <label className="ap-toggle-label">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Mark as Featured ⭐
            </label>
            <label className="ap-toggle-label">
              <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
              Available for Rent
            </label>
          </div>
        </div>

        {error && <p className="ap-error">{error}</p>}
        {success && <p className="ap-success">{success}</p>}

        <div className="ap-submit-row">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/properties')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Update Property' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
}
