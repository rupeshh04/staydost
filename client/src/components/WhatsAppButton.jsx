import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppButton.css';

const WHATSAPP_NUM = '917279937535';
const DEFAULT_MSG = 'Hi StayDost! I am looking for a PG/Flat. Can you help me?';

const WhatsAppButton = ({ message = DEFAULT_MSG }) => (
  <a
    href={`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(message)}`}
    className="whatsapp-fab"
    target="_blank"
    rel="noreferrer"
    aria-label="Chat on WhatsApp"
    title="Chat with our agent on WhatsApp"
  >
    <FaWhatsapp />
    <span className="whatsapp-label">Chat with Agent</span>
  </a>
);

export default WhatsAppButton;
