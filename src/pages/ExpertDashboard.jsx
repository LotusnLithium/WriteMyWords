import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import RequestCard from '../components/RequestCard.jsx';
import RequestDetailModal from '../components/RequestDetailModal.jsx';
import {
  IconTrendingUp,
  IconSearch,
  IconFileText,
  IconSend,
  IconBriefcase,
  IconCurrency,
  IconClock,
} from '../components/Icons.jsx';

export default function ExpertDashboard() {
  const { user, authLoading, requests } = useApp();
  const [selectedRequest, setSelectedRequest] = useState(null);

  if (authLoading) {
    return (
      <div className="wrap" style={{ padding: '80px 0', textAlign: 'center' }}>
        <IconClock size={32} color="var(--ink-muted)" />
        <p className="muted" style={{ marginTop: 12 }}>Loading expert dashboard…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const firstName = user.name ? user.name.split(' ')[0] : 'Expert';
  const totalPotentialEarnings = requests.reduce(
    (sum, r) => sum + Number(r.budget_max ?? r.budgetMax ?? 0),
    0
  );

  return (
    <div className="app-shell">
      <aside className="app-side">
        <Link to="/expert-dashboard" className="active">
          <IconTrendingUp size={18} color="var(--blue)" /> Overview
        </Link>
        <Link to="/requests">
          <IconSearch size={18} color="var(--blue)" /> Find Requests
        </Link>
      </aside>

      <main className="app-main">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>EXPERT WORKSPACE</div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)' }}>Welcome back, {firstName}</h1>
            <p className="muted" style={{ fontSize: 14.5, marginTop: 4 }}>
              Browse student requests, make competitive proposals, and deliver academic excellence.
            </p>
          </div>
          <Link to="/requests" className="btn btn-accent">
            Find New Requests ({requests.length})
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="metric-row">
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num">{requests.length}</div>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconFileText size={20} color="var(--blue)" />
              </div>
            </div>
            <div className="lbl">Available Requests</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num">0</div>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--indigo-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconSend size={20} color="var(--indigo)" />
              </div>
            </div>
            <div className="lbl">Proposals Sent</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num">0</div>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--warning-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconBriefcase size={20} color="var(--warning)" />
              </div>
            </div>
            <div className="lbl">Active Engagements</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num" style={{ color: 'var(--success)' }}>
                ₹{totalPotentialEarnings.toLocaleString('en-IN')}
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCurrency size={20} color="var(--success)" />
              </div>
            </div>
            <div className="lbl">Board Volume Value</div>
          </div>
        </div>

        {/* Open Requests You Might Match */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 20 }}>Recommended Academic Requests</h2>
          <Link to="/requests" style={{ color: 'var(--blue)', fontSize: 14, fontWeight: 600 }}>
            View all ({requests.length}) →
          </Link>
        </div>

        {requests.length > 0 ? (
          <div className="grid grid-3">
            {requests.slice(0, 6).map((r) => (
              <RequestCard
                r={r}
                key={r.id}
                onClick={(req) => setSelectedRequest(req)}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <IconFileText size={28} color="var(--ink-muted)" />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>No open requests right now</h3>
            <p className="muted" style={{ maxWidth: 460, margin: '0 auto', fontSize: 14.5 }}>
              Check back shortly as new student briefs are posted daily.
            </p>
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
