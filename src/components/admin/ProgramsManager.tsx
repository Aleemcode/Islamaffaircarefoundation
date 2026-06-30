import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Edit3, Trash2, Loader2, Save, X } from 'lucide-react';

interface Program {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  category: 'zakat_sadaqa' | 'dawah' | 'humanitarian_aid' | 'other';
  objectives: string[];
  service_regions: string[];
  eligibility_notes: string | null;
  contact_label: string | null;
  contact_value: string | null;
  featured: boolean;
  sort_order: number;
}

export function ProgramsManager() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState<Partial<Program> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form arrays as comma-separated values in UI
  const [objectivesText, setObjectivesText] = useState('');
  const [regionsText, setRegionsText] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setPrograms(data as Program[]);
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Failed to fetch programs.');
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setEditingProgram({
      title: '',
      slug: '',
      summary: '',
      body: '',
      status: 'draft',
      category: 'other',
      objectives: [],
      service_regions: [],
      eligibility_notes: '',
      contact_label: '',
      contact_value: '',
      featured: false,
      sort_order: 0,
    });
    setObjectivesText('');
    setRegionsText('');
  }

  function handleEdit(program: Program) {
    setEditingProgram(program);
    setObjectivesText(program.objectives.join('\n'));
    setRegionsText(program.service_regions.join(', '));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editingProgram || !user) return;

    setSaving(true);
    setError(null);

    // Deriving arrays from strings
    const objectives = objectivesText
      .split('\n')
      .map((o) => o.trim())
      .filter((o) => o.length > 0);
    const service_regions = regionsText
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const slug = editingProgram.title
      ? editingProgram.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : '';

    const payload = {
      ...editingProgram,
      slug,
      objectives,
      service_regions,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingProgram.id) {
        // Update
        const { error: dbError } = await supabase
          .from('programs')
          .update(payload)
          .eq('id', editingProgram.id);
        if (dbError) throw dbError;
      } else {
        // Create
        const { error: dbError } = await supabase.from('programs').insert({
          ...payload,
          created_by: user.id,
        });
        if (dbError) throw dbError;
      }

      setEditingProgram(null);
      fetchPrograms();
    } catch (err: any) {
      console.error('Failed to save program:', err);
      setError(err.message ?? 'Failed to save program.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to permanently delete this program?')) return;

    try {
      const { error: dbError } = await supabase.from('programs').delete().eq('id', id);
      if (dbError) throw dbError;
      fetchPrograms();
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(`Delete failed: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <div className="manager-loading">
        <Loader2 className="animate-spin" size={24} /> Loading programs...
      </div>
    );
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Programs & Services</h2>
        <p>Manage key da'wah, zakat, and welfare programs offered by the foundation.</p>
        <button onClick={handleCreate} className="button button-primary" style={{ marginTop: '12px' }}>
          <Plus size={16} /> Add Program
        </button>
      </div>

      {editingProgram && (
        <div className="cms-modal">
          <form onSubmit={handleSave} className="cms-form modal-content modal-large">
            <div className="modal-header">
              <h3>{editingProgram.id ? 'Edit Program' : 'New Program'}</h3>
              <button type="button" onClick={() => setEditingProgram(null)} className="close-btn">
                <X size={18} />
              </button>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="form-grid-2">
              <div className="form-group">
                <label>Program Title</label>
                <input
                  type="text"
                  required
                  value={editingProgram.title ?? ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={editingProgram.category ?? 'other'}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, category: e.target.value as Program['category'] })
                  }
                >
                  <option value="zakat_sadaqa">Zakat & Sadaqa</option>
                  <option value="dawah">Islamic Da’wah</option>
                  <option value="humanitarian_aid">Humanitarian Aid</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Brief Summary</label>
              <input
                type="text"
                required
                maxLength={320}
                value={editingProgram.summary ?? ''}
                onChange={(e) => setEditingProgram({ ...editingProgram, summary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Detailed Body (Markdown Supported)</label>
              <textarea
                rows={6}
                required
                value={editingProgram.body ?? ''}
                onChange={(e) => setEditingProgram({ ...editingProgram, body: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Objectives (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Provide meals to local orphans"
                  value={objectivesText}
                  onChange={(e) => setObjectivesText(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Service Regions (Comma separated)</label>
                <textarea
                  rows={3}
                  placeholder="Lagos, Kano, Abuja"
                  value={regionsText}
                  onChange={(e) => setRegionsText(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Eligibility Notes (Optional)</label>
                <input
                  type="text"
                  value={editingProgram.eligibility_notes ?? ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, eligibility_notes: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Sort Order</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editingProgram.sort_order ?? 0}
                  onChange={(e) => setEditingProgram({ ...editingProgram, sort_order: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Contact Label (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Inquiries"
                  value={editingProgram.contact_label ?? ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, contact_label: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Contact Value (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. program@islamaffairs.org"
                  value={editingProgram.contact_value ?? ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, contact_value: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Publication Status</label>
                <select
                  value={editingProgram.status ?? 'draft'}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, status: e.target.value as Program['status'] })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={editingProgram.featured ?? false}
                  onChange={(e) => setEditingProgram({ ...editingProgram, featured: e.target.checked })}
                />
                Feature this program on the homepage
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Program
              </button>
              <button type="button" className="button button-secondary" onClick={() => setEditingProgram(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {programs.length === 0 ? (
        <div className="empty-state">No programs found.</div>
      ) : (
        <div className="table-responsive">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Regions</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id}>
                  <td>
                    <strong>{program.title}</strong>
                    {program.featured && <span className="featured-pill">Featured</span>}
                  </td>
                  <td><span className="cat-pill">{program.category.replace('_', ' ')}</span></td>
                  <td>{program.service_regions.join(', ')}</td>
                  <td>{program.sort_order}</td>
                  <td><span className={`status-badge status-${program.status}`}>{program.status}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button onClick={() => handleEdit(program)} className="edit-btn">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(program.id)} className="delete-btn">
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
