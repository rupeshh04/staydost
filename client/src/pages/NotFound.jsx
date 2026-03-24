import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="nf-page">
      <div className="nf-inner">
        <div className="nf-illustration">
          <span className="nf-404">404</span>
          <span className="nf-emoji">🏠</span>
        </div>
        <h1>Page Not Found</h1>
        <p>
          Looks like you wandered into the wrong locality! The page you&apos;re
          looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="nf-actions">
          <Link to="/" className="btn btn-primary">Go to Home</Link>
          <Link to="/properties" className="btn btn-outline">Browse Properties</Link>
        </div>
      </div>
    </div>
  );
}
