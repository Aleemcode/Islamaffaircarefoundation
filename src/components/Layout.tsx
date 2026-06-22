import { Menu } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import { organization } from '@/data/siteContent';
import { publicNavItems } from '@/lib/navigation';

function navClassName({ isActive }: { isActive: boolean }) {
  return isActive ? 'nav-link nav-link-active' : 'nav-link';
}

export function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink to="/" className="brand-lockup" aria-label="ISF home">
          <img src="/assets/isf-logo.svg" alt="" className="brand-mark" />
          <span>{organization.shortName}</span>
        </NavLink>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {publicNavItems.map((item) => (
            <NavLink key={item.href} to={item.href} className={navClassName}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink to="/donate" className="button button-primary">
          Support
        </NavLink>

        <button className="mobile-menu-button" type="button" aria-label="Open menu">
          <Menu size={22} />
        </button>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div>
          <div className="brand-lockup footer-brand">
            <img src="/assets/isf-logo.svg" alt="" className="brand-mark" />
            <span>{organization.shortName}</span>
          </div>
          <p>
            A faith-based platform for da’wah, welfare, religious education, and community
            support.
          </p>
        </div>
        <div className="footer-links">
          <NavLink to="/programs">Programs</NavLink>
          <NavLink to="/resources">Da’wah Resources</NavLink>
          <NavLink to="/get-involved">Get Involved</NavLink>
          <NavLink to="/admin">Admin CMS</NavLink>
        </div>
      </footer>
    </div>
  );
}
