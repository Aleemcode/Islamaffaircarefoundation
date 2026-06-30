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
  title: string;
}

interface Story {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  story_type: 'impact' | 'news' | 'announcement' | 'field_update';
  program_id: string | null;
  campaign_id: string | null;
  occurred_on: string | null;
  location_label: string | null;
  evidence_note: string | null;
  featured: boolean;
}

export function StoriesManager() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStory, setEditingStory] = useState<Partial<Story> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [storiesRes, programsRes, campaignsRes] = await Promise.all([
        supabase.from('stories').select('*').order('created_at', { ascending: false }),
        supabase.from('programs').select('id, title').eq('status', 'published'),
        supabase.from('campaigns').select('id, title').eq('status', 'published'),
      ]);

      if (storiesRes.error) throw storiesRes.error;
      if (programsRes.error) throw programsRes.error;
      if (campaignsRes.error) throw campaignsRes.error;

      setStories(storiesRes.data as Story[]);
      setPrograms(programsRes.data as Program[]);
      setCampaigns(campaignsRes.data as Campaign[]);
    } catch (err: any) {
      console.error('Error fetching story data:', err);
      setError('Failed to fetch stories.');
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setEditingStory({
      title: '',
      slug: '',
      summary: '',
      body: '',
      status: 'draft',
      story_type: 'news',
      program_id: null,
      campaign_id: null,
      occurred_on: new Date().toISOString().split('T')[0],
      location_label: '',
      evidence_note: '',
      featured: false,
    });
  }

  function handleEdit(story: Story) {
    setEditingStory(story);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editingStory || !user) return;

    setSaving(true);
    setError(null);

    // Enforce evidence_note for impact claims
    if (editingStory.story_type === 'impact' && !editingStory.evidence_note?.trim()) {
      setError('Evidence Note is required for impact claims to verify authenticity.');
      setSaving(false);
      return;
    }

    const slug = editingStory.title
      ? editingStory.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : '';

    const payload = {
      ...editingStory,
      slug,
      occurred_on: editingStory.occurred_on || null,
      program_id: editingStory.program_id || null,
      campaign_id: editingStory.campaign_id || null,
      location_label: editingStory.location_label || null,
      evidence_note: editingStory.evidence_note || null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingStory.id) {
        const { error: dbError } = await supabase
          .from('stories')
          .update(payload)
          .eq('id', editingStory.id);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('stories').insert({
          ...payload,
          created_by: user.id,
        });
        if (dbError) throw dbError;
      }

      setEditingStory(null);
      fetchData();
    } catch (err: any) {
      console.error('Failed to save story:', err);
      setError(err.message ?? 'Failed to save story.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    try {
      const { error: dbError } = await supabase.from('stories').delete().eq('id', id);
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
        <Loader2 className="animate-spin" size={24} /> Loading stories...
      </div>
    );
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Impact Stories & Updates</h2>
        <p>Publish project outcomes, news, announcements, and verified field updates.</p>
        <button onClick={handleCreate} className="button button-primary" style={{ marginTop: '12px' }}>
          <Plus size={16} /> Add Story
        </button>
      </div>

      {editingStory && (
        <div className="cms-modal">
          <form onSubmit={handleSave} className="cms-form modal-content modal-large">
            <div className="modal-header">
              <h3>{editingStory.id ? 'Edit Story' : 'New Story'}</h3>
              <button type="button" onClick={() => setEditingStory(null)} className="close-btn">
                <X size={18} />
              </button>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="form-grid-2">
              <div className="form-group">
                <label>Story Title</label>
                <input
                  type="text"
                  required
                  value={editingStory.title ?? ''}
                  onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Story Type</label>
                <select
                  value={editingStory.story_type ?? 'news'}
                  onChange={(e) =>
                    setEditingStory({ ...editingStory, story_type: e.target.value as Story['story_type'] })
                  }
                >
                  <option value="news">News Update</option>
                  <option value="impact">Impact Claim</option>
                  <option value="announcement">Announcement</option>
                  <option value="field_update">Field Update</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Brief Summary</label>
              <input
                type="text"
                required
                maxLength={320}
                value={editingStory.summary ?? ''}
                onChange={(e) => setEditingStory({ ...editingStory, summary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Detailed Content (Markdown)</label>
              <textarea
                rows={5}
                required
                value={editingStory.body ?? ''}
                onChange={(e) => setEditingStory({ ...editingStory, body: e.target.value })}
              />
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Related Program</label>
                <select
                  value={editingStory.program_id ?? ''}
                  onChange={(e) => setEditingStory({ ...editingStory, program_id: e.target.value })}
                >
                  <option value="">None</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Related Campaign</label>
                <select
                  value={editingStory.campaign_id ?? ''}
                  onChange={(e) => setEditingStory({ ...editingStory, campaign_id: e.target.value })}
                >
                  <option value="">None</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Publish State</label>
                <select
                  value={editingStory.status ?? 'draft'}
                  onChange={(e) =>
                    setEditingStory({ ...editingStory, status: e.target.value as Story['status'] })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Date Occurred</label>
                <input
                  type="date"
                  value={editingStory.occurred_on ?? ''}
                  onChange={(e) => setEditingStory({ ...editingStory, occurred_on: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Location Label (e.g. Lagos office)</label>
                <input
                  type="text"
                  value={editingStory.location_label ?? ''}
                  onChange={(e) => setEditingStory({ ...editingStory, location_label: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Evidence Note {editingStory.story_type === 'impact' && <span style={{ color: 'red' }}>(Required for Impact)</span>}
              </label>
              <input
                type="text"
                placeholder="Identify the document or audit source validating this update"
                value={editingStory.evidence_note ?? ''}
                onChange={(e) => setEditingStory({ ...editingStory, evidence_note: e.target.value })}
              />
            </div>

            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={editingStory.featured ?? false}
                  onChange={(e) => setEditingStory({ ...editingStory, featured: e.target.checked })}
                />
                Feature this story on the home screen
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Story
              </button>
              <button type="button" className="button button-secondary" onClick={() => setEditingStory(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {stories.length === 0 ? (
        <div className="empty-state">No stories found.</div>
      ) : (
        <div className="table-responsive">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Location</th>
                <th>Publish Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((story) => (
                <tr key={story.id}>
                  <td><strong>{story.title}</strong></td>
                  <td><span className="cat-pill">{story.story_type}</span></td>
                  <td>{story.occurred_on ?? 'N/A'}</td>
                  <td>{story.location_label ?? 'N/A'}</td>
                  <td><span className={`status-badge status-${story.status}`}>{story.status}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button onClick={() => handleEdit(story)} className="edit-btn">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(story.id)} className="delete-btn">
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
