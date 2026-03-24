import { Link } from 'react-router-dom';
import { FaHome, FaPhone, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-top container">
        {/* Brand */}
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            🏠 <strong>Stay<span>Dost</span></strong>
          </Link>
          <p className="footer-desc">
            Your trusted partner for finding the perfect PG or flat in Delhi NCR. Let our agents handle everything!
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://wa.me/917279937535" aria-label="WhatsApp"><FaWhatsapp /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/properties?type=PG">Browse PGs</Link></li>
            <li><Link to="/properties?type=Flat">Browse Flats</Link></li>
            <li><Link to="/submit-property">List Property</Link></li>
            <li><Link to="/contact">Contact Agent</Link></li>
          </ul>
        </div>

        {/* Locations */}
        <div className="footer-col">
          <h4>Popular Areas</h4>
          <ul>
            <li><Link to="/properties?location=Laxmi Nagar">Laxmi Nagar</Link></li>
            <li><Link to="/properties?location=Mukherjee Nagar">Mukherjee Nagar</Link></li>
            <li><Link to="/properties?location=Karol Bagh">Karol Bagh</Link></li>
            <li><Link to="/properties?location=Noida">Noida</Link></li>
            <li><Link to="/properties?location=Gurgaon">Gurgaon</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact Agent</h4>
          <ul className="footer-contact">
            <li><FaMapMarkerAlt /> Delhi NCR, India</li>
            <li><FaPhone /> <a href="tel:+917279937535">+91 7279937535</a></li>
            <li><FaPhone /> <a href="tel:+917279937535">+91 7764936310</a></li>
            <li><FaEnvelope /> <a 
            href="mailto:admin@staydost.com">admin@staydost.com</a></li>
            <li>
              <FaWhatsapp />
              <a href="https://wa.me/917279937535?text=Hi%2C%20I%27m%20looking%20for%20a%20PG%2FFlat" target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {year} StayDost. All rights reserved. | Built with ❤️ for India</p>
          <p>Owner contact details are never shared. All inquiries go to our agent.</p>
          <p className="footer-brokerage">💼 Brokerage charge: First time only — <strong>10%</strong> of monthly rent</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
