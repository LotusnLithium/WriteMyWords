import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import RequestCard from '../components/RequestCard.jsx';
import RequestDetailModal from '../components/RequestDetailModal.jsx';
import {
  IconTrendingUp,
  IconZap,
  IconSearch,
  IconFileText,
  IconMessageSquare,
  IconCheckCircle,
  IconClock,
} from '../components/Icons.jsx';

export default function StudentDashboard() {
  const { user, authLoading, myRequests } = useApp();
  const [tab, setTab] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  if (authLoading) {
    return (
      <div className="wrap" style={{ padding: '80px 0', textAlign: 'center' }}>
        <IconClock size={32} color="var(--ink-muted)" />
        <p className="muted" style={{ marginTop: 12 }}>Loading student dashboard…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const firstName = user.name ? user.name.split(' ')[0] : 'Student';

  return (
    <div className="app-shell">
      <aside className="app-side">
        <Link to="/dashboard" className="active">
          <IconTrendingUp size={18} color="var(--blue)" /> Overview
        </Link>
        <Link to="/dashboard/requests/new">
          <IconZap size={18} color="var(--blue)" /> Post a Request
        </Link>
        <Link to="/requests">
          <IconSearch size={18} color="var(--blue)" /> Browse Board
        </Link>
      </aside>

      <main className="app-main">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>STUDENT WORKSPACE</div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)' }}>Welcome back, {firstName}</h1>
            <p className="muted" style={{ fontSize: 14.5, marginTop: 4 }}>
              Track your open academic requests, review offers, and collaborate with experts.
            </p>
          </div>
          <Link to="/dashboard/requests/new" className="btn btn-primary">
            + Post a New Request
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="metric-row">
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num">{myRequests.length}</div>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconFileText size={20} color="var(--blue)" />
              </div>
            </div>
            <div className="lbl">Active Requests</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num">0</div>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--indigo-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconMessageSquare size={20} color="var(--indigo)" />
              </div>
            </div>
            <div className="lbl">Offers Received</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num">0</div>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--warning-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconZap size={20} color="var(--warning)" />
              </div>
            </div>
            <div className="lbl">In Progress</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num">0</div>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCheckCircle size={20} color="var(--success)" />
              </div>
            </div>
            <div className="lbl">Completed Reviews</div>
          </div>
        </div>

        {/* Requests Management Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 20 }}>Your Posted Requests</h2>
          <div className="chip-row" style={{ margin: 0, padding: 0 }}>
            <button
              className={`chip ${tab === 'all' ? 'selected' : ''}`}
              onClick={() => setTab('all')}
            >
              All ({myRequests.length})
            </button>
            <button
              className={`chip ${tab === 'open' ? 'selected' : ''}`}
              onClick={() => setTab('open')}
            >
              Open ({myRequests.length})
            </button>
          </div>
        </div>

        {myRequests.length > 0 ? (
          <div className="grid grid-3">
            {myRequests.map((r) => (
              <RequestCard
                r={r}
                key={r.id}
                onClick={(req) => setSelectedRequest(req)}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <IconFileText size={28} color="var(--blue)" />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>You haven't posted any requests yet</h3>
            <p className="muted" style={{ maxWidth: 460, margin: '0 auto 24px', fontSize: 14.5 }}>
              Need help structuring research, proofreading an essay, formatting citations, or preparing for an exam?
            </p>
            <Link to="/dashboard/requests/new" className="btn btn-primary">
              Post Your First Request Free →
            </Link>
          </div>
        )}

        {/* Request Detail Modal */}
        {selectedRequest && (
          <RequestDetailModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </main>
    </div>
  );
}
