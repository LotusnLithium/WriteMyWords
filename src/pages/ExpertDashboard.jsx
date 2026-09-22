import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import RequestCard from '../components/RequestCard.jsx';
import RequestDetailModal from '../components/RequestDetailModal.jsx';
import SubmitWorkModal from '../components/SubmitWorkModal.jsx';
import {
  IconTrendingUp,
  IconSearch,
  IconFileText,
  IconSend,
  IconBriefcase,
  IconCurrency,
  IconClock,
  IconCheckCircle,
  IconStar,
  IconAlertCircle,
  IconRotateCcw,
} from '../components/Icons.jsx';

export default function ExpertDashboard() {
  const { user, authLoading, requests, assignedRequests } = useApp();
  const [tab, setTab] = useState('active'); // 'active' | 'review' | 'completed' | 'available'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [submittingJob, setSubmittingJob] = useState(null);

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

  // Filter assigned jobs
  const activeJobs = assignedRequests.filter(
    (r) => r.status === 'in_progress' || r.status === 'revision_requested'
  );
  const underReviewJobs = assignedRequests.filter((r) => r.status === 'submitted');
  const completedJobs = assignedRequests.filter((r) => r.status === 'completed');
  const availableRequests = requests.filter((r) => r.status === 'open');

  const totalEarned = completedJobs.reduce(
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
        <div className="dash-header-wrap">
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>EXPERT WORKSPACE</div>
            <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)' }}>Welcome back, {firstName}</h1>
            <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
              Manage active academic engagements, submit deliverables, and track completed student projects.
            </p>
          </div>
          <Link to="/requests" className="btn btn-accent">
            Find New Requests ({availableRequests.length})
          </Link>
        </div>

        {/* Action Alert for Revision Request if any */}
        {activeJobs.some((r) => r.status === 'revision_requested') && (
          <div
            className="alert-banner-box"
            style={{
              background: 'var(--error-subtle)',
              border: '1px solid var(--error)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconAlertCircle size={20} color="var(--error)" />
              <div>
                <strong style={{ color: 'var(--error)', fontSize: 15 }}>Revision Requested on Assignment</strong>
                <div style={{ fontSize: 13, color: 'var(--ink)' }}>
                  A student has provided revision feedback on their deliverable. Resubmit the updated solution.
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ fontSize: 12.5, padding: '7px 14px', background: 'var(--error)', borderColor: 'var(--error)' }}
              onClick={() => {
                const job = activeJobs.find((r) => r.status === 'revision_requested');
                if (job) setSubmittingJob(job);
              }}
            >
              Update Deliverable
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="metric-row">
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num" style={{ color: 'var(--warning)' }}>{activeJobs.length}</div>
              <div className="metric-icon-badge" style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--warning-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconBriefcase size={20} color="var(--warning)" />
              </div>
            </div>
            <div className="lbl">Active Assignments</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num" style={{ color: 'var(--indigo)' }}>{underReviewJobs.length}</div>
              <div className="metric-icon-badge" style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--indigo-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconSend size={20} color="var(--indigo)" />
              </div>
            </div>
            <div className="lbl">Under Review</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num" style={{ color: 'var(--success)' }}>{completedJobs.length}</div>
              <div className="metric-icon-badge" style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCheckCircle size={20} color="var(--success)" />
              </div>
            </div>
            <div className="lbl">Completed Works</div>
          </div>
          <div className="metric">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="num" style={{ color: 'var(--success)' }}>
                ₹{totalEarned.toLocaleString('en-IN')}
              </div>
              <div className="metric-icon-badge" style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'var(--success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCurrency size={20} color="var(--success)" />
              </div>
            </div>
            <div className="lbl">Total Earned</div>
          </div>
        </div>

        {/* Tabs Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div className="chip-row" style={{ margin: 0, padding: 0 }}>
            <button
              className={`chip ${tab === 'active' ? 'selected' : ''}`}
              onClick={() => setTab('active')}
            >
              Active Assignments ({activeJobs.length})
            </button>
            <button
              className={`chip ${tab === 'review' ? 'selected' : ''}`}
              onClick={() => setTab('review')}
            >
              Under Review ({underReviewJobs.length})
            </button>
            <button
              className={`chip ${tab === 'completed' ? 'selected' : ''}`}
              onClick={() => setTab('completed')}
            >
              Completed ({completedJobs.length})
            </button>
            <button
              className={`chip ${tab === 'available' ? 'selected' : ''}`}
              onClick={() => setTab('available')}
            >
              Available Board ({availableRequests.length})
            </button>
          </div>
        </div>

        {/* Active Assignments View */}
        {tab === 'active' && (
          activeJobs.length > 0 ? (
            <div className="grid grid-2">
              {activeJobs.map((job) => (
                <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span className="badge">{job.category || 'Academic'}</span>
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--r-full)',
                          color: job.status === 'revision_requested' ? 'var(--error)' : 'var(--warning)',
                          background: job.status === 'revision_requested' ? 'var(--error-subtle)' : 'var(--warning-subtle)',
                        }}
                      >
                        {job.status === 'revision_requested' ? 'REVISION REQUESTED' : 'IN PROGRESS'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 17, marginBottom: 8 }}>{job.title}</h3>
                    <p className="muted" style={{ fontSize: 13.5, marginBottom: 14, lineHeight: 1.5 }}>
                      {job.description}
                    </p>

                    {job.status === 'revision_requested' && job.revision_notes && (
                      <div style={{ background: 'var(--error-subtle)', padding: 10, borderRadius: 'var(--r-xs)', fontSize: 13, marginBottom: 14 }}>
                        <strong>Student Feedback:</strong> {job.revision_notes}
                      </div>
                    )}
                  </div>

                  <div style={{ paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      ₹{Number(job.budget_max ?? job.budgetMax ?? 0).toLocaleString('en-IN')}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: 12.5, padding: '6px 12px' }}
                        onClick={() => setSelectedRequest(job)}
                      >
                        Details
                      </button>
                      <button
                        className="btn btn-accent"
                        style={{ fontSize: 12.5, padding: '6px 14px' }}
                        onClick={() => setSubmittingJob(job)}
                      >
                        <IconSend size={14} color="#fff" /> Submit Deliverable
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <IconBriefcase size={28} color="var(--ink-muted)" />
              </div>
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>No active assignments</h3>
              <p className="muted" style={{ maxWidth: 460, margin: '0 auto 20px', fontSize: 14.5 }}>
                Browse open student requests and claim new academic assignments to get started.
              </p>
              <button className="btn btn-primary" onClick={() => setTab('available')}>
                Browse Available Requests →
              </button>
            </div>
          )
        )}

        {/* Under Review View */}
        {tab === 'review' && (
          underReviewJobs.length > 0 ? (
            <div className="grid grid-2">
              {underReviewJobs.map((job) => (
                <div key={job.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className="badge">{job.category}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-full)', color: 'var(--indigo)', background: 'var(--indigo-subtle)' }}>
                      SUBMITTED FOR REVIEW
                    </span>
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 8 }}>{job.title}</h3>
                  <p className="muted" style={{ fontSize: 13.5, marginBottom: 14 }}>
                    {job.submission_notes ? job.submission_notes.slice(0, 140) + '…' : 'Deliverable submitted.'}
                  </p>
                  <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <span className="muted">Waiting for student confirmation</span>
                    <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => setSelectedRequest(job)}>
                      View Submission
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>No deliverables under review</h3>
              <p className="muted" style={{ fontSize: 14 }}>When you submit work on active jobs, it will appear here while the student reviews it.</p>
            </div>
          )
        )}

        {/* Completed View */}
        {tab === 'completed' && (
          completedJobs.length > 0 ? (
            <div className="grid grid-2">
              {completedJobs.map((job) => (
                <div key={job.id} className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span className="badge">{job.category}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconCheckCircle size={14} color="var(--success)" /> COMPLETED
                    </span>
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 6 }}>{job.title}</h3>
                  {job.student_rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <IconStar key={s} size={15} color={s <= job.student_rating ? '#f59e0b' : 'var(--border)'} />
                      ))}
                      <span style={{ fontSize: 12.5, fontWeight: 600, marginLeft: 4 }}>
                        {job.student_rating}/5 Rating
                      </span>
                    </div>
                  )}
                  {job.student_feedback && (
                    <p style={{ fontSize: 13, color: 'var(--ink-secondary)', fontStyle: 'italic', marginBottom: 12 }}>
                      "{job.student_feedback}"
                    </p>
                  )}
                  <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>
                    <span>Fee Earned:</span>
                    <span>₹{Number(job.budget_max ?? job.budgetMax ?? 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>No completed works yet</h3>
              <p className="muted" style={{ fontSize: 14 }}>Delivered assignments accepted by students will appear here.</p>
            </div>
          )
        )}

        {/* Available Requests View */}
        {tab === 'available' && (
          availableRequests.length > 0 ? (
            <div className="grid grid-3">
              {availableRequests.map((r) => (
                <RequestCard
                  r={r}
                  key={r.id}
                  onClick={(req) => setSelectedRequest(req)}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>No open requests available</h3>
              <p className="muted" style={{ fontSize: 14 }}>Check back soon for new student assignment briefs.</p>
            </div>
          )
        )}

        {/* Request Detail Modal */}
        {selectedRequest && (
          <RequestDetailModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}

        {/* Submit Work Modal */}
        {submittingJob && (
          <SubmitWorkModal
            request={submittingJob}
            onClose={() => setSubmittingJob(null)}
            onSuccess={() => {
              setSubmittingJob(null);
              setTab('review');
            }}
          />
        )}
      </main>
    </div>
  );
}
