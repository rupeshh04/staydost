import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import { formatPrice, formatDate, amenityIcon, whatsappLink } from '../utils/helpers';
import LeadForm from '../components/LeadForm';
import PropertyCard from '../components/PropertyCard';
import { FaMapMarkerAlt, FaBed, FaWhatsapp, FaPhoneAlt, FaCalendarAlt, FaArrowLeft, FaShare, FaHeart, FaChevronLeft, FaChevronRight, FaEye } from 'react-icons/fa';
import './PropertyDetail.css';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '917279937535';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentImg, setCurrentImg] = useState(0);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadSource, setLeadSource] = useState('contact_form');
  const [wishlisted, setWishlisted] = useState(false);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyAPI.getById(id);
      setProperty(data.property || data);
      setCurrentImg(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Property not found.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRelated = useCallback(async (prop) => {
    if (!prop) return;
    try {
      const data = await propertyAPI.getAll({ type: prop.type, city: prop.city, limit: 3 });
      const list = (data.properties || data).filter(p => p._id !== prop._id).slice(0, 3);
      setRelated(list);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  useEffect(() => {
    if (property) fetchRelated(property);
  }, [property, fetchRelated]);

  const images = property?.images?.length ? property.images : [FALLBACK_IMAGE];

  const prevImg = () => setCurrentImg(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setCurrentImg(i => (i + 1) % images.length);

  const openLead = (source) => {
    setLeadSource(source);
    setLeadOpen(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: property?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return (
    <div className="pd-loading">
      <div className="spinner" />
      <p>Loading property…</p>
    </div>
  );

  if (error) return (
    <div className="pd-error container">
      <h2>Oops!</h2>
      <p>{error}</p>
      <Link to="/properties" className="btn btn-primary">Browse Properties</Link>
    </div>
  );

  if (!property) return null;

  const amenities = property.amenities || [];
  const waLink = whatsappLink(WHATSAPP_NUMBER, `Hi! I'm interested in: ${property.title} — ${window.location.href}`);

  return (
    <div className="pd-page">
      {/* Back */}
      <div className="pd-topbar container">
        <button className="pd-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="pd-actions">
          <button className="pd-action-btn" onClick={() => setWishlisted(w => !w)} title="Save">
            <FaHeart style={{ color: wishlisted ? '#e63946' : undefined }} />
          </button>
          <button className="pd-action-btn" onClick={handleShare} title="Share">
            <FaShare />
          </button>
        </div>
      </div>

      <div className="pd-layout container">
        {/* LEFT COLUMN */}
        <div className="pd-main">
          {/* Gallery */}
          <div className="pd-gallery">
            <img
              src={images[currentImg]}
              alt={`${property.title} — photo ${currentImg + 1}`}
              className="pd-gallery-img"
              onError={e => { e.target.src = FALLBACK_IMAGE; }}
            />
            {images.length > 1 && (
              <>
                <button className="pd-gallery-nav pd-gallery-nav--prev" onClick={prevImg}><FaChevronLeft /></button>
                <button className="pd-gallery-nav pd-gallery-nav--next" onClick={nextImg}><FaChevronRight /></button>
                <div className="pd-gallery-counter">{currentImg + 1} / {images.length}</div>
              </>
            )}
            <div className="pd-gallery-badges">
              <span className={`badge badge-${property.type === 'PG' ? 'primary' : 'secondary'}`}>
                {property.type}
              </span>
              {property.featured && <span className="badge badge-featured">⭐ Featured</span>}
              {!property.available && <span className="badge badge-danger">Not Available</span>}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb ${i + 1}`}
                  className={`pd-thumb ${i === currentImg ? 'pd-thumb--active' : ''}`}
                  onClick={() => setCurrentImg(i)}
                  onError={e => { e.target.src = FALLBACK_IMAGE; }}
                />
              ))}
            </div>
          )}

          {/* Title + Meta */}
          <div className="pd-info">
            <h1 className="pd-title">{property.title}</h1>
            <div className="pd-meta">
              <span className="pd-meta-item">
                <FaMapMarkerAlt /> {property.location}, {property.city}
              </span>
              {property.gender && (
                <span className="pd-meta-item">
                  <FaBed /> {property.gender}
                </span>
              )}
              {property.occupancy && (
                <span className="pd-meta-item">
                  <FaBed /> {property.occupancy}
                </span>
              )}
              <span className="pd-meta-item">
                <FaEye /> {property.views || 0} views
              </span>
              <span className="pd-meta-item">
                <FaCalendarAlt /> Listed {formatDate(property.createdAt)}
              </span>
            </div>

            {/* Price */}
            <div className="pd-price-box">
              <span className="pd-price">
                {formatPrice(property.price, property.priceType || 'month')}
              </span>
            </div>

            {/* Description */}
            {property.description && (
              <div className="pd-section">
                <h2 className="pd-section-title">About this Property</h2>
                <p className="pd-description">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="pd-section">
                <h2 className="pd-section-title">Amenities</h2>
                <div className="pd-amenities">
                  {amenities.map(a => (
                    <div key={a} className="pd-amenity">
                      <span className="pd-amenity-icon">{amenityIcon(a)}</span>
                      <span className="pd-amenity-label">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location detail */}
            <div className="pd-section">
              <h2 className="pd-section-title">Location</h2>
              <div className="pd-location-card">
                <FaMapMarkerAlt className="pd-loc-icon" />
                <div>
                  <div className="pd-loc-area">{property.area || property.location}</div>
                  <div className="pd-loc-city">{property.city}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — sticky CTA */}
        <aside className="pd-sidebar">
          <div className="pd-cta-card">
            <div className="pd-cta-price">
              {formatPrice(property.price, property.priceType || 'month')}
            </div>
            <div className="pd-cta-location">
              <FaMapMarkerAlt /> {property.location}, {property.city}
            </div>

            <button
              className="btn btn-primary pd-cta-btn"
              onClick={() => openLead('contact_form')}
              disabled={!property.available}
            >
              <FaPhoneAlt /> Contact Agent
            </button>

            <button
              className="btn btn-secondary pd-cta-btn"
              onClick={() => openLead('book_visit')}
              disabled={!property.available}
            >
              <FaCalendarAlt /> Book a Visit
            </button>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn pd-cta-btn pd-cta-wa"
            >
              <FaWhatsapp /> WhatsApp Us
            </a>

            {!property.available && (
              <p className="pd-unavailable-note">This property is currently not available.</p>
            )}

            <div className="pd-cta-note">
              <span>🔒</span> Your details are safe. We never share them.
            </div>
          </div>

          <div className="pd-trust-box">
            <div className="pd-trust-item">✅ Verified Listing</div>
            <div className="pd-trust-item"> 💼 Brokerage charge: First time only — 10% of monthly rent</div>
            <div className="pd-trust-item">📞 Quick Response</div>
          </div>
        </aside>
      </div>

      {/* Related Properties */}
      {related.length > 0 && (
        <div className="pd-related container">
          <h2 className="pd-section-title">Similar Properties</h2>
          <div className="properties-grid">
            {related.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        </div>
      )}

      {/* Lead Form Modal */}
      {leadOpen && (
        <LeadForm
          property={property}
          source={leadSource}
          onClose={() => setLeadOpen(false)}
        />
      )}
    </div>
  );
}
