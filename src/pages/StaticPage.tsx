import { Link } from 'react-router-dom';

import { SectionHeader } from '@/components/SectionHeader';
import { programAreas } from '@/data/siteContent';

type StaticPageProps = {
  eyebrow: string;
  title: string;
  body: string;
  mode?: 'cards' | 'placeholder';
};

export function StaticPage({ eyebrow, title, body, mode = 'placeholder' }: StaticPageProps) {
  return (
    <section className="page-section">
      <SectionHeader eyebrow={eyebrow} title={title} body={body} />
      {mode === 'cards' ? (
        <div className="card-grid">
          {programAreas.map((area) => {
            const Icon = area.icon;
            return (
              <article className="program-card" key={area.title}>
                <span className="icon-chip">
                  <Icon size={22} />
                </span>
                <h3>{area.title}</h3>
                <p>{area.summary}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3>CMS content pending</h3>
          <p>
            This route is ready for published CMS records. Until then, it avoids inventing
            events, figures, testimonials, campaign totals, or donation claims.
          </p>
          <Link to="/admin" className="button button-secondary">
            Open CMS Shell
          </Link>
        </div>
      )}
    </section>
  );
}
