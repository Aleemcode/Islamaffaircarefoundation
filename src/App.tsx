import { Route, Routes } from 'react-router-dom';

import { Layout } from '@/components/Layout';
import { AuthProvider } from '@/components/AuthProvider';
import { Contact } from '@/pages/Contact';
import { Donate } from '@/pages/Donate';
import { Home } from '@/pages/Home';
import { Programs } from '@/pages/Programs';
import { Campaigns } from '@/pages/Campaigns';
import { Activities } from '@/pages/Activities';
import { Resources } from '@/pages/Resources';
import { Impact } from '@/pages/Impact';
import { StaticPage } from '@/pages/StaticPage';
import { AdminShell } from '@/pages/admin/AdminShell';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/about"
            element={
              <StaticPage
                eyebrow="About ISF"
                title="A faith-based foundation for service, learning, and outreach."
                body="The full organizational profile will be curated in the CMS after official verification. This page is ready for mission, vision, governance, and program history content."
              />
            }
          />
          <Route path="/programs" element={<Programs />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/impact" element={<Impact />} />
          <Route
            path="/get-involved"
            element={
              <StaticPage
                eyebrow="Get involved"
                title="Support pathways will be clear, dignified, and accountable."
                body="Volunteer, partnership, and support forms will connect to approved inquiry handling and anti-spam controls."
              />
            }
          />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/admin" element={<AdminShell />} />
      </Routes>
    </AuthProvider>
  );
}
