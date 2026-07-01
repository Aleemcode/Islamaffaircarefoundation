import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SectionHeader } from '@/components/SectionHeader';
import { Megaphone, HandHeart, ShieldCheck, Landmark } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: 'zakat_sadaqa' | 'dawah' | 'humanitarian_aid' | 'other';
  objectives: string[];
  service_regions: string[];
}

const defaultPrograms: Program[] = [
  {
    id: 'p1',
    title: 'Islamic Da’wah',
    summary: 'Lectures, learning resources, and community education shaped by verified scholarship and review.',
    body: 'Outreach programs, learning materials, and scholarly textbooks.',
    category: 'dawah',
    objectives: ['Promote authentic knowledge', 'Provide verified learning materials'],
    service_regions: ['Lagos', 'South-West Nigeria'],
  },
  {
    id: 'p2',
    title: 'Zakat and Sadaqa',
    summary: 'A transparent welfare pathway for charitable support to vulnerable families.',
    body: 'Direct distribution, Zakat audits, and support to approved recipients.',
    category: 'zakat_sadaqa',
    objectives: ['Eradicate poverty', 'Transparent distribution under scholarly review'],
    service_regions: ['Lagos', 'Ogun', 'Oyo'],
  },
  {
    id: 'p3',
    title: 'Humanitarian Aid',
    summary: 'Food, clothing, medical, and emergency relief programs.',
    body: 'Providing welfare items, running emergency response, food drives.',
    category: 'humanitarian_aid',
    objectives: ['Provide immediate relief', 'Distribute welfare items without leakages'],
    service_regions: ['Lagos', 'Nationwide'],
  },
];

export function Programs() {
  const [programs, setPrograms] = useState<Program[]>(defaultPrograms);

  useEffect(() => {
    supabase
      .from('programs')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setPrograms(data as Program[]);
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
    </section>
  );
}
