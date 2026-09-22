import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import SubmitWorkModal from './SubmitWorkModal.jsx';
import ReviewSubmissionModal from './ReviewSubmissionModal.jsx';
import {
  IconClock,
  IconCurrency,
  IconShare,
  IconZap,
  IconCheckCircle,
  IconStar,
  IconSend,
  IconFileText,
  IconAlertCircle,
  IconRotateCcw,
} from './Icons.jsx';

export default function RequestDetailModal({ request, onClose }) {
  const { user, claimRequest, toast } = useApp();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [claiming, setClaiming] = useState(false);

  if (!request) return null;

  const subjects = request.subjects || (request.subject ? [request.subject] : []);
  const budgetMin = request.budget_min ?? request.budgetMin ?? 0;
  const budgetMax = request.budget_max ?? request.budgetMax ?? 0;
  const isExpert = user?.role === 'expert';
  const isAssignedToMe = isExpert && (request.expert_id === user?.id || !request.expert_id);
  const isMyRequest = user && user.role === 'student';

  const statusConfig = {
    open: { label: 'Open for Proposals', color: 'var(--blue)', bg: 'var(--blue-subtle)' },
    in_progress: { label: 'In Progress / Assigned', color: 'var(--warning)', bg: 'var(--warning-subtle)' },
    submitted: { label: 'Deliverable Ready for Review', color: 'var(--indigo)', bg: 'var(--indigo-subtle)' },
    completed: { label: 'Completed & Accepted', color: 'var(--success)', bg: 'var(--success-subtle)' },
    revision_requested: { label: 'Revision Requested', color: 'var(--error)', bg: 'var(--error-subtle)' },
  };

  const statusInfo = statusConfig[request.status] || statusConfig.open;

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/requests`);
      toast('Link copied to clipboard!');
    } else {
      toast('Request details ready to share');
    }
  }

  async function handleClaim() {
    if (!user) {
      toast('Please log in as an expert to claim this assignment.');
      return;
    }
    setClaiming(true);
    try {
      await claimRequest(request.id);
      toast('Assignment claimed! You can now work on this task and submit deliverables.');
      onClose();
    } catch (err) {
      console.error('Claim error:', err);
      toast(err.message || 'Error claiming assignment');
    } finally {
      setClaiming(false);
    }
  }

  return (
    <>
      <div className="modal-overlay open" onClick={onClose} role="dialog" aria-modal="true">
        <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 660 }}>
          <div className="modal-header">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge">{request.category || 'General Support'}</span>
              {request.academic_level && (
                <span className="badge badge-neutral">
                  {request.academic_level}
                </span>
              )}
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 'var(--r-full)',
                  color: statusInfo.color,
                  background: statusInfo.bg,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {statusInfo.label}
              </span>
            </div>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>

          <h2 style={{ fontSize: 'clamp(20px, 3vw, 24px)', marginBottom: 12 }}>
            {request.title}
          </h2>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, fontSize: 14 }}>
            <div style={{ background: 'var(--surface-alt)', padding: '6px 12px', borderRadius: 'var(--r-xs)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconCurrency size={16} color="var(--ink)" /> Budget: ₹{Number(budgetMin).toLocaleString('en-IN')} – ₹{Number(budgetMax).toLocaleString('en-IN')}
            </div>
            <div style={{ background: 'var(--warning-subtle)', color: 'var(--warning)', padding: '6px 12px', borderRadius: 'var(--r-xs)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconClock size={16} color="var(--warning)" /> Deadline: {request.deadline || 'Flexible'}
            </div>
          </div>

          {subjects.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 6 }}>
                TAGS & SUBJECTS
              </div>
              <div className="tag-row">
                {subjects.map((s) => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 6 }}>
              PROJECT DETAILS & REQUIREMENTS
            </div>
            <div
              style={{
                background: 'var(--surface-alt)',
                padding: 16,
                borderRadius: 'var(--r-sm)',
                fontSize: 14.5,
                lineHeight: 1.6,
                color: 'var(--ink-secondary)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {request.description || 'No additional description provided. Contact student for full assignment brief and grading rubrics.'}
            </div>
          </div>

          {/* If there's an active submission or completed state */}
          {request.status === 'submitted' && (
            <div
              style={{
                background: 'var(--indigo-subtle)',
                border: '1px solid var(--indigo)',
                borderRadius: 'var(--r-sm)',
                padding: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--indigo)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconFileText size={18} color="var(--indigo)" /> Deliverable Submitted by Expert
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--ink)', marginBottom: 10 }}>
                {request.submission_notes ? request.submission_notes.slice(0, 150) + '…' : 'Solution files attached.'}
              </p>
              {isMyRequest && (
                <button
                  className="btn btn-primary"
                  style={{ fontSize: 13, padding: '8px 14px' }}
                  onClick={() => setShowReviewModal(true)}
                >
                  🎉 Review & Approve Deliverable
                </button>
              )}
            </div>
          )}

          {request.status === 'revision_requested' && request.revision_notes && (
            <div
              style={{
                background: 'var(--error-subtle)',
                border: '1px solid var(--error)',
                borderRadius: 'var(--r-sm)',
                padding: 14,
                marginBottom: 20,
                fontSize: 13.5,
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <IconAlertCircle size={16} color="var(--error)" /> Revision Requested:
              </div>
              <div style={{ color: 'var(--ink)' }}>{request.revision_notes}</div>
            </div>
          )}

          {request.status === 'completed' && (
            <div
              style={{
                background: 'var(--success-subtle)',
                border: '1px solid var(--success)',
                borderRadius: 'var(--r-sm)',
                padding: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>
                <IconCheckCircle size={18} color="var(--success)" /> Project Accepted & Completed
              </div>
              {request.student_rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '6px 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconStar
                      key={star}
                      size={18}
                      color={star <= request.student_rating ? '#f59e0b' : 'var(--border)'}
                    />
                  ))}
                  <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 6 }}>
                    Student Rating: {request.student_rating}/5
                  </span>
                </div>
              )}
              {request.student_feedback && (
                <p style={{ fontSize: 13.5, color: 'var(--ink-secondary)', fontStyle: 'italic', marginTop: 4 }}>
                  "{request.student_feedback}"
                </p>
              )}
            </div>
          )}

          {/* Modal Actions */}
          <div className="modal-actions">
            {/* Expert Actions */}
            {isExpert && request.status === 'open' && (
              <button
                className="btn btn-accent modal-primary-btn"
                onClick={handleClaim}
                disabled={claiming}
              >
                <IconZap size={18} color="#fff" /> {claiming ? 'Claiming…' : '⚡ Claim & Start Working'}
              </button>
            )}

            {isExpert && (request.status === 'in_progress' || request.status === 'revision_requested') && (
              <button
                className="btn btn-primary modal-primary-btn"
                style={{ background: 'var(--indigo)', borderColor: 'var(--indigo)' }}
                onClick={() => setShowSubmitModal(true)}
              >
                <IconSend size={18} color="#fff" /> Submit Completed Deliverable
              </button>
            )}

            {/* Student Actions */}
            {isMyRequest && request.status === 'submitted' && (
              <button
                className="btn btn-primary modal-primary-btn"
                style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                onClick={() => setShowReviewModal(true)}
              >
                <IconCheckCircle size={18} color="#fff" /> Review & Approve Work
              </button>
            )}

            {/* Non-logged in */}
            {!user && (
              <Link to="/signup?role=expert" className="btn btn-accent modal-primary-btn" onClick={onClose}>
                Join as Expert to Claim
              </Link>
            )}

            <button className="btn btn-ghost modal-secondary-btn" onClick={handleShare} title="Share Request">
              <IconShare size={16} color="var(--ink)" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      {showSubmitModal && (
        <SubmitWorkModal
          request={request}
          onClose={() => setShowSubmitModal(false)}
          onSuccess={() => {
            setShowSubmitModal(false);
            onClose();
          }}
        />
      )}

      {showReviewModal && (
        <ReviewSubmissionModal
          request={request}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            setShowReviewModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
