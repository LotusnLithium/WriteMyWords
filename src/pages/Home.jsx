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

const HERO_PREVIEWS = {
  'Assignment Guidance': {
    title: 'Guidance on Environmental Economics Thesis & Model Analysis',
    subject: 'Economics / Policy',
    level: 'Master’s Degree',
    budget: '₹1,800 – ₹3,500',
    deadline: '3 Days',
    expert: 'Dr. Arthur Sterling • Ph.D. Oxford',
    expertRating: '4.98 (124 reviews)',
    brief: 'Need structured feedback on empirical methodology, statistical regression checks, and synthesis of recent policy papers.',
  },
  'Research Support': {
    title: 'Literature Review & Scholarly Source Synthesis in AI Healthcare',
    subject: 'Computer Science / BioMed',
    level: 'Postgraduate',
    budget: '₹2,500 – ₹5,000',
    deadline: '4 Days',
    expert: 'Prof. Elena Vance • Ph.D. Cambridge',
    expertRating: '5.0 (89 reviews)',
    brief: 'Synthesize 25+ peer-reviewed journal articles on predictive diagnostic algorithms with comprehensive citation mapping.',
  },
  'Proofreading': {
    title: 'Dissertation Chapter Proofreading & Academic Tone Polishing',
    subject: 'Clinical Psychology',
    level: 'Doctoral (Ph.D.)',
    budget: '₹1,500 – ₹3,000',
    deadline: '48 Hours',
    expert: 'Claire Bennett • M.A. Harvard',
    expertRating: '4.95 (210 reviews)',
    brief: 'Refine academic prose, eliminate structural ambiguities, and ensure pristine grammatical coherence across 6,000 words.',
  },
  'Formatting': {
    title: 'APA 7th & IEEE Multi-Journal Citation & Layout Compliance',
    subject: 'Engineering & Data Systems',
    level: 'Undergraduate',
    budget: '₹800 – ₹1,800',
    deadline: '24 Hours',
    expert: 'Marcus Brody • Academic Editor',
    expertRating: '4.92 (167 reviews)',
    brief: 'Format in-text citations, compile accurate references, and style figures and mathematical formulas per journal guidelines.',
  },
};

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
  const [heroCategory, setHeroCategory] = useState('Assignment Guidance');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const openCount = requests.length;
  const totalBudget = requests.reduce((sum, r) => sum + Number(r.budget_max ?? r.budgetMax ?? 0), 0);
  const currentPreview = HERO_PREVIEWS[heroCategory] || HERO_PREVIEWS['Assignment Guidance'];

  function toggleFaq(idx) {
    setOpenFaq(openFaq === idx ? null : idx);
  }

  return (
    <>
      {/* Redesigned Modern Hero Section */}
      <section className="hero-section-wrapper">
        <div className="wrap hero-grid">
          <div className="hero-content">
            {/* Announcement Pill */}
            <div className="hero-announcement-pill">
              <span className="pulse-dot"></span>
              <span className="pill-tag">2026 EDITION</span>
              <span className="pill-text">Verified Academic Specialists & 1-on-1 Mentorship</span>
            </div>

            {/* Bold Headline */}
            <h1 className="hero-title">
              Master complex assignments with{' '}
              <span className="hero-gradient-text">1-on-1 academic specialists.</span>
            </h1>

            {/* Sub-headline */}
            <p className="hero-subtitle">
              Get rubric-aligned feedback, in-depth literature synthesis, APA/IEEE citation formatting, and expert proofreading — confidential, on-time, and tailored to your goals.
            </p>

            {/* CTA Group */}
            <div className="hero-cta-group">
              <div className="hero-cta">
                <Link to="/signup" className="btn btn-accent btn-lg hero-btn-glow">
                  Post a Request Free →
                </Link>
                <Link to="/requests" className="btn btn-ghost btn-lg">
                  Browse Open Board ({openCount})
                </Link>
              </div>
              <div className="hero-micro-reassurance">
                <span>⚡ Free to post</span>
                <span className="bullet-sep">•</span>
                <span>🔒 100% Confidential</span>
                <span className="bullet-sep">•</span>
                <span>⏱️ 24h Express Turnaround</span>
              </div>
            </div>

            {/* Social Proof & Trust Badges */}
            <div className="hero-social-proof">
              <div className="avatar-group">
                <span className="hero-avatar" style={{ background: '#2563EB' }}>AK</span>
                <span className="hero-avatar" style={{ background: '#059669' }}>MR</span>
                <span className="hero-avatar" style={{ background: '#7C3AED' }}>SL</span>
                <span className="hero-avatar" style={{ background: '#D97706' }}>JD</span>
              </div>
              <div className="proof-info">
                <div className="stars-row">
                  <span className="stars">★★★★★</span>
                  <span className="rating-score">4.9/5</span>
                </div>
                <div className="proof-subtext">From 2,400+ scholars across top universities</div>
              </div>
            </div>
          </div>

          {/* Interactive Live Platform Showcase Card */}
          <div className="hero-showcase-container">
            <div className="card hero-interactive-card">
              {/* Card Top Bar */}
              <div className="showcase-header">
                <div className="showcase-live-indicator">
                  <span className="live-pulse"></span>
                  <span>LIVE PLATFORM MATCH</span>
                </div>
                <div className="showcase-budget-pill">
                  {currentPreview.budget}
                </div>
              </div>

              {/* Category Switcher Tabs */}
              <div className="showcase-category-row">
                {Object.keys(HERO_PREVIEWS).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setHeroCategory(cat)}
                    className={`showcase-cat-chip ${heroCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Assignment Brief Simulator Box */}
              <div className="showcase-brief-box">
                <div className="showcase-badges-row">
                  <span className="badge">{heroCategory}</span>
                  <span className="badge badge-neutral">{currentPreview.level}</span>
                  <span className="badge badge-warn">⏱️ {currentPreview.deadline}</span>
                </div>

                <h3 className="showcase-assignment-title">
                  {currentPreview.title}
                </h3>

                <p className="showcase-assignment-desc">
                  {currentPreview.brief}
                </p>

                <div className="showcase-expert-match">
                  <div className="expert-avatar-icon">
                    <IconGraduationCap size={20} color="var(--blue)" />
                  </div>
                  <div className="expert-match-details">
                    <div className="expert-name">{currentPreview.expert}</div>
                    <div className="expert-rating">⭐ {currentPreview.expertRating} • Verified Specialist</div>
                  </div>
                  <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Matched</span>
                </div>
              </div>

              {/* Bottom Interactive Trigger */}
              <div className="showcase-footer">
                <div className="showcase-footer-stat">
                  <span className="stat-label">Subject:</span>
                  <strong>{currentPreview.subject}</strong>
                </div>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Try Request Wizard →
                </Link>
              </div>
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
      <section className="wrap" style={{ paddingTop: 10, paddingBottom: 20 }}>
        <div className="services-banner">
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
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
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
        </div>
      </section>

      {/* Open Requests Live Preview */}
      <section className="wrap">
        <div className="dash-header-wrap" style={{ alignItems: 'flex-end', marginBottom: 24 }}>
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
        <div className="section-head" style={{ textAlign: 'center', margin: '0 auto 36px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>FREQUENTLY ASKED QUESTIONS</div>
          <h2>Everything you need to know</h2>
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map((faq, idx) => (
            <div
              key={faq.q}
              className="card faq-card"
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

        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <div className="home-cta-card">
            <h3 style={{ color: '#fff', fontSize: 'clamp(20px, 3.5vw, 24px)', marginBottom: 10 }}>Ready to get started?</h3>
            <p style={{ color: '#94A3B8', fontSize: 15, marginBottom: 22 }}>
              Join students and verified academic experts collaborating across universities.
            </p>
            <div className="home-cta-actions">
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
