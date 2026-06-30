import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SectionHeader } from '@/components/SectionHeader';
import { BookOpen, ExternalLink, Loader2, Award } from 'lucide-react';

interface DawahResource {
  id: string;
  title: string;
  summary: string;
  resource_type: string;
  speaker_or_author: string | null;
  external_url: string | null;
  topics: string[];
}

export function Resources() {
  const [resources, setResources] = useState<DawahResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('dawah_resources')
      .select('id, title, summary, resource_type, speaker_or_author, external_url, topics')
      .eq('status', 'published')
      .eq('review_status', 'approved')
      .then(({ data }) => {
        if (data) setResources(data as DawahResource[]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Da’wah resources"
        title="Scholarly articles, educational tracks & verified publications"
        body="Access authentic learning guides reviewed and approved by certified Islamic scholars."
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="animate-spin text-isf-green" size={32} />
        </div>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <h3>No resources active</h3>
          <p>Verified learning materials will appear here after scholarly review.</p>
        </div>
      ) : (
        <div className="card-grid">
          {resources.map((res) => (
            <article className="program-card" key={res.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="cat-pill">{res.resource_type.toUpperCase()}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: '900', color: 'var(--isf-green)' }}>
                  <Award size={12} /> VERIFIED
                </span>
              </div>
              <h3>{res.title}</h3>
              <p>{res.summary}</p>
              
              {res.speaker_or_author && (
                <p className="field-hint" style={{ marginTop: '10px' }}>
                  <strong>Scholar/Author:</strong> {res.speaker_or_author}
                </p>
              )}

              {res.topics.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                  {res.topics.map((topic) => (
                    <span key={topic} style={{ fontSize: '0.72rem', background: 'var(--isf-soft)', padding: '2px 8px', borderRadius: '4px', color: 'var(--isf-muted)', fontWeight: '700' }}>
                      #{topic}
                    </span>
                  ))}
                </div>
              )}

              {res.external_url && (
                <a
                  href={res.external_url}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary"
                  style={{ marginTop: '20px', width: '100%', minHeight: '38px', fontSize: '0.84rem' }}
                >
                  Access Resource <ExternalLink size={12} />
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
