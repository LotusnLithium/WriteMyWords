import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import RequestCard from '../components/RequestCard.jsx';
import RequestDetailModal from '../components/RequestDetailModal.jsx';
import {
  IconFileText,
  IconSearch,
  IconSparkles,
  IconLayers,
  IconPresentation,
  IconUser,
  IconShield,
  IconGraduationCap,
  IconClock,
  IconLock,
  IconCurrency,
  IconZap,
} from '../components/Icons.jsx';

const CATEGORIES = [
  {
    title: 'Assignment Guidance',
    icon: <IconFileText size={24} color="var(--blue)" />,
    desc: 'Break down complex briefs, thesis statements, and structure winning arguments.',
  },
  {
    title: 'Research Support',
    icon: <IconSearch size={24} color="var(--blue)" />,
    desc: 'Literature reviews, scholarly source discovery, and data synthesis.',
  },
  {
    title: 'Proofreading',
    icon: <IconSparkles size={24} color="var(--blue)" />,
    desc: 'Grammar perfection, style refinement, tone optimization, and flow.',
  },
  {
    title: 'Formatting',
    icon: <IconLayers size={24} color="var(--blue)" />,
    desc: 'APA, MLA, Harvard, IEEE, Chicago referencing and layout styling.',
  },
  {
    title: 'Presentation Support',
    icon: <IconPresentation size={24} color="var(--blue)" />,
    desc: 'Structure presentation decks, speaker notes, and concise visual summaries.',
  },
  {
    title: 'Tutoring',
    icon: <IconUser size={24} color="var(--blue)" />,
    desc: '1-on-1 concept explanations and subject-specific exam preparation.',
  },
];

const WORKFLOW_STEPS = [
  { name: '1. Brief', title: 'Post Brief & Budget', desc: 'Describe your requirements, academic level, and target deadline.', time: '2 mins' },
  { name: '2. Match', title: 'Connect with Experts', desc: 'Review qualified experts in your subject area without spam.', time: '15 mins' },
  { name: '3. Draft', title: '1-on-1 Collaboration', desc: 'Share draft files securely and get real-time feedback.', time: 'In Progress' },
  { name: '4. Deliver', title: 'Refined & Ready', desc: 'Receive polished work with all citations and formatting verified.', time: 'On Schedule' },
];

const FAQS = [
  {
    q: 'How does WriteMyWords protect student privacy?',
    a: 'Your personal contact information and identity are never publicly exposed. Only the academic details and requirements of your request are visible to verified experts on the board.'
  },
  {
    q: 'How are budgets and payments handled?',
    a: 'Students set their own realistic budget range upfront. Once you choose an expert, terms are agreed upon and payment is only released once you are satisfied with the final delivery.'
  },
  {
    q: 'What academic levels do experts cover?',
    a: 'Our network includes verified subject specialists across High School, Undergraduate, Postgraduate (Master’s), and Doctoral (Ph.D.) academic programs.'
  },
  {
    q: 'How quickly can I get help on an urgent deadline?',
    a: 'Many experts accommodate turnaround times ranging from 24–48 hours for urgent reviews and proofreading up to multi-week research projects.'
  },
];

