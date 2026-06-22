import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CityParallax } from '@/components/CityParallax';
import { SectionHeader } from '@/components/SectionHeader';
import { faqs, operatingPillars, programAreas } from '@/data/siteContent';

export function Home() {
  return (
    <>
      <section className="hero-frame">
        <CityParallax />
        <div className="hero-content">
          <p className="eyebrow">Da’wah, welfare, and community care</p>
          <h1>Grace in giving. Blessings in return.</h1>
          <p>
            ISF is building a trusted digital home for Islamic propagation, charitable
            support, religious education, and dignified community outreach.
          </p>
          <div className="hero-actions">
            <Link to="/donate" className="button button-primary">
              Support ISF
            </Link>
            <Link to="/programs" className="button button-secondary">
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Program pathways"
          title="Service areas prepared for verified CMS content"
          body="The site starts with approved categories while keeping claims, totals, events, and stories tied to future CMS records."
        />
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
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">Trust architecture</p>
          <h2>Built for careful publishing, not improvised claims.</h2>
        </div>
        <div className="stacked-list">
          {operatingPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article className="list-card" key={pillar.title}>
                <Icon size={20} />
                <div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="impact-panel">
        <div>
          <p className="eyebrow">Donation placeholder</p>
          <h2>Donation flow will activate only after payment approval.</h2>
          <p>
            The initial site can guide prospective donors to understand ISF’s work, but
            transaction processing remains disabled until the provider and workflow are
            confirmed.
          </p>
        </div>
        <Link to="/donate" className="button button-dark">
          View Donation Status <ArrowRight size={18} />
        </Link>
      </section>

      <section className="section faq-section">
        <SectionHeader eyebrow="Questions" title="Frequently asked questions" />
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                <span>{faq.question}</span>
                <CheckCircle2 size={18} />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
