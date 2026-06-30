import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SectionHeader } from '@/components/SectionHeader';
import { Calendar, MapPin, Loader2, ExternalLink } from 'lucide-react';

interface EventActivity {
  id: string;
  title: string;
  summary: string;
  mode: 'physical' | 'online' | 'hybrid';
  starts_at: string;
  venue_name: string | null;
  registration_url: string | null;
  registration_required: boolean;
}

export function Activities() {
  const [events, setEvents] = useState<EventActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('activities')
      .select('id, title, summary, mode, starts_at, venue_name, registration_url, registration_required')
      .eq('status', 'published')
      .order('starts_at', { ascending: true })
      .then(({ data }) => {
        if (data) setEvents(data as EventActivity[]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Activities"
        title="Lectures, outreach schedules & community seminars"
        body="Join our upcoming events. Find location details, time schedules, and registration pathways below."
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="animate-spin text-isf-green" size={32} />
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <h3>No events scheduled</h3>
          <p>Upcoming seminars and community works will list here when added to the CMS.</p>
        </div>
      ) : (
        <div className="card-grid">
          {events.map((e) => (
            <article className="program-card" key={e.id}>
              <span className="cat-pill" style={{ display: 'inline-block', marginBottom: '8px' }}>
                {e.mode.toUpperCase()}
              </span>
              <h3>{e.title}</h3>
              <p>{e.summary}</p>
              
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--isf-muted)' }}>
                  <Calendar size={14} />
                  <span>{new Date(e.starts_at).toLocaleString()}</span>
                </div>
                {e.venue_name && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--isf-muted)' }}>
                    <MapPin size={14} />
                    <span>{e.venue_name}</span>
                  </div>
                )}
              </div>

              {e.registration_url && (
                <a
                  href={e.registration_url}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary"
                  style={{ marginTop: '20px', width: '100%', minHeight: '38px', fontSize: '0.84rem' }}
                >
                  Register <ExternalLink size={12} />
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
