import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface SiteSettings {
  donation_message: string;
}

export function Donate() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('donation_message')
      .eq('id', true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data as SiteSettings);
      });
  }, []);

  return (
    <section className="page-section">
      <div className="donate-card" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '40px 24px' }}>
        <p className="eyebrow">Donation status</p>
        <h1>Online giving is not active yet.</h1>
        <p style={{ margin: '16px 0 24px', lineHeight: '1.6', color: 'var(--isf-muted)' }}>
          {settings?.donation_message ??
            'ISF’s donation interface is intentionally a placeholder until the payment provider, account details, authorization process, and donor receipt workflow are approved.'}
        </p>
        <div className="hero-actions" style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/programs" className="button button-primary">
            Explore Service Areas
          </Link>
          <Link to="/contact" className="button button-secondary">
            Contact ISF
          </Link>
        </div>
      </div>
    </section>
  );
}
