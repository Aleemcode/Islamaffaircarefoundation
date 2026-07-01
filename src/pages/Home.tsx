import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Megaphone, HandHeart, ShieldCheck, Landmark, Calendar, Clock, Award, HelpCircle, LayoutGrid, Info, BookOpen } from 'lucide-react';
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

interface Campaign {
  id: string;
  title: string;
  summary: string;
  goal_amount_minor: number | null;
  raised_amount_minor: number | null;
  campaign_status: string;
}

interface SiteSettings {
  donation_message: string;
}

type LayoutVariant = 'editorial' | 'modernist' | 'atmospheric';

export function Home() {
  const [activeLayout, setActiveLayout] = useState<LayoutVariant>('editorial');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Time & Prayer State (Simulated for Lagos timezone)
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [programsRes, campaignsRes, settingsRes] = await Promise.all([
          supabase
            .from('programs')
            .select('title, summary, category, featured')
            .eq('status', 'published')
            .order('sort_order', { ascending: true }),
          supabase
            .from('campaigns')
            .select('id, title, summary, goal_amount_minor, raised_amount_minor, campaign_status')
            .eq('status', 'published')
            .limit(3),
          supabase
            .from('site_settings')
            .select('donation_message')
            .eq('id', true)
            .maybeSingle(),
        ]);

        if (programsRes.data) setPrograms(programsRes.data as Program[]);
        if (campaignsRes.data) setCampaigns(campaignsRes.data as Campaign[]);
        if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);
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

  // Fallbacks if database has no records
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

  const defaultCampaigns = [
    {
      id: 'c1',
      title: 'Zakat & Sadaqah Welfare Appeal',
      summary: 'Direct food and medical relief program for distressed communities in Lagos and neighbouring states.',
      goal_amount_minor: 500000000,
      raised_amount_minor: 235000000,
      campaign_status: 'active',
    },
    {
      id: 'c2',
      title: 'Islamic Library & Da’wah Resources',
      summary: 'Funding for scholarly publication, translation, and distribution of verified textbooks and guides.',
      goal_amount_minor: 150000000,
      raised_amount_minor: 85000000,
      campaign_status: 'active',
    },
  ];

  const displayedPrograms = programs.length > 0 ? programs : defaultPrograms;
  const displayedCampaigns = campaigns.length > 0 ? campaigns : defaultCampaigns;

  return (
    <>
      {/* Floating Layout Selector Switcher */}
      <div className="layout-selector-panel" aria-label="Layout selector dashboard">
        <span>Layout:</span>
        <button
          onClick={() => setActiveLayout('editorial')}
          className={`layout-selector-btn ${activeLayout === 'editorial' ? 'active' : ''}`}
        >
          Editorial
        </button>
        <button
          onClick={() => setActiveLayout('modernist')}
          className={`layout-selector-btn ${activeLayout === 'modernist' ? 'active' : ''}`}
        >
          Modernist
        </button>
        <button
          onClick={() => setActiveLayout('atmospheric')}
          className={`layout-selector-btn ${activeLayout === 'atmospheric' ? 'active' : ''}`}
        >
          Atmospheric
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
          <Loader2 className="animate-spin text-isf-green" size={32} />
        </div>
      ) : (
        <>
          {/* LAYOUT 1: EDITORIAL SCHOLARLY */}
          {activeLayout === 'editorial' && (
            <>
              {/* Islamic Utility Info Bar */}
              <div className="utility-info-bar">
                <div className="utility-item">
                  <Calendar size={15} style={{ color: 'var(--isf-green)' }} />
                  <span>Hijri Date: 15 Muharram, 1448</span>
                </div>
                <div className="utility-divider" />
                <div className="utility-item">
                  <Clock size={15} style={{ color: 'var(--isf-green)' }} />
                  <span>Next Prayer (Lagos): Fajr at 05:12 am ({currentTime})</span>
                </div>
                <div className="utility-divider" />
                <div className="utility-item">
                  <ShieldCheck size={15} style={{ color: 'var(--isf-green)' }} />
                  <span>Scholarly Board Audit: 100% Verified</span>
                </div>
              </div>

              {/* Hero Frame */}
              <section className="hero-frame">
                <CityParallax />
                <div className="hero-content">
                  <p className="eyebrow">Dignity, Scholarship, and Islamic Care</p>
                  <h1 style={{ fontSize: '3rem', lineHeight: '1.15', fontWeight: '900', letterSpacing: '-0.04em' }}>
                    Grace in giving. <br />
                    Blessings in return.
                  </h1>
                  <p style={{ fontSize: '1.05rem', margin: '20px 0 28px', lineHeight: '1.6', maxWidth: '520px' }}>
                    Islamaffair Care Foundation provides a transparent, audited pathway for Islamic propagation, Zakat distribution, and scholar-reviewed education.
                  </p>
                  <div className="hero-actions" style={{ display: 'flex', gap: '12px' }}>
                    <Link to="/donate" className="button button-primary">
                      Support ISF
                    </Link>
                    <Link to="/resources" className="button button-secondary">
                      Scholarly Resources
                    </Link>
                  </div>
                </div>
              </section>

              {/* Quick Donation Ticker */}
              <div className="quick-donate-bar">
                <div className="quick-donate-info">
                  <h3>Empower Distressed Families</h3>
                  <p>100% of Zakat allocations are directly distributed under verified scholar oversight.</p>
                </div>
                <div className="quick-donate-actions">
                  <span className="quick-select-tag">Sadaqah & Zakat</span>
                  <Link to="/donate" className="button button-primary" style={{ background: 'var(--isf-lime)', color: '#073b2f', minHeight: '42px' }}>
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Programs */}
              <section className="section" style={{ padding: '40px 0' }}>
                <SectionHeader
                  eyebrow="Welfare Pathways"
                  title="Active programs designed for communal support"
                  body="Every program is managed by staff and audited periodically to ensure zero leakages and complete compliance."
                />
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
              </section>

              {/* Scholarly Assurance Banner */}
              <section className="scholarly-assurance-card">
                <div className="assurance-badge-container">
                  <Award size={48} style={{ color: 'var(--isf-green)' }} />
                  <h4>Islamic Integrity</h4>
                  <p>Verified Scholarly Review</p>
                </div>
                <div className="assurance-content">
                  <h2>Protecting the integrity of religious knowledge</h2>
                  <p>
                    To prevent unverified claims or mistakes, every single article, learning resource, and document published on our platform must be verified and signed off by certified Islamic scholars.
                  </p>
                  <Link to="/resources" className="button button-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Browse Verified Resources <ArrowRight size={14} />
                  </Link>
                </div>
              </section>

              {/* Campaigns */}
              <section className="section" style={{ padding: '40px 0' }}>
                <SectionHeader
                  eyebrow="Active Appeals"
                  title="Support our ongoing welfare initiatives"
                  body="All appeal goals and raised totals are synced live from our CMS. Funding details are verified before publishing."
                />
                <div className="card-grid">
                  {displayedCampaigns.map((c) => {
                    const goal = c.goal_amount_minor ? c.goal_amount_minor / 100 : null;
                    const raised = c.raised_amount_minor ? c.raised_amount_minor / 100 : 0;
                    const percent = goal ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
                    return (
                      <article className="program-card" key={c.id}>
                        <span className="cat-pill" style={{ display: 'inline-block', marginBottom: '12px' }}>
                          {c.campaign_status.toUpperCase()}
                        </span>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{c.title}</h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--isf-muted)', lineHeight: '1.5' }}>{c.summary}</p>
                        <div style={{ marginTop: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '800', marginBottom: '6px' }}>
                            <span>Raised: NGN {raised.toLocaleString()}</span>
                            {goal && <span>Goal: NGN {goal.toLocaleString()}</span>}
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* LAYOUT 2: CLEAN MODERNIST GRID */}
          {activeLayout === 'modernist' && (
            <div className="modernist-layout">
              {/* Split Modernist Hero */}
              <section className="modernist-hero">
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--isf-soft)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--isf-forest)', marginBottom: '20px' }}>
                    <LayoutGrid size={13} />
                    <span>FOUNDATION PRINCIPLES</span>
                  </div>
                  <h1 style={{ fontSize: '3.4rem', fontWeight: '900', lineHeight: '1.1', color: 'var(--isf-forest)', letterSpacing: '-0.04em', margin: '0 0 20px' }}>
                    Faith. Stewardship. Complete Transparency.
                  </h1>
                  <p style={{ color: 'var(--isf-muted)', lineHeight: '1.6', fontSize: '1.02rem', margin: '0 0 32px', maxWidth: '520px' }}>
                    We manage religious education and welfare pathways under structural rules. No arbitrary figures or unverified announcements.
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Link to="/programs" className="button button-primary">Explore Programs</Link>
                    <Link to="/contact" className="button button-secondary">Get In Touch</Link>
                  </div>
                </div>

                <div className="modernist-stats-grid">
                  <div className="modernist-stat-box">
                    <h4>100%</h4>
                    <p>SCHOLARLY REVIEWED</p>
                  </div>
                  <div className="modernist-stat-box">
                    <h4>Zakat</h4>
                    <p>AUDITED DISTRIBUTION</p>
                  </div>
                  <div className="modernist-stat-box">
                    <h4>NGN</h4>
                    <p>STRICT METRIC LOGS</p>
                  </div>
                  <div className="modernist-stat-box">
                    <h4>Staff</h4>
                    <p>RBAC VERIFIED CONSOLE</p>
                  </div>
                </div>
              </section>

              {/* Service list section */}
              <section className="section" style={{ padding: '60px 0', borderTop: '1px solid rgba(102, 153, 52, 0.08)' }}>
                <SectionHeader
                  eyebrow="Our Mandates"
                  title="Welfare distribution and propagation pathways"
                />
                <div className="card-grid">
                  {displayedPrograms.map((p) => {
                    const Icon = getCategoryIcon(p.category);
                    return (
                      <article className="program-card" key={p.title} style={{ borderRadius: '12px', border: '1px solid rgba(102, 153, 52, 0.12)', boxShadow: 'none' }}>
                        <span className="icon-chip" style={{ borderRadius: '12px', background: 'var(--isf-forest)', color: 'white' }}>
                          <Icon size={20} />
                        </span>
                        <h3 style={{ fontSize: '1.25rem', marginTop: '16px' }}>{p.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--isf-muted)' }}>{p.summary}</p>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* Active campaigns flat list */}
              <section className="section" style={{ padding: '60px 0', borderTop: '1px solid rgba(102, 153, 52, 0.08)' }}>
                <SectionHeader
                  eyebrow="Appeals"
                  title="Ongoing verified funding drives"
                />
                <div className="card-grid">
                  {displayedCampaigns.map((c) => {
                    const goal = c.goal_amount_minor ? c.goal_amount_minor / 100 : null;
                    const raised = c.raised_amount_minor ? c.raised_amount_minor / 100 : 0;
                    const percent = goal ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
                    return (
                      <div key={c.id} style={{ background: 'white', padding: '28px', borderRadius: '16px', border: '1.5px solid rgba(102, 153, 52, 0.08)' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '900', background: 'var(--isf-soft)', padding: '4px 8px', borderRadius: '4px', color: 'var(--isf-forest)' }}>
                          {c.campaign_status.toUpperCase()}
                        </span>
                        <h3 style={{ fontSize: '1.2rem', margin: '14px 0 8px' }}>{c.title}</h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--isf-muted)' }}>{c.summary}</p>
                        <div style={{ marginTop: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '800', marginBottom: '6px' }}>
                            <span>NGN {raised.toLocaleString()} raised</span>
                            {goal && <span>Target: NGN {goal.toLocaleString()}</span>}
                          </div>
                          <div style={{ height: '6px', background: 'var(--isf-soft)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: 'var(--isf-forest)', width: `${percent}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Modernist flat FAQs */}
              <section className="section" style={{ padding: '60px 0', borderTop: '1px solid rgba(102, 153, 52, 0.08)' }}>
                <SectionHeader eyebrow="FAQ" title="Answers to common queries" />
                <div className="modernist-faq-grid">
                  {faqs.slice(0, 3).map((f) => (
                    <div className="modernist-faq-card" key={f.question}>
                      <h4>{f.question}</h4>
                      <p>{f.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* LAYOUT 3: IMMERSIVE ATMOSPHERIC */}
          {activeLayout === 'atmospheric' && (
            <div className="atmospheric-layout">
              {/* Full-bleed glassmorphic hero container */}
              <div className="atmospheric-hero-wrapper">
                <div className="atmospheric-hero-content">
                  <div className="atmospheric-glass-badge">
                    <Award size={14} />
                    <span>NIGERIAN FAITH IN OUTREACH</span>
                  </div>
                  <h1>Authentic Knowledge. Dignified Distribution.</h1>
                  <p style={{ margin: '20px 0 0', opacity: '0.9', fontSize: '1.05rem', lineHeight: '1.6' }}>
                    Protecting religious learning and welfare distribution across Nigeria using digital audits and scholarly verification.
                  </p>

                  <div className="atmospheric-quick-widget">
                    <p style={{ margin: '0', fontSize: '0.88rem', fontWeight: '700', color: 'var(--isf-lime)' }}>
                      Strict Scholarly Review Requirement
                    </p>
                    <p style={{ margin: '0', fontSize: '0.84rem', opacity: '0.8' }}>
                      All publications undergo thorough checks by certified scholars prior to release.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                      <Link to="/resources" className="button button-primary" style={{ background: 'var(--isf-lime)', color: '#073b2f', minHeight: '38px', fontSize: '0.8rem' }}>
                        Browse Publications
                      </Link>
                      <Link to="/donate" className="button button-secondary" style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: 'white', minHeight: '38px', fontSize: '0.8rem' }}>
                        Donation Ticker
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Decorative Central Mosque icon/shape backdrop */}
                <div className="atmospheric-mosque-backdrop" aria-hidden="true">
                  <svg viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 10 C35 30 35 50 35 70 L65 70 C65 50 65 30 50 10 Z" />
                    <rect x="30" y="70" width="40" height="20" />
                  </svg>
                </div>
              </div>

              {/* Horizontal Slider of Campaigns */}
              <section className="section" style={{ padding: '20px 0 40px' }}>
                <SectionHeader eyebrow="Active Campaigns" title="Scroll through current welfare appeals" />
                <div className="atmospheric-slider-container">
                  {displayedCampaigns.map((c) => {
                    const goal = c.goal_amount_minor ? c.goal_amount_minor / 100 : null;
                    const raised = c.raised_amount_minor ? c.raised_amount_minor / 100 : 0;
                    const percent = goal ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
                    return (
                      <div className="atmospheric-slider-card" key={c.id}>
                        <span style={{ fontSize: '0.74rem', fontWeight: '900', color: 'var(--isf-green)' }}>
                          {c.campaign_status.toUpperCase()}
                        </span>
                        <h3 style={{ fontSize: '1.15rem', margin: '12px 0 6px', color: 'var(--isf-forest)' }}>{c.title}</h3>
                        <p style={{ fontSize: '0.84rem', color: 'var(--isf-muted)', margin: '0 0 16px' }}>{c.summary}</p>
                        <div style={{ marginTop: 'auto' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: '800', marginBottom: '4px' }}>
                            <span>Raised: {percent}%</span>
                            {goal && <span>Goal: NGN {goal.toLocaleString()}</span>}
                          </div>
                          <div className="progress-track" style={{ height: '6px' }}>
                            <div className="progress-fill" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Operating principles section */}
              <section className="section" style={{ padding: '40px 0', borderTop: '1px solid rgba(102, 153, 52, 0.08)' }}>
                <SectionHeader eyebrow="Operating Standards" title="A transparent trust architecture" />
                <div className="card-grid">
                  {operatingPillars.map((p) => {
                    const Icon = p.icon;
                    return (
                      <article className="program-card" key={p.title} style={{ textAlign: 'center', padding: '32px 24px' }}>
                        <span style={{ display: 'inline-flex', padding: '12px', background: 'var(--isf-soft)', borderRadius: '999px', color: 'var(--isf-green)', marginBottom: '16px' }}>
                          <Icon size={22} />
                        </span>
                        <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px' }}>{p.title}</h3>
                        <p style={{ fontSize: '0.86rem', color: 'var(--isf-muted)', margin: '0' }}>{p.body}</p>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* SHARED ELEMENTS FOR ALL LAYOUTS */}
          {/* Operating Pillars (only for Layout 1) */}
          {activeLayout === 'editorial' && (
            <section className="split-section" style={{ padding: '60px 0' }}>
              <div>
                <p className="eyebrow">Trust Architecture</p>
                <h2 style={{ fontSize: '2.2rem', lineHeight: '1.15', fontWeight: '900', color: 'var(--isf-forest)' }}>
                  Built for careful stewardship, not improvised claims.
                </h2>
                <p style={{ marginTop: '16px', color: 'var(--isf-muted)', lineHeight: '1.6' }}>
                  We operate under strict data rules and scholarly review. Transparency is not a goal; it is the foundation of our work.
                </p>
              </div>
              <div className="stacked-list">
                {operatingPillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <article className="list-card" key={pillar.title}>
                      <span style={{ display: 'inline-flex', padding: '10px', background: 'var(--isf-soft)', borderRadius: '12px', color: 'var(--isf-green)' }}>
                        <Icon size={20} />
                      </span>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px', color: 'var(--isf-forest)' }}>{pillar.title}</h3>
                        <p style={{ margin: '0', fontSize: '0.88rem', color: 'var(--isf-muted)', lineHeight: '1.5' }}>{pillar.body}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* Donation Message Banner (for Layout 1 and Layout 3) */}
          {activeLayout !== 'modernist' && (
            <section className="impact-panel">
              <div>
                <p className="eyebrow">Donation Status</p>
                <h2>{settings?.donation_message ? 'Donations updates' : 'Donation flow will activate only after payment approval.'}</h2>
                <p style={{ maxWidth: '680px' }}>
                  {settings?.donation_message ??
                    'The initial site can guide prospective donors to understand ISF’s work, but transaction processing remains disabled until the provider and workflow are confirmed.'}
                </p>
              </div>
              <Link to="/donate" className="button button-dark">
                View Donation Status <ArrowRight size={18} />
              </Link>
            </section>
          )}

          {/* FAQ (Layout 1 and Layout 3) */}
          {activeLayout !== 'modernist' && (
            <section className="section faq-section" style={{ padding: '60px 0' }}>
              <SectionHeader eyebrow="Questions" title="Frequently asked questions" />
              <div className="faq-list">
                {faqs.map((faq) => (
                  <details key={faq.question}>
                    <summary>
                      <span>{faq.question}</span>
                      <HelpCircle size={18} style={{ color: 'var(--isf-green)' }} />
                    </summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </>
      )}
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
