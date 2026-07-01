import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SectionHeader } from '@/components/SectionHeader';
import { ExternalLink, Award } from 'lucide-react';

interface DawahResource {
  id: string;
  title: string;
  summary: string;
  resource_type: string;
  speaker_or_author: string | null;
  external_url: string | null;
  topics: string[];
}

const defaultResources: DawahResource[] = [
  {
    id: 'r1',
    title: 'Understanding Zakat Al-Maal',
    summary: 'A comprehensive, scholar-reviewed guide on calculating Zakat for modern assets and wealth classes.',
    resource_type: 'article',
    speaker_or_author: 'ISF Scholarly Board',
    external_url: '#',
    topics: ['zakat', 'wealth', 'jurisprudence'],
  },
  {
    id: 'r2',
    title: 'The Essence of Sincerity in Da’wah',
    summary: 'An educational booklet outlining verified principles of Islamic calling and community outreach.',
    resource_type: 'booklet',
    speaker_or_author: 'Ustadh Al-Amin',
    external_url: null,
    topics: ['dawah', 'sincerity', 'ethics'],
  },
];

export function Resources() {
  const [resources, setResources] = useState<DawahResource[]>(defaultResources);

  useEffect(() => {
    supabase
      .from('dawah_resources')
      .select('id, title, summary, resource_type, speaker_or_author, external_url, topics')
      .eq('status', 'published')
      .eq('review_status', 'approved')
      .then(({ data }) => {
        if (data && data.length > 0) setResources(data as DawahResource[]);
      });
  }, []);

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Da’wah resources"
        title="Scholarly articles, educational tracks & verified publications"
        body="Access authentic learning guides reviewed and approved by certified Islamic scholars."
      />

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
    </section>
  );
}
