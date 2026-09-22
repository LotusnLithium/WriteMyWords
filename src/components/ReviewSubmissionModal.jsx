import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { cleanText } from '../lib/supabaseClient.js';
import {
  IconCheckCircle,
  IconStar,
  IconPaperclip,
  IconRotateCcw,
  IconAlertCircle,
  IconDownload,
  IconFileText,
  IconClock,
} from './Icons.jsx';

export default function ReviewSubmissionModal({ request, onClose, onSuccess }) {
  const { approveWork, requestRevision, toast } = useApp();
  const [actionTab, setActionTab] = useState('approve'); // 'approve' | 'revision'
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!request) return null;

  const files = request.submission_files || [];
  const submittedDate = request.submitted_at
    ? new Date(request.submitted_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  async function handleApprove(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await approveWork(request.id, {
        rating: Number(rating),
        feedback: cleanText(feedback, 1000),
      });
      toast('🎉 Project completed! Thank you for reviewing the deliverable.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Approve work error:', err);
      toast('Error approving deliverable');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRevision(e) {
    e.preventDefault();
    if (submitting) return;

    if (!cleanText(revisionNotes)) {
      toast('Please enter specific revision instructions for the expert.');
      return;
    }

    setSubmitting(true);
    try {
      await requestRevision(request.id, {
        revisionNotes: cleanText(revisionNotes, 2000),
      });
      toast('Revision requested! The expert has been notified.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Revision request error:', err);
      toast('Error sending revision request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay open" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 660 }}>
        <div className="modal-header">
          <div>
            <span className="badge" style={{ background: 'var(--indigo-subtle)', color: 'var(--indigo)' }}>
              DELIVERABLE READY FOR REVIEW
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 24px)', marginBottom: 6 }}>
          Review Work: {request.title}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--ink-muted)', marginBottom: 20 }}>
          <IconClock size={15} color="var(--ink-muted)" /> Submitted: {submittedDate}
          {request.expert_name && (
            <span>• Expert: <strong style={{ color: 'var(--ink)' }}>{request.expert_name}</strong></span>
          )}
        </div>

        {/* Expert Submission Notes */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 6, letterSpacing: '0.04em' }}>
            EXPERT'S SUBMISSION & METHODOLOGY NOTES
          </div>
          <div
            style={{
              background: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              padding: 16,
              borderRadius: 'var(--r-sm)',
              fontSize: 14.5,
              lineHeight: 1.6,
              color: 'var(--ink-secondary)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {request.submission_notes || 'The expert provided the attached solution document.'}
          </div>
        </div>

        {/* Attached Deliverable Files */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>
            DELIVERABLE FILES ({files.length})
          </div>
          {files.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {files.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    padding: '10px 14px',
                    borderRadius: 'var(--r-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconFileText size={18} color="var(--blue)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{file.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{file.size}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: 12.5, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
                    onClick={() => toast(`Downloading ${file.name}…`)}
                  >
                    <IconDownload size={14} color="var(--ink)" /> Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted" style={{ fontSize: 13.5, fontStyle: 'italic' }}>
              No downloadable files attached. Refer to submission notes above.
            </div>
          )}
        </div>

        {/* Actions Choice Tabs */}
        <div className="review-modal-tabs">
          <button
            type="button"
            className="review-modal-tab"
            style={{
              color: actionTab === 'approve' ? 'var(--success)' : 'var(--ink-muted)',
              borderBottom: actionTab === 'approve' ? '2.5px solid var(--success)' : '2.5px solid transparent',
            }}
            onClick={() => setActionTab('approve')}
          >
            ✓ Accept & Mark Complete
          </button>
          <button
            type="button"
            className="review-modal-tab"
            style={{
              color: actionTab === 'revision' ? 'var(--warning)' : 'var(--ink-muted)',
              borderBottom: actionTab === 'revision' ? '2.5px solid var(--warning)' : '2.5px solid transparent',
            }}
            onClick={() => setActionTab('revision')}
          >
            ↺ Request Revision
          </button>
        </div>

        {actionTab === 'approve' ? (
          <form onSubmit={handleApprove}>
            <div className="field">
              <label>Rate the Expert's Work</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                      color: star <= rating ? '#f59e0b' : 'var(--border)',
                      transition: 'transform 0.15s',
                    }}
                    aria-label={`${star} star`}
                  >
                    <IconStar size={26} color={star <= rating ? '#f59e0b' : 'var(--ink-muted)'} />
                  </button>
                ))}
                <span style={{ fontSize: 13.5, fontWeight: 600, marginLeft: 8, color: 'var(--ink)' }}>
                  {rating} of 5 Stars ({rating === 5 ? 'Exceptional' : rating === 4 ? 'Very Good' : rating === 3 ? 'Satisfactory' : 'Needs Work'})
                </span>
              </div>
            </div>

            <div className="field">
              <label htmlFor="student-feedback">Review Feedback & Thank You Note (optional)</label>
              <textarea
                id="student-feedback"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience with this expert..."
                style={{ width: '100%', resize: 'vertical', fontSize: 14 }}
              />
            </div>

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button
                type="submit"
                className="btn btn-primary modal-primary-btn"
                disabled={submitting}
                style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
              >
                {submitting ? 'Finalizing…' : (
                  <>
                    <IconCheckCircle size={16} color="#fff" /> Approve & Complete Request
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
        ) : (
          <form onSubmit={handleRevision}>
            <div className="field">
              <label htmlFor="revision-notes">
                Specific Revision Requirements <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <textarea
                id="revision-notes"
                rows={4}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Explain clearly what sections, calculations, citations, or formatting points need adjustment by the expert..."
                required
                style={{ width: '100%', resize: 'vertical', fontSize: 14 }}
              />
            </div>

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button
                type="submit"
                className="btn btn-primary modal-primary-btn"
                disabled={submitting}
                style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
              >
                {submitting ? 'Submitting…' : (
                  <>
                    <IconRotateCcw size={16} color="#fff" /> Send Revision Instructions
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
        )}
      </div>
    </div>
  );
}
