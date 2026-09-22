import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import RequestCard from '../components/RequestCard.jsx';
import RequestDetailModal from '../components/RequestDetailModal.jsx';
import ReviewSubmissionModal from '../components/ReviewSubmissionModal.jsx';
import {
  IconTrendingUp,
  IconZap,
  IconSearch,
  IconFileText,
  IconMessageSquare,
  IconCheckCircle,
  IconClock,
  IconStar,
  IconAlertCircle,
  IconSend,
} from '../components/Icons.jsx';

export default function StudentDashboard() {
  const { user, authLoading, myRequests } = useApp();
  const [tab, setTab] = useState('all'); // 'all' | 'review' | 'progress' | 'open' | 'completed'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewingRequest, setReviewingRequest] = useState(null);

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

  // Computed buckets
  const openRequests = myRequests.filter((r) => r.status === 'open' || !r.status);
  const inProgressRequests = myRequests.filter(
    (r) => r.status === 'in_progress' || r.status === 'revision_requested'
  );
  const readyForReviewRequests = myRequests.filter((r) => r.status === 'submitted');
  const completedRequests = myRequests.filter((r) => r.status === 'completed');

  // Filtered list based on active tab
  const displayedRequests =
    tab === 'review'
      ? readyForReviewRequests
      : tab === 'progress'
      ? inProgressRequests
      : tab === 'open'
      ? openRequests
      : tab === 'completed'
      ? completedRequests
      : myRequests;

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
        <div className="dash-header-wrap">
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>STUDENT WORKSPACE</div>
            <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)' }}>Welcome back, {firstName}</h1>
            <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
              Track your open academic requests, review expert submissions, and approve completed projects.
            </p>
          </div>
          <Link to="/dashboard/requests/new" className="btn btn-primary">
            + Post a New Request
          </Link>
        </div>

        {/* Action Alert Banner when an expert submitted work */}
        {readyForReviewRequests.length > 0 && (
          <div
            className="alert-banner-box"
            style={{
              background: 'var(--indigo-subtle)',
              border: '1px solid var(--indigo)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--indigo)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconSend size={18} color="#fff" />
              </div>
              <div>
                <strong style={{ color: 'var(--indigo)', fontSize: 15 }}>
                  {readyForReviewRequests.length} Deliverable(s) Ready for Your Review!
                </strong>
                <div style={{ fontSize: 13, color: 'var(--ink-secondary)', marginTop: 2 }}>
                  Your assigned academic expert has submitted completed solution files.
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ background: 'var(--indigo)', borderColor: 'var(--indigo)', fontSize: 13 }}
              onClick={() => setReviewingRequest(readyForReviewRequests[0])}
            >
              Review Deliverable Now →
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="metric-row">
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num">{myRequests.length}</div>
              <div className="metric-icon-badge" style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconFileText size={20} color="var(--blue)" />
              </div>
            </div>
            <div className="lbl">Total Requests</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num" style={{ color: 'var(--warning)' }}>{inProgressRequests.length}</div>
              <div className="metric-icon-badge" style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--warning-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconZap size={20} color="var(--warning)" />
              </div>
            </div>
            <div className="lbl">In Progress</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num" style={{ color: 'var(--indigo)' }}>{readyForReviewRequests.length}</div>
              <div className="metric-icon-badge" style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--indigo-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconMessageSquare size={20} color="var(--indigo)" />
              </div>
            </div>
            <div className="lbl">Ready for Review</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num" style={{ color: 'var(--success)' }}>{completedRequests.length}</div>
              <div className="metric-icon-badge" style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCheckCircle size={20} color="var(--success)" />
              </div>
            </div>
            <div className="lbl">Completed Projects</div>
          </div>
        </div>

        {/* Requests Management Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 20 }}>Your Academic Requests</h2>
          <div className="chip-row" style={{ margin: 0, padding: 0 }}>
            <button
              className={`chip ${tab === 'all' ? 'selected' : ''}`}
              onClick={() => setTab('all')}
            >
              All ({myRequests.length})
            </button>
            <button
              className={`chip ${tab === 'review' ? 'selected' : ''}`}
              onClick={() => setTab('review')}
            >
              Needs Review ({readyForReviewRequests.length})
            </button>
            <button
              className={`chip ${tab === 'progress' ? 'selected' : ''}`}
              onClick={() => setTab('progress')}
            >
              In Progress ({inProgressRequests.length})
            </button>
            <button
              className={`chip ${tab === 'open' ? 'selected' : ''}`}
              onClick={() => setTab('open')}
            >
              Open ({openRequests.length})
            </button>
            <button
              className={`chip ${tab === 'completed' ? 'selected' : ''}`}
              onClick={() => setTab('completed')}
            >
              Completed ({completedRequests.length})
            </button>
          </div>
        </div>

        {displayedRequests.length > 0 ? (
          <div className="grid grid-3">
            {displayedRequests.map((r) => (
              <RequestCard
                r={r}
                key={r.id}
                onClick={(req) => {
                  if (req.status === 'submitted') {
                    setReviewingRequest(req);
                  } else {
                    setSelectedRequest(req);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <IconFileText size={28} color="var(--blue)" />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>No requests found in this view</h3>
            <p className="muted" style={{ maxWidth: 460, margin: '0 auto 24px', fontSize: 14.5 }}>
              Post a new academic request or choose a different status filter above.
            </p>
            <Link to="/dashboard/requests/new" className="btn btn-primary">
              Post a New Request →
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

        {/* Review Submission Modal */}
        {reviewingRequest && (
          <ReviewSubmissionModal
            request={reviewingRequest}
            onClose={() => setReviewingRequest(null)}
            onSuccess={() => {
              setReviewingRequest(null);
              setTab('completed');
            }}
          />
        )}
      </main>
    </div>
  );
}
