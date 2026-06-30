import {
  BookOpen,
  CalendarDays,
  HandHeart,
  Landmark,
  Megaphone,
  ShieldCheck,
} from 'lucide-react';

export const organization = {
  name: 'Islamaffair Care Foundation',
  shortName: 'ISF',
  instagramUrl: 'https://www.instagram.com/islamaffaircarefoundation/',
  facebookUrl: 'https://web.facebook.com/Islamaffair.f/',
};

export const programAreas = [
  {
    title: 'Islamic Da’wah',
    summary:
      'Lectures, learning resources, and community education shaped by verified scholarship and careful review.',
    icon: Megaphone,
  },
  {
    title: 'Zakat and Sadaqa',
    summary:
      'A transparent welfare pathway for charitable support to vulnerable families and approved causes.',
    icon: HandHeart,
  },
  {
    title: 'Humanitarian Aid',
    summary:
      'Food, clothing, medical, Ramadan, and emergency support programs entered through the CMS before publication.',
    icon: ShieldCheck,
  },
] as const;

export const operatingPillars = [
  {
    title: 'Faithful service',
    body: 'Every public claim should be grounded in Islamic values, donor trust, and verified organizational records.',
    icon: Landmark,
  },
  {
    title: 'Content stewardship',
    body: 'The admin CMS is the source of truth for pages, programs, resources, activities, media, and settings.',
    icon: BookOpen,
  },
  {
    title: 'Accountable activity',
    body: 'Campaigns, events, and impact updates must show status, source context, and publication state.',
    icon: CalendarDays,
  },
] as const;

export const faqs = [
  {
    question: 'Can I donate online now?',
    answer:
      'Online donations are currently a placeholder until ISF approves a payment provider and workflow.',
  },
  {
    question: 'Where will official updates come from?',
    answer:
      'The CMS will be the canonical website source. Instagram and Facebook remain public distribution channels.',
  },
  {
    question: 'What media can the site publish?',
    answer:
      'Still media must avoid conventional images of living beings. Faceless illustration, non-animate imagery, documents, and approved video are supported.',
  },
] as const;
