import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Megaphone, HandHeart, ShieldCheck, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CityParallax } from '@/components/CityParallax';
import { SectionHeader } from '@/components/SectionHeader';
import { supabase } from '@/lib/supabase';
import { faqs, operatingPillars } from '@/data/siteContent';

interface Program {
  title: string;
  summary: string;
  category: 'zakat_sadaqa' | 'dawah' | 'humanitarian_aid' | 'other';
  featured: boolean;
}

interface SiteSettings {
  donation_message: string;
}

export function Home() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [programsRes, settingsRes] = await Promise.all([
          supabase
            .from('programs')
            .select('title, summary, category, featured')
            .eq('status', 'published')
            .order('sort_order', { ascending: true }),
          supabase
            .from('site_settings')
            .select('donation_message')
            .eq('id', true)
            .maybeSingle(),
        ]);

        if (programsRes.data) {
          setPrograms(programsRes.data as Program[]);
        }
        if (settingsRes.data) {
          setSettings(settingsRes.data as SiteSettings);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  function getCategoryIcon(cat: Program['category']) {
    switch (cat) {
      case 'dawah':
        return Megaphone;
      case 'zakat_sadaqa':
        return HandHeart;
      case 'humanitarian_aid':
        return ShieldCheck;
      default:
        return Landmark;
    }
  }

  // Fallback program list if database is empty
  const defaultPrograms = [
    {
      title: 'Islamic Da’wah',
      summary: 'Lectures, learning resources, and community education shaped by verified scholarship and careful review.',
      category: 'dawah' as const,
      featured: true,
    },
    {
      title: 'Zakat and Sadaqa',
      summary: 'A transparent welfare pathway for charitable support to vulnerable families and approved causes.',
      category: 'zakat_sadaqa' as const,
      featured: true,
    },
    {
      title: 'Humanitarian Aid',
      summary: 'Food, clothing, medical, Ramadan, and emergency support programs entered through the CMS before publication.',
      category: 'humanitarian_aid' as const,
      featured: true,
    },
  ];

  const displayedPrograms = programs.length > 0 ? programs : defaultPrograms;

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
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin text-isf-green" size={24} />
          </div>
        ) : (
          <div className="card-grid">
            {displayedPrograms.map((area) => {
              const Icon = getCategoryIcon(area.category);
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
        )}
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
          <p className="eyebrow">Donation status</p>
          <h2>{settings?.donation_message ? 'Donations status update' : 'Donation flow will activate only after payment approval.'}</h2>
          <p>
            {settings?.donation_message ??
              'The initial site can guide prospective donors to understand ISF’s work, but transaction processing remains disabled until the provider and workflow are confirmed.'}
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

// Minimal placeholder component for loader in home page context
function Loader2({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
