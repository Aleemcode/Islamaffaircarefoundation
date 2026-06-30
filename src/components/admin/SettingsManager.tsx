import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';

interface SiteSettings {
  organization_name: string;
  short_name: string;
  primary_email: string | null;
  primary_phone: string | null;
  address: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  donation_mode: 'placeholder' | 'enabled';
  donation_message: string;
}

export function SettingsManager() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', true)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else if (data) {
        setSettings(data as SiteSettings);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to fetch site settings.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!settings || !user) return;

    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          ...settings,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', true);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field: keyof SiteSettings, value: string | null) {
    if (!settings) return;
    setSettings({
      ...settings,
      [field]: value === '' ? null : value,
    });
  }

  if (loading) {
    return (
      <div className="manager-loading">
        <Loader2 className="animate-spin" size={24} /> Loading settings...
      </div>
    );
  }

  if (error && !settings) {
    return <div className="manager-error">Error: {error}</div>;
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Global Site Settings</h2>
        <p>Manage public contact channels, branding names, and system modes.</p>
      </div>

      {settings && (
        <form onSubmit={handleSubmit} className="cms-form">
          {error && <div className="form-error">{error}</div>}
          {success && (
            <div className="form-success">
              <CheckCircle2 size={16} /> Settings saved successfully!
            </div>
          )}

          <div className="form-grid-2">
            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                required
                value={settings.organization_name}
                onChange={(e) => handleChange('organization_name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Short Name / Brand</label>
              <input
                type="text"
                required
                value={settings.short_name}
                onChange={(e) => handleChange('short_name', e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Primary Email</label>
              <input
                type="email"
                value={settings.primary_email ?? ''}
                onChange={(e) => handleChange('primary_email', e.target.value)}
                placeholder="info@islamaffairs.org"
              />
            </div>

            <div className="form-group">
              <label>Primary Phone (E.164 format)</label>
              <input
                type="tel"
                value={settings.primary_phone ?? ''}
                onChange={(e) => handleChange('primary_phone', e.target.value)}
                placeholder="+2348000000000"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Physical Address</label>
            <textarea
              rows={2}
              value={settings.address ?? ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Lagos, Nigeria"
            />
          </div>

          <h3 className="section-title">Official Social Channels</h3>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Instagram URL</label>
              <input
                type="url"
                value={settings.instagram_url ?? ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Facebook URL</label>
              <input
                type="url"
                value={settings.facebook_url ?? ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
              />
            </div>
          </div>

          <h3 className="section-title">Donation Settings</h3>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Donation Mode</label>
              <select disabled value={settings.donation_mode}>
                <option value="placeholder">Placeholder Only (Non-functional)</option>
                <option value="enabled">Active Transactions (Deferred)</option>
              </select>
              <p className="field-hint">
                Donation mode is locked to Placeholder until payment integration is approved.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label>Donation / Pledge Message</label>
            <textarea
              rows={3}
              required
              value={settings.donation_message}
              onChange={(e) => handleChange('donation_message', e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