export default function Home() {
  const { requests } = useApp();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const openCount = requests.length;
  const totalBudget = requests.reduce((sum, r) => sum + Number(r.budget_max ?? r.budgetMax ?? 0), 0);

  function toggleFaq(idx) {
    setOpenFaq(openFaq === idx ? null : idx);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="wrap hero-grid">
        <div>
          <div className="eyebrow">
            <IconZap size={14} color="var(--blue)" /> ACADEMIC SUPPORT, ON YOUR SCHEDULE
          </div>
          <h1 style={{ marginTop: 14 }}>
            Too much academic work.<br />
            <span style={{ color: 'var(--blue)' }}>Get expert guidance</span> fast.
          </h1>
          <p className="lede" style={{ marginTop: 18 }}>
            Connect with verified academic specialists for research guidance, proofreading, citation formatting, presentations, and 1-on-1 tutoring — tailored to your exact rubric and deadline.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Post a Request Free →
            </Link>
            <Link to="/requests" className="btn btn-ghost btn-lg">
              Browse Open Board
            </Link>
          </div>

          <div className="trust-pills">
            <div className="trust-pill">
              <span className="trust-pill-icon"><IconShield size={16} color="var(--success)" /></span> 100% Confidential
            </div>
            <div className="trust-pill">
              <span className="trust-pill-icon"><IconGraduationCap size={16} color="var(--success)" /></span> Verified Academic Experts
            </div>
            <div className="trust-pill">
              <span className="trust-pill-icon"><IconClock size={16} color="var(--success)" /></span> Deadline Guarantee
            </div>
          </div>
        </div>

        {/* Interactive Words in Motion Visualizer */}
        <div className="card" style={{ boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-strong)', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="eyebrow">WORDS IN MOTION</div>
            <span className="badge badge-success">Live Workflow</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 20 }}>
            {WORKFLOW_STEPS.map((s, idx) => (
              <button
                key={s.name}
                onClick={() => setActiveStep(idx)}
                style={{
                  padding: '8px 4px',
                  borderRadius: 'var(--r-xs)',
                  fontSize: 12,
                  fontWeight: 600,
                  textAlign: 'center',
                  background: activeStep === idx ? 'var(--ink)' : 'var(--surface-alt)',
                  color: activeStep === idx ? '#fff' : 'var(--ink-secondary)',
                  transition: 'all var(--transition)'
                }}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--paper)', borderRadius: 'var(--r-md)', padding: 20, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ fontSize: 18, color: 'var(--ink)' }}>{WORKFLOW_STEPS[activeStep].title}</h3>
              <span className="badge badge-warn">{WORKFLOW_STEPS[activeStep].time}</span>
            </div>
            <p className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>
              {WORKFLOW_STEPS[activeStep].desc}
            </p>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>Step {activeStep + 1} of 4</span>
              <button
                className="btn btn-subtle btn-sm"
                onClick={() => setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length)}
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Trust Banner */}
      <section className="wrap" style={{ paddingTop: 0 }}>
        <div className="grid grid-3">
          <div className="card" style={{ borderLeft: '4px solid var(--blue)' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--r-sm)', background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <IconLock size={22} color="var(--blue)" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>One expert per request</h3>
            <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>
              Once matched, your request locks to your selected specialist — no confusing overlapping bids or unvetted contractors.
            </p>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--r-sm)', background: 'var(--warning-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <IconClock size={22} color="var(--warning)" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>Deadline First & On-Time</h3>
            <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>
              Every request carries a clear timeline. Experts commit to your target date before beginning work.
            </p>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--r-sm)', background: 'var(--success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <IconCurrency size={22} color="var(--success)" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>
              ₹{totalBudget.toLocaleString('en-IN')} across {openCount} requests
            </h3>
            <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>
              Transparent pricing set directly by students. Budget is held securely and released upon your final approval.
            </p>
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="wrap" style={{ background: 'var(--surface-alt)', borderRadius: 'var(--r-xl)', padding: '56px 32px', margin: '20px auto' }}>
        <div className="section-head">
          <div className="eyebrow">WHAT WE SUPPORT</div>
          <h2>Academic services designed for high performers</h2>
          <p className="muted" style={{ marginTop: 8 }}>Tap any category to explore active requests or post your own.</p>
        </div>
        <div className="grid grid-3">
          {CATEGORIES.map((cat) => (
            <div
              className="card card-interactive"
              key={cat.title}
              onClick={() => navigate(`/requests?category=${encodeURIComponent(cat.title)}`)}
            >
              <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                {cat.icon}
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{cat.title}</h3>
              <p className="muted" style={{ fontSize: 14 }}>{cat.desc}</p>
              <div style={{ marginTop: 14, color: 'var(--blue)', fontSize: 13.5, fontWeight: 600 }}>
                Explore requests →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Open Requests Live Preview */}
      <section className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="eyebrow">ACTIVE BOARD</div>
            <h2 style={{ marginTop: 6 }}>Recent open requests</h2>
            <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
              {openCount} request{openCount === 1 ? '' : 's'} waiting for an academic specialist.
            </p>
          </div>
          <Link to="/requests" className="btn btn-ghost btn-sm">
            View All ({openCount}) →
          </Link>
        </div>

        <div className="grid grid-3">
          {requests.slice(0, 6).map((r) => (
            <RequestCard r={r} key={r.id} onClick={(req) => setSelectedRequest(req)} />
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="wrap" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="section-head" style={{ textAlign: 'center', margin: '0 auto 40px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>FREQUENTLY ASKED QUESTIONS</div>
          <h2>Everything you need to know</h2>
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map((faq, idx) => (
            <div
              key={faq.q}
              className="card"
              style={{ padding: '18px 22px', cursor: 'pointer' }}
              onClick={() => toggleFaq(idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <h3 style={{ fontSize: 16.5, fontWeight: 600, color: 'var(--ink)' }}>{faq.q}</h3>
                <span style={{ fontSize: 18, color: 'var(--blue)', fontWeight: 700 }}>
                  {openFaq === idx ? '−' : '+'}
                </span>
              </div>
              {openFaq === idx && (
                <p className="muted" style={{ fontSize: 14.5, marginTop: 12, lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <div className="card" style={{ maxWidth: 600, margin: '0 auto', background: 'linear-gradient(135deg, var(--ink) 0%, #1E293B 100%)', color: '#fff', padding: '36px 24px' }}>
            <h3 style={{ color: '#fff', fontSize: 24, marginBottom: 10 }}>Ready to get started?</h3>
            <p style={{ color: '#94A3B8', fontSize: 15, marginBottom: 20 }}>
              Join students and verified academic experts collaborating across universities.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-accent">
                Post a Request Now
              </Link>
              <Link to="/signup?role=expert" className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                Join as Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </>
  );
}
