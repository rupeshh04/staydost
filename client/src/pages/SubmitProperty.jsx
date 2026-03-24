import { useState } from 'react';
import { propertyAPI } from '../services/api';
import { FaHome, FaRupeeSign, FaMapMarkerAlt, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import { whatsappLink } from '../utils/helpers';
import './SubmitProperty.css';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '917279937535';

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

const INITIAL_FORM = {
  title: '', type: 'PG', location: '', city: 'Noida',
  price: '', priceType: 'month', description: '',
  amenities: [], gender: 'Any', occupancy: [],
  images: ['', '', ''],
  ownerName: '', ownerPhone: '', ownerEmail: '',
};

export default function SubmitProperty() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value,
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
    setForm(f => {
      const imgs = [...f.images];
      imgs[idx] = val;
      return { ...f, images: imgs };
    });
  };

  const validate = () => {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.location) return 'Please select a location.';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) return 'Enter a valid price.';
    if (!form.ownerName.trim()) return 'Your name is required.';
    if (!/^[6-9]\d{9}$/.test(form.ownerPhone)) return 'Enter a valid 10-digit mobile number.';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const error = validate();
    if (error) { setErrMsg(error); return; }

    try {
      setStatus('loading');
      setErrMsg('');
      const payload = {
        ...form,
        price: Number(form.price),
        images: form.images.filter(Boolean),
      };
      await propertyAPI.create(payload);

      // Auto-send details to admin WhatsApp
      const msg = [
        `🏠 *New Property Listing — StayDost*`,
        ``,
        `*Title:* ${form.title}`,
        `*Type:* ${form.type}`,
        `*Location:* ${form.location}, ${form.city}`,
        `*Price:* ₹${form.price}/${form.priceType}`,
        `*Occupancy:* ${form.occupancy.join(', ') || 'N/A'}`,
        `*Gender:* ${form.gender}`,
        `*Amenities:* ${form.amenities.join(', ') || 'None'}`,
        ``,
        `*Owner Name:* ${form.ownerName}`,
        `*Owner Phone:* ${form.ownerPhone}`,
        `*Owner Email:* ${form.ownerEmail || 'N/A'}`,
        ``,
        `_Please review & approve on the admin panel._`,
      ].join('\n');
      window.open(whatsappLink(WHATSAPP_NUMBER, msg), '_blank');

      setStatus('success');
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Submission failed. Please try again.');
      setStatus('error');
    }
  };

  const waLink = whatsappLink(WHATSAPP_NUMBER, `Hi! I want to list my ${form.type || 'property'} in ${form.location || 'Delhi NCR'} at ₹${form.price || '?'}/month.`);

  if (status === 'success') return (
    <div className="sp-success-page container">
      <FaCheckCircle className="sp-success-icon" />
      <h2>Property Submitted!</h2>
      <p>Our team will review your listing and get back to you within <strong>24 hours</strong>.</p>
      <p className="sp-success-note">You will be contacted on <strong>{form.ownerPhone}</strong> once approved.</p>
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa-submit">
        <FaWhatsapp /> WhatsApp Us for Faster Processing
      </a>
      <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => { setStatus('idle'); setForm(INITIAL_FORM); }}>
        Submit Another Property
      </button>
    </div>
  );

  return (
    <div className="sp-page">
      {/* Hero */}
      <div className="sp-hero">
        <div className="container sp-hero-inner">
          <h1><FaHome /> List Your Property</h1>
          <p>Reach thousands of tenants actively searching in Delhi NCR. Free listing, zero brokerage.</p>
        </div>
      </div>

      <div className="container sp-layout">
        {/* Form */}
        <form className="sp-form" onSubmit={handleSubmit} noValidate>
          {/* Section: Basic Details */}
          <div className="sp-section">
            <h2 className="sp-section-title">1. Basic Details</h2>

            <div className="form-group">
              <label>Property Title *</label>
              <input name="title" type="text" className="form-control" placeholder="e.g. Cozy PG near Metro Station" value={form.title} onChange={handleChange} required />
            </div>

            <div className="sp-form-row">
              <div className="form-group">
                <label>Property Type *</label>
                <select name="type" className="form-control" value={form.type} onChange={handleChange}>
                  <option value="PG">PG</option>
                  <option value="Flat">Flat</option>
                  <option value="Room">Room</option>
                  <option value="Hostel">Hostel</option>
                </select>
              </div>

              <div className="form-group">
                <label>Gender Preference</label>
                <select name="gender" className="form-control" value={form.gender} onChange={handleChange}>
                  <option value="Any">Any</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>

              <div className="form-group">
                <label>Occupancy</label>
                <div className="sp-amenities-grid">
                  {(OCCUPANCY_BY_TYPE[form.type] || []).map(o => (
                    <label key={o} className={`sp-amenity-chip ${form.occupancy.includes(o) ? 'sp-amenity-chip--selected' : ''}`}>
                      <input type="checkbox" checked={form.occupancy.includes(o)} onChange={() => toggleOccupancy(o)} />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" className="form-control" rows={4} placeholder="Describe the property, nearby facilities, rules, etc." value={form.description} onChange={handleChange} />
            </div>
          </div>

          {/* Section: Location */}
          <div className="sp-section">
            <h2 className="sp-section-title"><FaMapMarkerAlt /> 2. Location</h2>
            <div className="sp-form-row">
              <div className="form-group">
                <label>Area / Locality *</label>
                <input
                  name="location"
                  type="text"
                  className="form-control"
                  placeholder="Type or select your area…"
                  list="location-suggestions"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
                <datalist id="location-suggestions">
                  {LOCATIONS.map(l => <option key={l} value={l} />)}
                </datalist>
              </div>
              <div className="form-group">
                <label>City</label>
                <select name="city" className="form-control" value={form.city} onChange={handleChange}>
                  <option value="Noida">Noida</option>
                  <option value="Greater Noida">Greater Noida</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Faridabad">Faridabad</option>
                  <option value="Ghaziabad">Ghaziabad</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Pricing */}
          <div className="sp-section">
            <h2 className="sp-section-title"><FaRupeeSign /> 3. Pricing</h2>
            <div className="sp-form-row">
              <div className="form-group">
                <label>Monthly Rent (₹) *</label>
                <input name="price" type="number" min="500" className="form-control" placeholder="e.g. 8000" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Rent Type</label>
                <select name="priceType" className="form-control" value={form.priceType} onChange={handleChange}>
                  <option value="month">Per Month</option>
                  <option value="day">Per Day</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Amenities */}
          <div className="sp-section">
            <h2 className="sp-section-title">4. Amenities</h2>
            <div className="sp-amenities-grid">
              {AMENITY_OPTIONS.map(a => (
                <label key={a} className={`sp-amenity-chip ${form.amenities.includes(a) ? 'sp-amenity-chip--selected' : ''}`}>
                  <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                  {a}
                </label>
              ))}
            </div>
          </div>

          {/* Section: Images */}
          <div className="sp-section">
            <h2 className="sp-section-title">5. Property Photos</h2>
            <p className="sp-hint">Paste image URLs (Unsplash, Google Drive share link, etc.)</p>
            {form.images.map((img, i) => (
              <div key={i} className="form-group">
                <label>Image URL {i + 1} {i === 0 && '(main cover)'}</label>
                <input type="url" className="form-control" placeholder="https://…" value={img} onChange={e => handleImageChange(i, e.target.value)} />
              </div>
            ))}
          </div>

          {/* Section: Owner Info */}
          <div className="sp-section">
            <h2 className="sp-section-title">6. Your Contact Info</h2>
            <p className="sp-hint">This information is kept private and will not be shown to tenants.</p>
            <div className="sp-form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input name="ownerName" type="text" className="form-control" placeholder="Your full name" value={form.ownerName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input name="ownerPhone" type="tel" className="form-control" placeholder="10-digit number" maxLength={10} value={form.ownerPhone} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Email (optional)</label>
              <input name="ownerEmail" type="email" className="form-control" placeholder="you@email.com" value={form.ownerEmail} onChange={handleChange} />
            </div>
          </div>

          {errMsg && <p className="sp-error">{errMsg}</p>}

          <button type="submit" className="btn btn-primary sp-submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting…' : '🏠 Submit for Review'}
          </button>

          <p className="sp-submit-note">
            After submission, our team reviews your listing and publishes it within 24 hours.
          </p>
        </form>

        {/* Sidebar */}
        <aside className="sp-sidebar">
          <div className="sp-why-card">
            <h3>Why List on StayDost?</h3>
            <ul className="sp-why-list">
              <li>💼 Brokerage charge: First time only — 10% of monthly rent when client comes </li>
              <li>📲 Reach verified tenants</li>
              <li>🔒 Your contact stays private</li>
              <li>⚡ Go live in 24 hours</li>
              <li>📞 Dedicated support team</li>
            </ul>
          </div>

          <div className="sp-wa-card">
            <FaWhatsapp className="sp-wa-icon" />
            <h3>Prefer WhatsApp?</h3>
            <p>Send your property details directly and we&apos;ll list it for you.</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa-submit">
              <FaWhatsapp /> Chat with Us
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
