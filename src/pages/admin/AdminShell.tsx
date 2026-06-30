import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, LogOut, UserCheck, ShieldAlert, LayoutDashboard, Settings, Image, Calendar, Megaphone, Heart, FileText, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { MediaManager } from '@/components/admin/MediaManager';
import { ProgramsManager } from '@/components/admin/ProgramsManager';
import { CampaignsManager } from '@/components/admin/CampaignsManager';
import { EventsManager } from '@/components/admin/EventsManager';
import { StoriesManager } from '@/components/admin/StoriesManager';
import { ResourcesManager } from '@/components/admin/ResourcesManager';

type CmsTab =
  | 'Dashboard overview'
  | 'Programs and services'
  | 'Campaigns and appeals'
  | 'Activities and events'
  | "Da'wah resources"
  | 'Impact stories and updates'
  | 'Media library'
  | 'Site settings'
  | 'Pages'
  | 'Staff access and roles'
  | 'Audit history';

export function AdminShell() {
  const { session, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<CmsTab>('Dashboard overview');

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--isf-green)' }} />
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

  function renderTabContent() {
    switch (activeTab) {
      case 'Dashboard overview':
        return (
          <div className="dashboard-home">
            <h2>Assalamu Alaikum, {profile?.display_name}</h2>
            <p>Welcome to the ISF content operations dashboard. Use the sidebar to navigate modules.</p>

            <div className="stats-grid">
              <article className="stat-card">
                <h3>Your Role</h3>
                <span className="stat-val">{profile?.role.toUpperCase()}</span>
              </article>
              <article className="stat-card">
                <h3>Account Status</h3>
                <span className="stat-val status-active">ACTIVE</span>
              </article>
            </div>
          </div>
        );
      case 'Site settings':
        return <SettingsManager />;
      case 'Media library':
        return <MediaManager />;
      case 'Programs and services':
        return <ProgramsManager />;
      case 'Campaigns and appeals':
        return <CampaignsManager />;
      case 'Activities and events':
        return <EventsManager />;
      case "Da'wah resources":
        return <ResourcesManager />;
      case 'Impact stories and updates':
        return <StoriesManager />;
      default:
        return (
          <div className="placeholder-tab">
            <Info size={32} />
            <h3>Module Integration Pending</h3>
            <p>The "{activeTab}" module is approved in data contract 0.1.0 and is queued for interface integration.</p>
          </div>
        );
    }
  }

  function getTabIcon(tab: CmsTab) {
    switch (tab) {
      case 'Dashboard overview':
        return <LayoutDashboard size={16} />;
      case 'Site settings':
        return <Settings size={16} />;
      case 'Media library':
        return <Image size={16} />;
      case 'Programs and services':
        return <Heart size={16} />;
      case 'Campaigns and appeals':
        return <Megaphone size={16} />;
      case 'Activities and events':
        return <Calendar size={16} />;
      case "Da'wah resources":
        return <FileText size={16} />;
      default:
        return <Info size={16} />;
    }
  }

  const tabs: CmsTab[] = [
    'Dashboard overview',
    'Programs and services',
    'Campaigns and appeals',
    'Activities and events',
    "Da'wah resources",
    'Impact stories and updates',
    'Media library',
    'Site settings',
    'Pages',
    'Staff access and roles',
    'Audit history',
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src="/assets/isf-logo.svg" alt="" className="brand-mark" />
          <span>ISF Console</span>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`sidebar-link ${activeTab === tab ? 'active' : ''}`}
            >
              {getTabIcon(tab)}
              <span>{tab}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="staff-identity">
            <span className="identity-badge">
              <UserCheck size={12} />
              {profile?.display_name}
            </span>
          </div>
          <button onClick={signOut} className="sidebar-logout">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <span className="breadcrumbs">Console / {activeTab}</span>
          <Link to="/" className="button button-secondary back-btn">
            View Live Site
          </Link>
        </header>

        <section className="admin-content">{renderTabContent()}</section>
      </main>
    </div>
  );
}
