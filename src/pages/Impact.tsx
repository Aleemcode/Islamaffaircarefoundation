import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SectionHeader } from '@/components/SectionHeader';
import { ShieldCheck, FileText, Loader2, Award } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  summary: string;
  story_type: string;
  occurred_on: string | null;
  location_label: string | null;
  evidence_note: string | null;
}

export function Impact() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('stories')
      .select('id, title, summary, story_type, occurred_on, location_label, evidence_note')
      .eq('status', 'published')
      .then(({ data }) => {
        if (data) setStories(data as Story[]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Impact"
        title="Verified updates & outcomes of our da’wah and welfare work"
        body="Read our latest announcements and impact logs. Stories are verified by explicit evidence references before publishing."
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="animate-spin text-isf-green" size={32} />
        </div>
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <h3>No impact updates found</h3>
          <p>Verified outcomes and updates will be listed here from CMS records.</p>
        </div>
      ) : (
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
      )}
    </section>
  );
}
