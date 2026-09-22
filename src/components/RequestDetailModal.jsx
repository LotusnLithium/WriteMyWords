import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { IconClock, IconCurrency, IconShare, IconZap } from './Icons.jsx';

export default function RequestDetailModal({ request, onClose }) {
  const { user, toast } = useApp();

  if (!request) return null;

  const subjects = request.subjects || (request.subject ? [request.subject] : []);
  const budgetMin = request.budget_min ?? request.budgetMin ?? 0;
  const budgetMax = request.budget_max ?? request.budgetMax ?? 0;

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/requests`);
      toast('Link copied to clipboard!');
    } else {
      toast('Request details ready to share');
    }
  }

  function handleAction() {
    if (!user) {
      toast('Please log in or create an account to respond.');
      return;
    }
    toast('Interest submitted! The student will review your profile.');
    onClose();
  }

  return (
    <div className="modal-overlay open" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="badge">{request.category || 'General Support'}</span>
            <span className="badge badge-neutral" style={{ marginLeft: 8 }}>
              {request.academic_level || 'Undergraduate'}
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

        <div style={{ marginBottom: 24 }}>
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

        <div className="modal-actions">
          {user?.role === 'expert' ? (
            <button className="btn btn-accent modal-primary-btn" onClick={handleAction}>
              <IconZap size={18} color="#fff" /> Express Interest / Make Offer
            </button>
          ) : !user ? (
            <Link to="/signup?role=expert" className="btn btn-accent modal-primary-btn" onClick={onClose}>
              Join as Expert to Respond
            </Link>
          ) : (
            <Link to="/dashboard/requests/new" className="btn btn-primary modal-primary-btn" onClick={onClose}>
              + Post a Similar Request
            </Link>
          )}
          <button className="btn btn-ghost modal-secondary-btn" onClick={handleShare} title="Share Request">
            <IconShare size={16} color="var(--ink)" /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
