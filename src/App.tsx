import { Route, Routes } from 'react-router-dom';

import { Layout } from '@/components/Layout';
import { Contact } from '@/pages/Contact';
import { Donate } from '@/pages/Donate';
import { Home } from '@/pages/Home';
import { StaticPage } from '@/pages/StaticPage';
import { AdminShell } from '@/pages/admin/AdminShell';

export default function App() {
  return (
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
        <Route
          path="/programs"
          element={
            <StaticPage
              eyebrow="Programs"
              title="Da’wah, welfare, and humanitarian aid pathways."
              body="These are the approved initial program categories. Specific active services, regions, eligibility, and contact details will come from CMS records."
              mode="cards"
            />
          }
        />
        <Route
          path="/campaigns"
          element={
            <StaticPage
              eyebrow="Campaigns"
              title="Campaigns will publish only with verified goals and status."
              body="The campaign route is prepared for appeals, progress notes, funding context, and donation status once records are entered and approved."
            />
          }
        />
        <Route
          path="/activities"
          element={
            <StaticPage
              eyebrow="Activities"
              title="Events and activities will be scheduled from the CMS."
              body="Lectures, seminars, outreach activity, and community support events will appear here after verification."
            />
          }
        />
        <Route
          path="/resources"
          element={
            <StaticPage
              eyebrow="Da’wah resources"
              title="Religious resources require review before publication."
              body="Articles, video, audio, documents, and links will publish here only after the approved review workflow is implemented."
            />
          }
        />
        <Route
          path="/impact"
          element={
            <StaticPage
              eyebrow="Impact"
              title="Impact stories and metrics will be evidence-led."
              body="Verified source notes, periods, and owners are required before statistics or field updates appear publicly."
            />
          }
        />
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
  );
}
