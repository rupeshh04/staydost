import { useState } from 'react';
import { leadAPI } from '../services/api';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { whatsappLink } from '../utils/helpers';
import './Contact.css';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '917279937535';
const ADMIN_PHONE = import.meta.env.VITE_ADMIN_PHONE || '+91-7279937535';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@staydost.com';

export default function Contact() {
  const [form, setForm] = useState({ userName: '', userPhone: '', userEmail: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.userPhone)) {
      setErrMsg('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    try {
      setStatus('loading');
      setErrMsg('');
      await leadAPI.submit({ ...form, source: 'general_inquiry' });

      // Auto-send enquiry details to admin WhatsApp
      const msg = [
        `📩 *New Enquiry — StayDost*`,
        ``,
        `*Name:* ${form.userName}`,
        `*Phone:* ${form.userPhone}`,
        `*Email:* ${form.userEmail || 'N/A'}`,
        `*Message:* ${form.message || 'No message'}`,
      ].join('\n');
      window.open(whatsappLink(WHATSAPP_NUMBER, msg), '_blank');

      setStatus('success');
      setForm({ userName: '', userPhone: '', userEmail: '', message: '' });
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const waLink = whatsappLink(WHATSAPP_NUMBER, 'Hi StayDost! I have a query.');

  return (
    <div className="contact-page">
      {/* Hero */}
      <div className="contact-hero">
        <div className="container contact-hero-inner">
          <h1 className="contact-hero-title">Get in Touch</h1>
          <p className="contact-hero-sub">Have a question or need help finding your perfect stay? We&apos;re here.</p>
        </div>
      </div>

      <div className="container contact-layout">
        {/* Info cards */}
        <div className="contact-info">
          <div className="contact-info-card">
            <FaPhoneAlt className="contact-info-icon" />
            <h3>Call / WhatsApp</h3>
            <p>{ADMIN_PHONE}</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa-small">
              <FaWhatsapp /> Open WhatsApp
            </a>
          </div>

          <div className="contact-info-card">
            <FaEnvelope className="contact-info-icon" />
            <h3>Email Us</h3>
            <p>{ADMIN_EMAIL}</p>
            <a href={`mailto:${ADMIN_EMAIL}`} className="btn btn-outline-small">
              Send Email
            </a>
          </div>

          <div className="contact-info-card">
            <FaMapMarkerAlt className="contact-info-icon" />
            <h3>Areas We Serve</h3>
            <p>Delhi NCR — Noida, Greater Noida, Gurgaon, Faridabad, Ghaziabad</p>
          </div>

          <div className="contact-hours-card">
            <h3>Working Hours</h3>
            <div className="contact-hours-row"><span>Mon – Sat</span><span>9:00 AM – 8:00 PM</span></div>
            <div className="contact-hours-row"><span>Sunday</span><span>10:00 AM – 5:00 PM</span></div>
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-wrap">
          <h2 className="contact-form-title">Send us a Message</h2>
          <p className="contact-form-sub">We&apos;ll get back to you within a few hours.</p>

          {status === 'success' ? (
            <div className="contact-success">
              <div className="contact-success-icon">✅</div>
              <h3>Message Received!</h3>
              <p>Thanks for reaching out. Our team will contact you shortly on <strong>{form.userPhone || 'your number'}</strong>.</p>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa-full">
                <FaWhatsapp /> Also WhatsApp Us
              </a>
              <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => setStatus('idle')}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="ct-name">Your Name *</label>
                <input
                  id="ct-name"
                  name="userName"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Priya Sharma"
                  required
                  value={form.userName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ct-phone">Mobile Number *</label>
                  <input
                    id="ct-phone"
                    name="userPhone"
                    type="tel"
                    className="form-control"
                    placeholder="10-digit number"
                    required
                    maxLength={10}
                    value={form.userPhone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ct-email">Email (optional)</label>
                  <input
                    id="ct-email"
                    name="userEmail"
                    type="email"
                    className="form-control"
                    placeholder="you@email.com"
                    value={form.userEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ct-msg">Your Message *</label>
                <textarea
                  id="ct-msg"
                  name="message"
                  className="form-control"
                  rows={4}
                  placeholder="Tell us what you're looking for…"
                  required
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              {errMsg && <p className="contact-error">{errMsg}</p>}

              <button type="submit" className="btn btn-primary contact-submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
