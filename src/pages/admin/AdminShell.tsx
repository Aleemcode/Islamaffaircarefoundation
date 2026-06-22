import { Link } from 'react-router-dom';

import { adminModules } from '@/lib/navigation';
import { supabaseConfig } from '@/lib/supabase';

export function AdminShell() {
  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Admin CMS</p>
          <h1>ISF content operations shell</h1>
          <p>
            This protected area will manage canonical website content after the Supabase
            schema, RLS policies, and staff roles are applied.
          </p>
        </div>
        <Link to="/" className="button button-secondary">
          Back to Site
        </Link>
      </div>

      <div className="admin-status">
        <span>Supabase URL: {supabaseConfig.hasUrl ? 'configured' : 'missing'}</span>
        <span>Publishable key: {supabaseConfig.hasAnonKey ? 'configured' : 'missing'}</span>
        <span>Auth guard: pending staff-role schema</span>
      </div>

      <div className="admin-grid">
        {adminModules.map((module) => (
          <article className="admin-module" key={module}>
            <h2>{module}</h2>
            <p>Contract approved. Database-backed implementation pending migration.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
