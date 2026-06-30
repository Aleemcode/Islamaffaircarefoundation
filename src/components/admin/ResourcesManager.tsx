import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Edit3, Trash2, Loader2, Save, X, ShieldCheck } from 'lucide-react';

interface MediaAsset {
  id: string;
  file_name: string;
}

interface DawahResource {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  resource_type: 'article' | 'audio' | 'video' | 'document' | 'link';
  speaker_or_author: string | null;
  external_url: string | null;
  media_asset_id: string | null;
  topics: string[];
  review_status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export function ResourcesManager() {
  const { user, profile } = useAuth();
  const [resources, setResources] = useState<DawahResource[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<Partial<DawahResource> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [topicsText, setTopicsText] = useState('');

  const canApprove = profile?.role === 'owner' || profile?.role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [resourcesRes, mediaRes] = await Promise.all([
        supabase.from('dawah_resources').select('*').order('created_at', { ascending: false }),
        supabase.from('media_assets').select('id, file_name').eq('approval_status', 'approved'),
      ]);

      if (resourcesRes.error) throw resourcesRes.error;
      if (mediaRes.error) throw mediaRes.error;

      setResources(resourcesRes.data as DawahResource[]);
      setMediaAssets(mediaRes.data as MediaAsset[]);
    } catch (err: any) {
      console.error('Error fetching resource data:', err);
      setError('Failed to fetch resources.');
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setEditingResource({
      title: '',
      slug: '',
      summary: '',
      body: '',
      status: 'draft',
      resource_type: 'article',
      speaker_or_author: '',
      external_url: '',
      media_asset_id: null,
      topics: [],
      review_status: 'pending',
      reviewed_by: null,
      reviewed_at: null,
    });
    setTopicsText('');
  }

  function handleEdit(resource: DawahResource) {
    setEditingResource(resource);
    setTopicsText(resource.topics.join(', '));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editingResource || !user) return;

    setSaving(true);
    setError(null);

    const hasExternal = Boolean(editingResource.external_url?.trim());
    const hasMedia = Boolean(editingResource.media_asset_id);

    // Validation: Exactly one of external_url or media_asset_id is required
    if (hasExternal && hasMedia) {
      setError('Provide either an External URL or a Hosted Media Asset, not both.');
      setSaving(false);
      return;
    }
    if (!hasExternal && !hasMedia) {
      setError('You must specify either an External URL or link a Hosted Media Asset.');
      setSaving(false);
      return;
    }

    // Validation: Published resources require approved review state
    if (editingResource.status === 'published' && editingResource.review_status !== 'approved') {
      setError('Da’wah resources must have a review status of Approved before publishing.');
      setSaving(false);
      return;
    }

    const topics = topicsText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const slug = editingResource.title
      ? editingResource.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : '';

    const payload = {
      ...editingResource,
      slug,
      topics,
      external_url: editingResource.external_url || null,
      media_asset_id: editingResource.media_asset_id || null,
      reviewed_by: editingResource.review_status === 'approved' ? user.id : editingResource.reviewed_by || null,
      reviewed_at: editingResource.review_status === 'approved' ? new Date().toISOString() : editingResource.reviewed_at || null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingResource.id) {
        const { error: dbError } = await supabase
          .from('dawah_resources')
          .update(payload)
          .eq('id', editingResource.id);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('dawah_resources').insert({
          ...payload,
          created_by: user.id,
        });
        if (dbError) throw dbError;
      }

      setEditingResource(null);
      fetchData();
    } catch (err: any) {
      console.error('Failed to save resource:', err);
      setError(err.message ?? 'Failed to save resource.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      const { error: dbError } = await supabase.from('dawah_resources').delete().eq('id', id);
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
        <Loader2 className="animate-spin" size={24} /> Loading dawah resources...
      </div>
    );
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Da'wah Resources</h2>
        <p>Manage learning resources, articles, video/audio tracks, and links.</p>
        <button onClick={handleCreate} className="button button-primary" style={{ marginTop: '12px' }}>
          <Plus size={16} /> Add Resource
        </button>
      </div>

      {editingResource && (
        <div className="cms-modal">
          <form onSubmit={handleSave} className="cms-form modal-content modal-large">
            <div className="modal-header">
              <h3>{editingResource.id ? 'Edit Resource' : 'New Resource'}</h3>
              <button type="button" onClick={() => setEditingResource(null)} className="close-btn">
                <X size={18} />
              </button>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="form-grid-2">
              <div className="form-group">
                <label>Resource Title</label>
                <input
                  type="text"
                  required
                  value={editingResource.title ?? ''}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Resource Type</label>
                <select
                  value={editingResource.resource_type ?? 'article'}
                  onChange={(e) =>
                    setEditingResource({
                      ...editingResource,
                      resource_type: e.target.value as DawahResource['resource_type'],
                    })
                  }
                >
                  <option value="article">Article</option>
                  <option value="audio">Audio / Podcast</option>
                  <option value="video">Video</option>
                  <option value="document">Document (PDF)</option>
                  <option value="link">External Link</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Short Summary</label>
              <input
                type="text"
                required
                maxLength={320}
                value={editingResource.summary ?? ''}
                onChange={(e) => setEditingResource({ ...editingResource, summary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Detailed Content / Body (Optional)</label>
              <textarea
                rows={4}
                value={editingResource.body ?? ''}
                onChange={(e) => setEditingResource({ ...editingResource, body: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Speaker / Author / Scholar</label>
                <input
                  type="text"
                  value={editingResource.speaker_or_author ?? ''}
                  onChange={(e) => setEditingResource({ ...editingResource, speaker_or_author: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Topics / Keywords (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Tafsir, Fiqh, Zakat"
                  value={topicsText}
                  onChange={(e) => setTopicsText(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2" style={{ border: '1px dashed rgba(102, 153, 52, 0.2)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <div className="form-group">
                <label>Option A: External URL (HTTPS only)</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={editingResource.external_url ?? ''}
                  onChange={(e) => setEditingResource({ ...editingResource, external_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Option B: Linked Media Library File</label>
                <select
                  value={editingResource.media_asset_id ?? ''}
                  onChange={(e) => setEditingResource({ ...editingResource, media_asset_id: e.target.value || null })}
                >
                  <option value="">-- Choose from approved assets --</option>
                  {mediaAssets.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.file_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Publish Status</label>
                <select
                  value={editingResource.status ?? 'draft'}
                  onChange={(e) =>
                    setEditingResource({ ...editingResource, status: e.target.value as DawahResource['status'] })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {canApprove ? (
                <div className="form-group">
                  <label>Review Verification State</label>
                  <select
                    value={editingResource.review_status ?? 'pending'}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        review_status: e.target.value as DawahResource['review_status'],
                      })
                    }
                  >
                    <option value="pending">Pending Scholarly Verification</option>
                    <option value="approved">Approved & Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              ) : (
                <div className="form-group readonly-group">
                  <label>Review State</label>
                  <div className="static-field">
                    {editingResource.review_status === 'approved' ? 'Approved (Verified)' : 'Pending verification by Owner/Admin'}
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Resource
              </button>
              <button type="button" className="button button-secondary" onClick={() => setEditingResource(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {resources.length === 0 ? (
        <div className="empty-state">No resources found.</div>
      ) : (
        <div className="table-responsive">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Author</th>
                <th>Review Status</th>
                <th>Publish Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td><strong>{resource.title}</strong></td>
                  <td><span className="cat-pill">{resource.resource_type}</span></td>
                  <td>{resource.speaker_or_author ?? 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${resource.review_status}`}>
                      {resource.review_status === 'approved' && <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />}
                      {resource.review_status}
                    </span>
                  </td>
                  <td><span className={`status-badge status-${resource.status}`}>{resource.status}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button onClick={() => handleEdit(resource)} className="edit-btn">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(resource.id)} className="delete-btn">
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
