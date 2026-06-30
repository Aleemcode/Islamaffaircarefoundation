import { useEffect, useState, useRef, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Upload, Trash2, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface MediaAsset {
  id: string;
  kind: 'faceless_illustration' | 'non_animate_image' | 'video' | 'document';
  approval_status: 'pending' | 'approved' | 'rejected';
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string | null;
  caption: string | null;
  attribution: string | null;
  uploaded_by: string;
}

export function MediaManager() {
  const { user, profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload Form details
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [kind, setKind] = useState<MediaAsset['kind']>('faceless_illustration');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [attribution, setAttribution] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<MediaAsset['approval_status']>('pending');

  const canApprove = profile?.role === 'owner' || profile?.role === 'admin';

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setAssets(data as MediaAsset[]);
      }
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to fetch media library.');
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange() {
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      setSelectedFile(fileInputRef.current.files[0]);
      setShowForm(true);
      setError(null);
    }
  }

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!selectedFile || !user) return;

    // Alt text validation for images/illustrations
    if ((kind === 'faceless_illustration' || kind === 'non_animate_image') && !altText.trim()) {
      setError('Alt text is required for illustrations and images.');
      return;
    }

    setUploading(true);
    setError(null);

    const storagePath = `${Date.now()}_${selectedFile.name.replace(/\s+/g, '_')}`;

    try {
      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('isf-media')
        .upload(storagePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // 2. Insert record in media_assets table
      const { error: insertError } = await supabase.from('media_assets').insert({
        kind,
        approval_status: canApprove ? approvalStatus : 'pending',
        storage_path: storagePath,
        file_name: selectedFile.name,
        mime_type: selectedFile.type,
        size_bytes: selectedFile.size,
        alt_text: altText ? altText.trim() : null,
        caption: caption ? caption.trim() : null,
        attribution: attribution ? attribution.trim() : null,
        uploaded_by: user.id,
      });

      if (insertError) {
        // Rollback storage upload on metadata insert failure
        await supabase.storage.from('isf-media').remove([storagePath]);
        throw insertError;
      }

      // Reset Form
      setSelectedFile(null);
      setAltText('');
      setCaption('');
      setAttribution('');
      setKind('faceless_illustration');
      setApprovalStatus('pending');
      setShowForm(false);
      fetchAssets();
    } catch (err: any) {
      console.error('Upload process failed:', err);
      setError(err.message ?? 'Failed to upload media asset.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(asset: MediaAsset) {
    if (!window.confirm(`Are you sure you want to delete ${asset.file_name}?`)) return;

    try {
      // 1. Remove from database
      const { error: dbError } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', asset.id);

      if (dbError) throw dbError;

      // 2. Remove from Storage
      await supabase.storage.from('isf-media').remove([asset.storage_path]);

      fetchAssets();
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(`Delete failed: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <div className="manager-loading">
        <Loader2 className="animate-spin" size={24} /> Loading media assets...
      </div>
    );
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Media Library</h2>
        <p>Upload and manage approved graphic assets. No realistic animations of animate beings allowed.</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="button button-primary"
          style={{ marginTop: '12px' }}
        >
          <Upload size={16} /> Choose File to Upload
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*,video/*,application/pdf"
        />
      </div>

      {showForm && selectedFile && (
        <div className="cms-modal">
          <form onSubmit={handleUpload} className="cms-form modal-content">
            <h3>Configure Media Asset</h3>
            <p className="file-info">
              File Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>

            {error && <div className="form-error">{error}</div>}

            <div className="media-rule-warning">
              <AlertTriangle size={18} />
              <div>
                <strong>Islamic Media Rule Enforced:</strong>
                <p>Conventional still photography of living/animate beings is prohibited. Select an appropriate asset type below.</p>
              </div>
            </div>

            <div className="form-group">
              <label>Asset Kind</label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as MediaAsset['kind'])}
              >
                <option value="faceless_illustration">Faceless Illustration</option>
                <option value="non_animate_image">Non-Animate Image (Calligraphy/Architecture)</option>
                <option value="video">Video Clip</option>
                <option value="document">Document (PDF)</option>
              </select>
            </div>

            {(kind === 'faceless_illustration' || kind === 'non_animate_image') && (
              <div className="form-group">
                <label>Alt Text (Required)</label>
                <input
                  type="text"
                  required
                  placeholder="Describe the content of this image clearly for screen readers"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Caption (Optional)</label>
              <input
                type="text"
                placeholder="Brief explanatory caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Attribution / Source (Optional)</label>
              <input
                type="text"
                placeholder="Credit name or source repository"
                value={attribution}
                onChange={(e) => setAttribution(e.target.value)}
              />
            </div>

            {canApprove && (
              <div className="form-group">
                <label>Approval Status</label>
                <select
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value as MediaAsset['approval_status'])}
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved (Publicly Readable)</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Uploading...
                  </>
                ) : (
                  'Upload Asset'
                )}
              </button>
              <button
                type="button"
                className="button button-secondary"
                disabled={uploading}
                onClick={() => {
                  setSelectedFile(null);
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {assets.length === 0 ? (
        <div className="empty-state">No media assets found in library.</div>
      ) : (
        <div className="media-grid">
          {assets.map((asset) => (
            <article className="media-card" key={asset.id}>
              <div className="media-preview-container">
                {asset.mime_type.startsWith('image/') ? (
                  <span className="media-preview-label">{asset.kind.replace('_', ' ')}</span>
                ) : (
                  <span className="media-preview-doc">{asset.mime_type.split('/')[1]?.toUpperCase()}</span>
                )}
                <div className="media-meta">
                  <span className={`status-badge status-${asset.approval_status}`}>
                    {asset.approval_status}
                  </span>
                </div>
              </div>
              <div className="media-details">
                <h4>{asset.file_name}</h4>
                {asset.alt_text && <p className="alt-txt"><em>Alt: {asset.alt_text}</em></p>}
                <button
                  onClick={() => handleDelete(asset)}
                  className="delete-btn"
                  title="Delete media asset"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
