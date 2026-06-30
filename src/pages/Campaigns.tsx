import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SectionHeader } from '@/components/SectionHeader';
import { Loader2 } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  summary: string;
  campaign_status: string;
  goal_amount_minor: number | null;
  raised_amount_minor: number | null;
  funding_note: string | null;
}

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('campaigns')
      .select('id, title, summary, campaign_status, goal_amount_minor, raised_amount_minor, funding_note')
      .eq('status', 'published')
      .then(({ data }) => {
        if (data) setCampaigns(data as Campaign[]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Campaigns"
        title="Active appeals & community welfare drives"
        body="Campaigns are published with verified funding targets. Donation capabilities remain non-functional until a payment provider is approved."
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="animate-spin text-isf-green" size={32} />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="empty-state">
          <h3>No active campaigns</h3>
          <p>Verified appeals and funding goals will appear here when configured in the CMS.</p>
        </div>
      ) : (
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
      )}
    </section>
  );
}
