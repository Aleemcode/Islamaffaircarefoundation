import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SectionHeader } from '@/components/SectionHeader';
import { ShieldCheck } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  summary: string;
  story_type: string;
  occurred_on: string | null;
  location_label: string | null;
  evidence_note: string | null;
}

const defaultStories: Story[] = [
  {
    id: 's1',
    title: 'Ramadan Feeding Welfare Completed',
    summary: 'Distributed food supply boxes containing rice, beans, and cooking oil to families across local Lagos sub-districts.',
    story_type: 'welfare_outcome',
    occurred_on: '2026-03-15',
    location_label: 'Lagos Mainland, Nigeria',
    evidence_note: 'Verified delivery receipts under auditor sign-off.',
  },
  {
    id: 's2',
    title: 'Da’wah Outreach Textbooks Distributed',
    summary: 'Supplied authentic educational booklets to libraries and community learning centers.',
    story_type: 'dawah_update',
    occurred_on: '2026-04-10',
    location_label: 'Ogun State, Nigeria',
    evidence_note: 'Recipient log ledger book entries.',
  },
];

export function Impact() {
  const [stories, setStories] = useState<Story[]>(defaultStories);

  useEffect(() => {
    supabase
      .from('stories')
      .select('id, title, summary, story_type, occurred_on, location_label, evidence_note')
      .eq('status', 'published')
      .then(({ data }) => {
        if (data && data.length > 0) setStories(data as Story[]);
      });
  }, []);

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Impact"
        title="Verified updates & outcomes of our da’wah and welfare work"
        body="Read our latest announcements and impact logs. Stories are verified by explicit evidence references before publishing."
      />

      <div className="card-grid">
        {stories.map((story) => (
          <article className="program-card" key={story.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="cat-pill">{story.story_type.replace('_', ' ').toUpperCase()}</span>
              {story.evidence_note && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: '900', color: 'var(--isf-green)' }}>
                  <ShieldCheck size={12} /> VERIFIED
                </span>
              )}
            </div>
            <h3>{story.title}</h3>
            <p>{story.summary}</p>
            
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', borderTop: '1px solid rgba(102, 153, 52, 0.08)', paddingTop: '12px' }}>
              {story.occurred_on && (
                <div style={{ color: 'var(--isf-muted)' }}>
                  <strong>Date:</strong> {story.occurred_on}
                </div>
              )}
              {story.location_label && (
                <div style={{ color: 'var(--isf-muted)' }}>
                  <strong>Location:</strong> {story.location_label}
                </div>
              )}
              {story.evidence_note && (
                <div style={{ color: 'var(--isf-muted)', fontStyle: 'italic', background: 'var(--isf-soft)', padding: '8px 12px', borderRadius: '8px', marginTop: '4px' }}>
                  <strong>Source:</strong> {story.evidence_note}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
