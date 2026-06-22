import { Link } from 'react-router-dom';

export function Donate() {
  return (
    <section className="page-section">
      <div className="donate-card">
        <p className="eyebrow">Donation status</p>
        <h1>Online giving is not active yet.</h1>
        <p>
          ISF’s donation interface is intentionally a placeholder until the payment
          provider, account details, authorization process, and donor receipt workflow are
          approved.
        </p>
        <div className="hero-actions">
          <Link to="/programs" className="button button-primary">
            Explore Service Areas
          </Link>
          <Link to="/contact" className="button button-secondary">
            Contact ISF
          </Link>
        </div>
      </div>
    </section>
  );
}
