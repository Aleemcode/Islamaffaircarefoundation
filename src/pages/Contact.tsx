import { organization } from '@/data/siteContent';

export function Contact() {
  return (
    <section className="page-section">
      <div className="contact-panel">
        <p className="eyebrow">Official channels</p>
        <h1>Contact and social links</h1>
        <p>
          Direct contact details will be published from the CMS after verification. For now,
          use the stakeholder-designated social channels.
        </p>
        <div className="social-links">
          <a href={organization.instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={organization.facebookUrl} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>
    </section>
  );
}
