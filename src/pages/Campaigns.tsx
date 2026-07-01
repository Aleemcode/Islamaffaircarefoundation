import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SectionHeader } from '@/components/SectionHeader';

interface Campaign {
  id: string;
  title: string;
  summary: string;
  campaign_status: string;
  goal_amount_minor: number | null;
  raised_amount_minor: number | null;
  funding_note: string | null;
}

const defaultCampaigns: Campaign[] = [
  {
    id: 'c1',
    title: 'Zakat & Sadaqah Welfare Appeal',
    summary: 'Direct food and medical relief program for distressed communities in Lagos and neighbouring states.',
    campaign_status: 'active',
    goal_amount_minor: 500000000,
    raised_amount_minor: 235000000,
    funding_note: 'Direct cash transfers and food distribution.',
  },
  {
    id: 'c2',
    title: 'Islamic Library & Da’wah Resources',
    summary: 'Funding for scholarly publication, translation, and distribution of verified textbooks and guides.',
    campaign_status: 'active',
    goal_amount_minor: 150000000,
    raised_amount_minor: 85000000,
    funding_note: 'Funding covers publication print runs and digital distribution.',
  },
];

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(defaultCampaigns);

  useEffect(() => {
    supabase
      .from('campaigns')
      .select('id, title, summary, campaign_status, goal_amount_minor, raised_amount_minor, funding_note')
      .eq('status', 'published')
      .then(({ data }) => {
        if (data && data.length > 0) setCampaigns(data as Campaign[]);
      });
  }, []);

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Campaigns"
        title="Active appeals & community welfare drives"
        body="Campaigns are published with verified funding targets. Donation capabilities remain non-functional until a payment provider is approved."
      />

      <div className="card-grid">
        {campaigns.map((c) => {
          const goal = c.goal_amount_minor ? c.goal_amount_minor / 100 : null;
          const raised = c.raised_amount_minor ? c.raised_amount_minor / 100 : 0;
          const percent = goal ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

          return (
            <article className="program-card" key={c.id}>
              <span className="cat-pill" style={{ display: 'inline-block', marginBottom: '8px' }}>
                {c.campaign_status.toUpperCase()}
              </span>
              <h3>{c.title}</h3>
              <p>{c.summary}</p>
              
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '800', marginBottom: '6px' }}>
                  <span>Raised: NGN {raised.toLocaleString()}</span>
                  {goal && <span>Goal: NGN {goal.toLocaleString()}</span>}
                </div>
                {goal && (
                  <div style={{ width: '100%', height: '8px', background: 'var(--isf-soft)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: 'var(--isf-green)' }}></div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
