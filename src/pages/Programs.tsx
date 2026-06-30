import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SectionHeader } from '@/components/SectionHeader';
import { Megaphone, HandHeart, ShieldCheck, Landmark, Loader2 } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: 'zakat_sadaqa' | 'dawah' | 'humanitarian_aid' | 'other';
  objectives: string[];
  service_regions: string[];
}

export function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('programs')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setPrograms(data as Program[]);
        setLoading(false);
      });
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

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Programs"
        title="Da’wah, welfare, and humanitarian aid pathways."
        body="Explore the approved outreach, educational, and charitable welfare programs managed by the foundation."
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="animate-spin text-isf-green" size={32} />
        </div>
      ) : programs.length === 0 ? (
        <div className="empty-state">
          <h3>No programs active currently</h3>
          <p>Active programs will be published here directly from the CMS.</p>
        </div>
      ) : (
        <div className="card-grid">
          {programs.map((program) => {
            const Icon = getCategoryIcon(program.category);
            return (
              <article className="program-card" key={program.id}>
                <span className="icon-chip">
                  <Icon size={22} />
                </span>
                <h3>{program.title}</h3>
                <p>{program.summary}</p>
                {program.service_regions.length > 0 && (
                  <p className="field-hint" style={{ marginTop: '8px' }}>
                    <strong>Regions:</strong> {program.service_regions.join(', ')}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
