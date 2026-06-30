import { Link } from 'react-router-dom';
import { Loader2, LogOut, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { adminModules } from '@/lib/navigation';

export function AdminShell() {
  const { session, profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <Loader2 className="animate-spin text-isf-green" size={40} />
        <p>Verifying credentials...</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  // Not in staff_profiles or not active
  if (!profile || !profile.active) {
    return (
      <section className="login-container">
        <div className="login-card status-card">
          <div className="login-header">
            <div className="icon-badge alert-badge">
              <ShieldAlert size={28} />
            </div>
            <h1>Pending Activation</h1>
            <p>Your authentication is successful, but your staff account is not active.</p>
          </div>

          <div className="status-details">
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>User ID:</strong> {session.user?.id}</p>
            <p className="status-note">
              Please provide your User ID to the site Owner or Admin to register and activate your staff access.
            </p>
          </div>

          <button onClick={signOut} className="button button-secondary logout-button">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Admin CMS — Connected</p>
          <h1>ISF Content Operations</h1>
          <div className="staff-identity">
            <span className="identity-badge">
              <UserCheck size={14} />
              {profile.display_name} ({profile.role})
            </span>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/" className="button button-secondary">
            Back to Site
          </Link>
          <button onClick={signOut} className="button button-dark logout-button">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="admin-grid">
        {adminModules.map((module) => (
          <article className="admin-module" key={module}>
            <h2>{module}</h2>
            <p>Authorized access as {profile.role}. Content operations module pending integration.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
