import { useState } from 'react';
import { FaTimes, FaWhatsapp, FaPhone } from 'react-icons/fa';
import { leadAPI } from '../services/api';
import './LeadForm.css';

const WHATSAPP_NUM = '917279937535';

const LeadForm = ({ property, source = 'contact_form', onClose, onSuccess }) => {
  const [form, setForm] = useState({ userName: '', userPhone: '', userEmail: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic phone validation
    if (!/^[6-9]\d{9}$/.test(form.userPhone.replace(/[\s+\-()]/g, ''))) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      await leadAPI.submit({
        ...form,
        property_id: property?._id,
        source,
      });
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const waMsg = property
    ? `Hi StayDost! I'm interested in: ${property.title} (${property.location}). Please share more details.`
    : `Hi StayDost! I'm looking for a PG/Flat. Can you help?`;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal lead-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {source === 'book_visit' ? '📅 Book a Visit' : '📩 Contact Agent'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {property && (
          <div className="lead-property-info">
            <strong>{property.title}</strong>
            <span>📍 {property.location}</span>
          </div>
        )}

        {submitted ? (
          <div className="lead-success">
            <div className="lead-success-icon">✅</div>
            <h3>Inquiry Sent!</h3>
            <p>Our agent will contact you within <strong>30 minutes</strong> during business hours.</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-green btn-block"
            >
              <FaWhatsapp /> Also Chat on WhatsApp
            </a>
            <button className="btn btn-ghost btn-block" onClick={onClose} style={{ marginTop: 8 }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Rahul Sharma"
                value={form.userName}
                onChange={(e) => set('userName', e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                placeholder="e.g. 9876543210"
                value={form.userPhone}
                onChange={(e) => set('userPhone', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (optional)</label>
              <input
                type="email"
                className="form-control"
                placeholder="your@email.com"
                value={form.userEmail}
                onChange={(e) => set('userEmail', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                placeholder="Tell us what you're looking for, budget, move-in date…"
                rows={3}
                value={form.message}
                onChange={(e) => set('message', e.target.value)}
                maxLength={500}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Sending…' : '📩 Send Inquiry'}
            </button>
          </form>
        )}

        {!submitted && (
          <div className="lead-footer">
            <span>Or reach us directly:</span>
            <a href={`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noreferrer" className="btn btn-green btn-sm">
              <FaWhatsapp /> WhatsApp
            </a>
            <a href="tel:+917279937535" className="btn btn-outline btn-sm">
              <FaPhone /> Call
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadForm;
