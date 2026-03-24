// Format price in Indian rupee style: ₹7,500/month
export const formatPrice = (price, type = 'month') => {
  if (!price && price !== 0) return '—';
  return `₹${price.toLocaleString('en-IN')}/${type}`;
};

// Truncate long text
export const truncate = (text, maxLen = 100) => {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
};

// Format date to readable Indian style: "15 Jan 2024"
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Relative time: "2 hours ago"
export const timeAgo = (dateStr) => {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

// Build WhatsApp click-to-chat URL
export const whatsappLink = (phone, message = '') => {
  const clean = phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${clean}?text=${encoded}`;
};

// Capitalize first letter
export const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

// Get amenity icon (emoji fallback)
export const amenityIcon = (name) => {
  const icons = {
    WiFi: '📶',
    AC: '❄️',
    Food: '🍽️',
    Furnished: '🛋️',
    Parking: '🚗',
    Security: '🔐',
    Laundry: '🧺',
    'Power Backup': '⚡',
    Gym: '💪',
    CCTV: '📷',
    'Water Supply': '💧',
    'Attached Bathroom': '🚿',
  };
  return icons[name] || '✓';
};
