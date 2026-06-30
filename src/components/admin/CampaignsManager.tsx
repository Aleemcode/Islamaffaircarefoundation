import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Edit3, Trash2, Loader2, Save, X } from 'lucide-react';

interface Program {
  id: string;
  title: string;
}

interface Campaign {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  program_id: string | null;
  campaign_status: 'planned' | 'active' | 'paused' | 'completed' | 'archived';
  goal_amount_minor: number | null;
  currency: string | null;
  raised_amount_minor: number | null;
  starts_at: string | null;
  ends_at: string | null;
  funding_note: string | null;
  donation_enabled: boolean;
}

export function CampaignsManager() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState<Partial<Campaign> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form values in major units for visual ease (e.g. NGN 1,000 instead of 100,000 minor units)
  const [goalMajor, setGoalMajor] = useState('');
  const [raisedMajor, setRaisedMajor] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [campaignsRes, programsRes] = await Promise.all([
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('programs').select('id, title').eq('status', 'published'),
      ]);

      if (campaignsRes.error) throw campaignsRes.error;
      if (programsRes.error) throw programsRes.error;

      setCampaigns(campaignsRes.data as Campaign[]);
      setPrograms(programsRes.data as Program[]);
    } catch (err: any) {
      console.error('Error fetching campaign data:', err);
      setError('Failed to fetch campaigns data.');
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setEditingCampaign({
      title: '',
      slug: '',
      summary: '',
      body: '',
      status: 'draft',
      program_id: null,
      campaign_status: 'planned',
      goal_amount_minor: null,
      currency: 'NGN',
      raised_amount_minor: 0,
      starts_at: '',
      ends_at: '',
      funding_note: '',
      donation_enabled: false,
    });
    setGoalMajor('');
    setRaisedMajor('0');
  }

  function handleEdit(campaign: Campaign) {
    setEditingCampaign(campaign);
    setGoalMajor(campaign.goal_amount_minor ? (campaign.goal_amount_minor / 100).toString() : '');
    setRaisedMajor(campaign.raised_amount_minor ? (campaign.raised_amount_minor / 100).toString() : '0');
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editingCampaign || !user) return;

    setSaving(true);
    setError(null);

    const goal_amount_minor = goalMajor ? Math.round(parseFloat(goalMajor) * 100) : null;
    const raised_amount_minor = raisedMajor ? Math.round(parseFloat(raisedMajor) * 100) : 0;

    const slug = editingCampaign.title
      ? editingCampaign.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : '';

    const payload = {
      ...editingCampaign,
      slug,
      goal_amount_minor,
      raised_amount_minor,
      starts_at: editingCampaign.starts_at || null,
      ends_at: editingCampaign.ends_at || null,
      program_id: editingCampaign.program_id || null,
      donation_enabled: false, // Core behavioral rule enforcement: must remain false
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingCampaign.id) {
        const { error: dbError } = await supabase
          .from('campaigns')
          .update(payload)
          .eq('id', editingCampaign.id);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('campaigns').insert({
          ...payload,
          created_by: user.id,
        });
        if (dbError) throw dbError;
      }

      setEditingCampaign(null);
      fetchData();
    } catch (err: any) {
      console.error('Failed to save campaign:', err);
      setError(err.message ?? 'Failed to save campaign.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const { error: dbError } = await supabase.from('campaigns').delete().eq('id', id);
      if (dbError) throw dbError;
      fetchData();
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(`Delete failed: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <div className="manager-loading">
        <Loader2 className="animate-spin" size={24} /> Loading campaigns...
      </div>
    );
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Campaigns & Appeals</h2>
        <p>Manage charity appeals, zakat/sadaqa collections, and humanitarian goals.</p>
        <button onClick={handleCreate} className="button button-primary" style={{ marginTop: '12px' }}>
          <Plus size={16} /> Add Campaign
        </button>
      </div>

      {editingCampaign && (
        <div className="cms-modal">
          <form onSubmit={handleSave} className="cms-form modal-content modal-large">
            <div className="modal-header">
              <h3>{editingCampaign.id ? 'Edit Campaign' : 'New Campaign'}</h3>
              <button type="button" onClick={() => setEditingCampaign(null)} className="close-btn">
                <X size={18} />
              </button>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="form-grid-2">
              <div className="form-group">
                <label>Campaign Title</label>
                <input
                  type="text"
                  required
                  value={editingCampaign.title ?? ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Parent Program</label>
                <select
                  value={editingCampaign.program_id ?? ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, program_id: e.target.value })}
                >
                  <option value="">None / Independent</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Summary</label>
              <input
                type="text"
                required
                maxLength={320}
                value={editingCampaign.summary ?? ''}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, summary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Detailed Appeal Details (Markdown)</label>
              <textarea
                rows={5}
                required
                value={editingCampaign.body ?? ''}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, body: e.target.value })}
              />
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Goal Amount (in NGN)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={goalMajor}
                  onChange={(e) => setGoalMajor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Raised Amount (in NGN)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={raisedMajor}
                  onChange={(e) => setRaisedMajor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Campaign Status</label>
                <select
                  value={editingCampaign.campaign_status ?? 'planned'}
                  onChange={(e) =>
                    setEditingCampaign({
                      ...editingCampaign,
                      campaign_status: e.target.value as Campaign['campaign_status'],
                    })
                  }
                >
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="datetime-local"
                  value={editingCampaign.starts_at ? editingCampaign.starts_at.slice(0, 16) : ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, starts_at: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="datetime-local"
                  value={editingCampaign.ends_at ? editingCampaign.ends_at.slice(0, 16) : ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, ends_at: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Publish State</label>
                <select
                  value={editingCampaign.status ?? 'draft'}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, status: e.target.value as Campaign['status'] })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Funding Context / Audit Note</label>
              <input
                type="text"
                placeholder="e.g. Verification details of raised amounts"
                value={editingCampaign.funding_note ?? ''}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, funding_note: e.target.value })}
              />
            </div>

            <div className="form-group-checkbox disabled-box">
              <label>
                <input type="checkbox" disabled checked={false} />
                Enable direct online donations for this campaign (Locked)
              </label>
              <p className="field-hint">
                Payment gateways are disabled until verified accounts are linked.
              </p>
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Campaign
              </button>
              <button type="button" className="button button-secondary" onClick={() => setEditingCampaign(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="empty-state">No campaigns found.</div>
      ) : (
        <div className="table-responsive">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Target Goal</th>
                <th>Raised</th>
                <th>Publish Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td><strong>{campaign.title}</strong></td>
                  <td><span className="cat-pill">{campaign.campaign_status}</span></td>
                  <td>{campaign.goal_amount_minor ? `NGN ${(campaign.goal_amount_minor / 100).toLocaleString()}` : 'No limit'}</td>
                  <td>NGN {(campaign.raised_amount_minor ? campaign.raised_amount_minor / 100 : 0).toLocaleString()}</td>
                  <td><span className={`status-badge status-${campaign.status}`}>{campaign.status}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button onClick={() => handleEdit(campaign)} className="edit-btn">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(campaign.id)} className="delete-btn">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
