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
      <header className="site-header" style={{ padding: '16px 0' }}>
        <NavLink to="/" className="brand-lockup" aria-label="Islamaffair Care Foundation home">
          <img src="/assets/isf-logo.svg" alt="Islamaffair Care Foundation" style={{ height: '38px', width: 'auto', display: 'block' }} />
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
          <div className="footer-brand" style={{ marginBottom: '16px' }}>
            <img src="/assets/isf-logo-white.svg" alt="Islamaffair Care Foundation" style={{ height: '36px', width: 'auto', display: 'block' }} />
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
