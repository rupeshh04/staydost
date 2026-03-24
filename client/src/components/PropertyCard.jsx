import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaRupeeSign, FaStar, FaWifi, FaSnowflake, FaUtensils, FaCouch } from 'react-icons/fa';
import { formatPrice, truncate } from '../utils/helpers';
import './PropertyCard.css';

const AMENITY_ICONS = {
  WiFi: <FaWifi />,
  AC: <FaSnowflake />,
  Food: <FaUtensils />,
  Furnished: <FaCouch />,
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600';

const PropertyCard = ({ property }) => {
  const { _id, title, type, location, price, priceType, amenities, images, featured, gender, occupancy } = property;
  const img = images?.[0] || FALLBACK_IMG;

  const [imgErr, setImgErr] = useState(false);

  return (
    <Link to={`/properties/${_id}`} className="property-card card">
      {/* Image */}
      <div className="property-card-img-wrap">
        <img
          src={imgErr ? FALLBACK_IMG : img}
          alt={title}
          className="property-card-img"
          onError={() => setImgErr(true)}
          loading="lazy"
        />
        <span className={`badge ${type === 'PG' ? 'badge-pg' : 'badge-flat'} property-type-badge`}>
          {type}
        </span>
        {featured && (
          <span className="property-featured-badge">
            <FaStar /> Featured
          </span>
        )}
        {gender !== 'Any' && (
          <span className="property-gender-badge">{gender} Only</span>
        )}
      </div>

      {/* Body */}
      <div className="property-card-body">
        <h3 className="property-card-title">{truncate(title, 55)}</h3>

        <p className="property-card-location">
          <FaMapMarkerAlt /> {location}
        </p>

        <div className="property-card-meta">
          {Array.isArray(occupancy) && occupancy.length > 0 && <span className="meta-tag">{occupancy.join(' / ')} Sharing</span>}
        </div>

        {/* Amenities */}
        {amenities?.length > 0 && (
          <div className="property-card-amenities">
            {amenities.slice(0, 4).map((a) => (
              <span key={a} className="amenity-tag">
                {AMENITY_ICONS[a] || '✓'} {a}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="amenity-tag">+{amenities.length - 4}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="property-card-footer">
          <div className="property-card-price">
            <FaRupeeSign />
            <strong>{price.toLocaleString('en-IN')}</strong>
            <span>/{priceType}</span>
          </div>
          <span className="property-card-cta">View Details →</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
