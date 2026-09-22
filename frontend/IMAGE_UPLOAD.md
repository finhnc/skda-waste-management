# Image Upload & Display — Frontend Pattern

## Overview

When adding image/file upload to the SKDA frontend (e.g., evidence photos for waste submissions), follow this pattern for consistency with the React + Lucide UI.

---

## Upload Component Pattern

### Basic File Input + Preview

```jsx
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import api from './api';

function ImageUploadField({ formId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function handleFileSelect(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;

    // Validate: image only, max 5MB
    if (!selected.type.startsWith('image/')) {
      setError('Hanya file gambar yang diterima (JPEG, PNG).');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError('File terlalu besar. Maksimal 5MB.');
      return;
    }

    setFile(selected);
    setError('');

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selected);
  }

  async function handleUpload() {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('evidence', file);

      const response = await api.post(
        `/submission-forms/${formId}/upload-evidence`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setFile(null);
      setPreview(null);
      onUploadSuccess(response.data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload gagal.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="upload-field">
      <label className="upload-label">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <span className="upload-trigger">
          <Upload size={16} /> Pilih Gambar
        </span>
      </label>

      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
          <button
            type="button"
            onClick={() => { setFile(null); setPreview(null); }}
            className="button button-text"
          >
            <X size={14} /> Hapus
          </button>
        </div>
      )}

      {error && <div className="error-text">{error}</div>}

      {file && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="button button-primary"
        >
          {uploading ? 'Mengunggah...' : 'Unggah Gambar'}
        </button>
      )}
    </div>
  );
}

export default ImageUploadField;
```

### Styles (CSS)

```css
.upload-field {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-label {
  cursor: pointer;
}

.upload-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px dashed #ccc;
  border-radius: 0.375rem;
  background: #fafafa;
  transition: all 0.2s;
}

.upload-trigger:hover {
  border-color: #999;
  background: #f0f0f0;
}

.preview-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 0.375rem;
  object-fit: contain;
}
```

---

## Display Image in Form

```jsx
function SubmissionDetail({ form }) {
  return (
    <section className="form-detail">
      {/* ... existing form fields ... */}

      {form.evidence_photo_url && (
        <div className="evidence-section">
          <h4>Bukti Gambar</h4>
          <img src={form.evidence_photo_url} alt="Evidence" className="evidence-image" />
        </div>
      )}
    </section>
  );
}
```

---

## Integration Checklist

- [ ] Backend: Add migration with `evidence_photo_path` column
- [ ] Backend: Add `fillable` to model + `$evidence_photo_url` attribute (return full URL)
- [ ] Backend: Create upload endpoint `/api/submission-forms/{id}/upload-evidence` (POST)
- [ ] Backend: Validate file (image, max 5MB, allowed MIME types)
- [ ] Backend: Store file to `Storage::disk('public')` with unique name
- [ ] Backend: Return URL in response
- [ ] Backend: Add cleanup (delete file on form delete)
- [ ] Frontend: Import `ImageUploadField` in form edit view
- [ ] Frontend: Call `<ImageUploadField formId={formId} onUploadSuccess={handleUploadSuccess} />`
- [ ] Frontend: Render image preview in detail view
- [ ] CSS: Add `.upload-field`, `.preview-image`, `.evidence-section` styles

---

## Testing

**Manual**:
1. Select a JPEG/PNG file (< 5MB)
2. Click "Unggah Gambar"
3. Verify: image appears in preview; file sent to backend
4. Verify: new image URL returned and stored in form
5. Verify: image displays in detail view on page reload

**Edge cases**:
- Non-image file → error message
- File > 5MB → error message
- Network failure → error message + retry option
