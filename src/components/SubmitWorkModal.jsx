import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { cleanText, validateFileAttachment } from '../lib/supabaseClient.js';
import {
  IconUploadCloud,
  IconPaperclip,
  IconSend,
  IconClock,
  IconAlertCircle,
  IconCheckCircle,
} from './Icons.jsx';

export default function SubmitWorkModal({ request, onClose, onSuccess }) {
  const { user, submitWork, toast } = useApp();
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!request) return null;

  function handleFileAdd(e) {
    const selected = Array.from(e.target.files || []);
    if (selected.length) {
      const validFiles = [];
      for (const f of selected) {
        const check = validateFileAttachment(f);
        if (!check.valid) {
          toast(`Cannot attach ${f.name}: ${check.error}`);
          continue;
        }
        validFiles.push({
          name: f.name.replace(/[^a-zA-Z0-9._\-]/g, '_'),
          size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
        });
      }
      if (validFiles.length) {
        setFiles((prev) => [...prev, ...validFiles]);
        toast(`${validFiles.length} deliverable file(s) attached`);
      }
    }
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    if (!cleanText(notes) && files.length === 0) {
      setErrorMessage('Please provide solution notes or attach at least one deliverable file.');
      toast('Please provide completion notes or deliverable files.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      await submitWork(request.id, {
        notes: cleanText(notes, 3000),
        files: files,
      });
      toast('Deliverable submitted successfully! The student will review your work.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Submit work error:', err);
      setErrorMessage(err.message || 'Failed to submit deliverable.');
      toast('Error submitting deliverable');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay open" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div>
            <span className="badge" style={{ background: 'var(--indigo-subtle)', color: 'var(--indigo)' }}>
              DELIVERABLE SUBMISSION
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <h2 style={{ fontSize: 'clamp(19px, 2.5vw, 22px)', marginBottom: 6 }}>
          Submit Work for: {request.title}
        </h2>
        <p className="muted" style={{ fontSize: 14, marginBottom: 20 }}>
          Provide comprehensive completion notes, methodology summary, and attach final deliverable files for student review.
        </p>

        {request.status === 'revision_requested' && request.revision_notes && (
          <div
            style={{
              background: 'var(--warning-subtle)',
              border: '1px solid var(--warning)',
              borderRadius: 'var(--r-sm)',
              padding: 14,
              marginBottom: 18,
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <IconAlertCircle size={16} color="var(--warning)" /> Student Revision Request:
            </div>
            <div style={{ color: 'var(--ink)' }}>{request.revision_notes}</div>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              background: 'var(--error-subtle)',
              color: 'var(--error)',
              padding: '10px 14px',
              borderRadius: 'var(--r-xs)',
              fontSize: 13.5,
              marginBottom: 16,
              fontWeight: 500,
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="submission-notes">
              Completion Notes & Methodology Explanation <span style={{ color: 'var(--ink-muted)' }}>(required)</span>
            </label>
            <textarea
              id="submission-notes"
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detail how you fulfilled the brief, key references used, structure of the deliverable, and recommendations for the student..."
              required
              style={{ width: '100%', resize: 'vertical', fontSize: 14 }}
            />
          </div>

          <div className="field">
            <label>Attach Solution Files / Documents</label>
            <div
              style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--r-sm)',
                padding: '24px 16px',
                textAlign: 'center',
                background: 'var(--surface-alt)',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onClick={() => document.getElementById('deliverable-file-input').click()}
            >
              <IconUploadCloud size={32} color="var(--blue)" />
              <p style={{ fontWeight: 600, marginTop: 8, fontSize: 14.5 }}>
                Click to attach solution documents
              </p>
              <p className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                PDF, DOCX, PPTX, XLSX, TXT, ZIP up to 25 MB each
              </p>
              <input
                id="deliverable-file-input"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={handleFileAdd}
              />
            </div>

            {files.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {files.map((f, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--surface-alt)',
                      padding: '8px 12px',
                      borderRadius: 'var(--r-xs)',
                      fontSize: 13,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IconPaperclip size={15} color="var(--blue)" />
                      <span style={{ fontWeight: 500 }}>{f.name}</span>
                      <span className="muted">({f.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions" style={{ marginTop: 24 }}>
            <button
              type="submit"
              className="btn btn-accent modal-primary-btn"
              disabled={submitting}
            >
              {submitting ? 'Submitting Work…' : (
                <>
                  <IconSend size={16} color="#fff" /> Submit Deliverable to Student
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-ghost modal-secondary-btn"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
