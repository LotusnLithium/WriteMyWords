import React from 'react';
import { IconClock } from './Icons.jsx';

export default function RequestCard({ r, onClick }) {
  const subjects = r.subjects || (r.subject ? [r.subject] : []);
  const budgetMin = Number(r.budget_min ?? r.budgetMin ?? 0);
  const budgetMax = Number(r.budget_max ?? r.budgetMax ?? 0);

  return (
    <div 
      className="card card-interactive" 
      onClick={() => onClick && onClick(r)}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span className="badge">{r.category || 'Academic'}</span>
          {r.academic_level && (
            <span className="badge badge-neutral" style={{ fontSize: 11 }}>
              {r.academic_level}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: 17, lineHeight: 1.35, marginBottom: 8, color: 'var(--ink)' }}>
          {r.title}
        </h3>

        {r.description && (
          <p className="muted" style={{ fontSize: 13.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {r.description}
          </p>
        )}

        {subjects.length > 0 && (
          <div className="tag-row" style={{ marginBottom: 14 }}>
            {subjects.slice(0, 3).map((s) => (
              <span className="tag" key={s}>{s}</span>
            ))}
            {subjects.length > 3 && (
              <span className="tag">+{subjects.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
        <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
          ₹{budgetMin.toLocaleString('en-IN')}–₹{budgetMax.toLocaleString('en-IN')}
        </div>
        <div style={{ color: 'var(--warning)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
          <IconClock size={14} color="var(--warning)" /> {r.deadline || '3 days'}
        </div>
      </div>
    </div>
  );
}
