import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Edit3, Trash2, Loader2, Save, X } from 'lucide-react';

interface Program {
  id: string;
  title: string;
}

interface EventActivity {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  program_id: string | null;
  mode: 'physical' | 'online' | 'hybrid';
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  venue_name: string | null;
  address: string | null;
  registration_url: string | null;
  registration_required: boolean;
}

export function EventsManager() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventActivity[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Partial<EventActivity> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [eventsRes, programsRes] = await Promise.all([
        supabase.from('activities').select('*').order('starts_at', { ascending: false }),
        supabase.from('programs').select('id, title').eq('status', 'published'),
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (programsRes.error) throw programsRes.error;

      setEvents(eventsRes.data as EventActivity[]);
      setPrograms(programsRes.data as Program[]);
    } catch (err: any) {
      console.error('Error fetching event data:', err);
      setError('Failed to fetch events data.');
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setEditingEvent({
      title: '',
      slug: '',
      summary: '',
      body: '',
      status: 'draft',
      program_id: null,
      mode: 'physical',
      starts_at: '',
      ends_at: '',
      timezone: 'Africa/Lagos',
      venue_name: '',
      address: '',
      registration_url: '',
      registration_required: false,
    });
  }

  function handleEdit(event: EventActivity) {
    setEditingEvent(event);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editingEvent || !user) return;

    setSaving(true);
    setError(null);

    // Schema validations
    if ((editingEvent.mode === 'physical' || editingEvent.mode === 'hybrid') && !editingEvent.venue_name?.trim()) {
      setError('Venue Name is required for physical and hybrid events.');
      setSaving(false);
      return;
    }

    if ((editingEvent.mode === 'online' || editingEvent.mode === 'hybrid') && editingEvent.registration_url) {
      if (!editingEvent.registration_url.startsWith('https://')) {
        setError('Online registration links must use secure HTTPS protocols.');
        setSaving(false);
        return;
      }
    }

    const slug = editingEvent.title
      ? editingEvent.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : '';

    const payload = {
      ...editingEvent,
      slug,
      starts_at: editingEvent.starts_at || new Date().toISOString(),
      ends_at: editingEvent.ends_at || null,
      program_id: editingEvent.program_id || null,
      venue_name: editingEvent.venue_name || null,
      address: editingEvent.address || null,
      registration_url: editingEvent.registration_url || null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingEvent.id) {
        const { error: dbError } = await supabase
          .from('activities')
          .update(payload)
          .eq('id', editingEvent.id);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('activities').insert({
          ...payload,
          created_by: user.id,
        });
        if (dbError) throw dbError;
      }

      setEditingEvent(null);
      fetchData();
    } catch (err: any) {
      console.error('Failed to save event:', err);
      setError(err.message ?? 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error: dbError } = await supabase.from('activities').delete().eq('id', id);
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
        <Loader2 className="animate-spin" size={24} /> Loading events...
      </div>
    );
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Activities & Events</h2>
        <p>Schedule lectures, seminars, outreach activity, and community support events.</p>
        <button onClick={handleCreate} className="button button-primary" style={{ marginTop: '12px' }}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      {editingEvent && (
        <div className="cms-modal">
          <form onSubmit={handleSave} className="cms-form modal-content modal-large">
            <div className="modal-header">
              <h3>{editingEvent.id ? 'Edit Event' : 'New Event'}</h3>
              <button type="button" onClick={() => setEditingEvent(null)} className="close-btn">
                <X size={18} />
              </button>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="form-grid-2">
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title ?? ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Related Program</label>
                <select
                  value={editingEvent.program_id ?? ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, program_id: e.target.value })}
                >
                  <option value="">None</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Short Summary</label>
              <input
                type="text"
                required
                maxLength={320}
                value={editingEvent.summary ?? ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, summary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Event Description (Markdown)</label>
              <textarea
                rows={4}
                required
                value={editingEvent.body ?? ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, body: e.target.value })}
              />
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Event Mode</label>
                <select
                  value={editingEvent.mode ?? 'physical'}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, mode: e.target.value as EventActivity['mode'] })
                  }
                >
                  <option value="physical">Physical Venue</option>
                  <option value="online">Online / Webinar</option>
                  <option value="hybrid">Hybrid (Both)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Timezone</label>
                <input
                  type="text"
                  required
                  value={editingEvent.timezone ?? 'Africa/Lagos'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, timezone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Publish Status</label>
                <select
                  value={editingEvent.status ?? 'draft'}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, status: e.target.value as EventActivity['status'] })
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
                <label>Start Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={editingEvent.starts_at ? editingEvent.starts_at.slice(0, 16) : ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, starts_at: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>End Date & Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={editingEvent.ends_at ? editingEvent.ends_at.slice(0, 16) : ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, ends_at: e.target.value })}
                />
              </div>
            </div>

            {(editingEvent.mode === 'physical' || editingEvent.mode === 'hybrid') && (
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Venue Name (Required for Physical/Hybrid)</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.venue_name ?? ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue_name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={editingEvent.address ?? ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, address: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group">
                <label>Registration URL (HTTPS only)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingEvent.registration_url ?? ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, registration_url: e.target.value })}
                />
              </div>

              <div className="form-group-checkbox" style={{ marginTop: '28px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={editingEvent.registration_required ?? false}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, registration_required: e.target.checked })
                    }
                  />
                  Prior registration is required
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Event
              </button>
              <button type="button" className="button button-secondary" onClick={() => setEditingEvent(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {events.length === 0 ? (
        <div className="empty-state">No scheduled events found.</div>
      ) : (
        <div className="table-responsive">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Mode</th>
                <th>Starts At</th>
                <th>Venue / Location</th>
                <th>Publish Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td><strong>{event.title}</strong></td>
                  <td><span className="cat-pill">{event.mode}</span></td>
                  <td>{new Date(event.starts_at).toLocaleString()}</td>
                  <td>{event.mode === 'online' ? 'Online' : event.venue_name}</td>
                  <td><span className={`status-badge status-${event.status}`}>{event.status}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button onClick={() => handleEdit(event)} className="edit-btn">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="delete-btn">
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
