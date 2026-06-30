import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Phone, MapPin, CheckCircle, Loader2 } from 'lucide-react';

interface ContactSettings {
  primary_email: string | null;
  primary_phone: string | null;
  address: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
}

export function Contact() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'general' | 'volunteer' | 'partnership' | 'media' | 'support'>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('primary_email, primary_phone, address, instagram_url, facebook_url')
      .eq('id', true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data as ContactSettings);
      });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError('You must give consent to store your data for processing.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: dbError } = await supabase.from('public_inquiries').insert({
        type,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
        consent,
      });

      if (dbError) {
        setError(dbError.message);
      } else {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
        setConsent(false);
      }
    } catch (err) {
      console.error('Inquiry submission failed:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-section">
      <div className="contact-grid">
        <div className="contact-info-panel">
          <p className="eyebrow">Official channels</p>
          <h1>Get in touch with ISF</h1>
          <p>
            Have inquiries about da’wah resources, partnership proposals, or volunteering opportunities? Use the contact details or the inquiry form to connect.
          </p>

          <div className="contact-methods">
            {settings?.primary_email && (
              <div className="method-row">
                <Mail size={18} />
                <span>{settings.primary_email}</span>
              </div>
            )}
            {settings?.primary_phone && (
              <div className="method-row">
                <Phone size={18} />
                <span>{settings.primary_phone}</span>
              </div>
            )}
            {settings?.address && (
              <div className="method-row">
                <MapPin size={18} />
                <span>{settings.address}</span>
              </div>
            )}
          </div>

          <div className="social-links" style={{ marginTop: '24px' }}>
            {settings?.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
            {settings?.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer">
                Facebook
              </a>
            )}
          </div>
        </div>

        <div className="inquiry-form-panel">
          <form onSubmit={handleSubmit} className="cms-form inquiry-form">
            <h2>Send an Inquiry</h2>
            {error && <div className="form-error">{error}</div>}
            {success && (
              <div className="form-success-alert">
                <CheckCircle size={20} />
                <div>
                  <strong>Message Sent Successfully</strong>
                  <p>Thank you. Your inquiry has been received by our staff.</p>
                </div>
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  disabled={submitting}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aliyu"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  disabled={submitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aliyu@example.com"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input
                  id="phone"
                  type="tel"
                  disabled={submitting}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Inquiry Type</label>
                <select
                  id="type"
                  disabled={submitting}
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="general">General Inquiry</option>
                  <option value="volunteer">Volunteer Application</option>
                  <option value="partnership">Partnership Proposal</option>
                  <option value="media">Media & Press</option>
                  <option value="support">Donor Support</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                required
                disabled={submitting}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How to support"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={4}
                required
                disabled={submitting}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide details of your inquiry..."
              />
            </div>

            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  required
                  disabled={submitting}
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                I consent to having this form's details stored securely for response.
              </label>
            </div>

            <button type="submit" className="button button-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Submitting...
                </>
              ) : (
                'Submit Inquiry'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
