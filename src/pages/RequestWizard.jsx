import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { cleanText, validateFileAttachment } from '../lib/supabaseClient';
import {
  IconFileText,
  IconSearch,
  IconSparkles,
  IconLayers,
  IconPresentation,
  IconUser,
  IconTools,
  IconBookOpen,
  IconZap,
  IconUploadCloud,
  IconPaperclip,
  IconSend,
  IconClock,
} from '../components/Icons.jsx';

const CATEGORIES = [
  { name: 'Assignment Guidance', icon: <IconFileText size={22} color="var(--blue)" />, desc: 'Brief interpretation, outline structuring, thesis development' },
  { name: 'Research Support', icon: <IconSearch size={22} color="var(--blue)" />, desc: 'Scholarly citations, literature synthesis, journal discovery' },
  { name: 'Proofreading', icon: <IconSparkles size={22} color="var(--blue)" />, desc: 'Grammar review, academic tone, style polishing' },
  { name: 'Formatting', icon: <IconLayers size={22} color="var(--blue)" />, desc: 'APA, MLA, Harvard, IEEE referencing and typography' },
  { name: 'Presentation Support', icon: <IconPresentation size={22} color="var(--blue)" />, desc: 'Slide deck structuring, speaking notes, visual clarity' },
  { name: 'Tutoring', icon: <IconUser size={22} color="var(--blue)" />, desc: '1-on-1 concept explanations and specialized subject guidance' },
  { name: 'Project Support', icon: <IconTools size={22} color="var(--blue)" />, desc: 'End-to-end project methodology and structure advice' },
  { name: 'Journal Guidance', icon: <IconBookOpen size={22} color="var(--blue)" />, desc: 'Peer-review preparation, abstract and manuscript feedback' },
  { name: 'Other', icon: <IconZap size={22} color="var(--blue)" />, desc: 'Custom academic support tailored to your brief' },
];

const DEADLINES = [
  { label: '24 Hours', value: '1 day', badge: 'Urgent' },
  { label: '2 Days', value: '2 days', badge: 'Popular' },
  { label: '3 Days', value: '3 days', badge: 'Standard' },
  { label: '5 Days', value: '5 days', badge: 'Standard' },
  { label: '1 Week', value: '1 week', badge: 'Relaxed' },
  { label: '2 Weeks', value: '2 weeks', badge: 'Extended' },
];

const LEVELS = ['High School', 'Undergraduate', 'Postgraduate', 'Doctoral'];

const BUDGET_PRESETS = [
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,500', min: 1000, max: 2500 },
  { label: '₹2,500 – ₹5,000', min: 2500, max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
];

const STEP_TITLES = [
  'Category',
  'Brief Details',
  'Timeline',
  'Budget',
  'Attachments',
  'Review & Post'
];

export default function RequestWizard() {
  const { user, authLoading, addRequest, toast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  const [data, setData] = useState({
    category: 'Assignment Guidance',
    title: '',
    description: '',
    subject: '',
    academic_level: 'Undergraduate',
    deadline: '3 days',
    budget_min: 800,
    budget_max: 1500,
  });

  const [files, setFiles] = useState([]);

  if (authLoading) {
    return (
      <div className="wrap" style={{ padding: '80px 0', textAlign: 'center' }}>
        <IconClock size={32} color="var(--ink-muted)" />
        <p className="muted" style={{ marginTop: 12 }}>Loading workspace…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const update = (field) => (e) => setData((d) => ({ ...d, [field]: e.target.value }));

  function handleFileAdd(e) {
    const selected = Array.from(e.target.files || []);
    if (selected.length) {
      const validFiles = [];
      for (const f of selected) {
        const check = validateFileAttachment(f);
        if (!check.valid) {
          toast(`Cannot attach ${f.name}: ${check.error}`);
          continue;
        }
        validFiles.push({
          name: f.name.replace(/[^a-zA-Z0-9._\-]/g, '_'),
          size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
        });
      }
      if (validFiles.length) {
        setFiles((prev) => [...prev, ...validFiles]);
        toast(`${validFiles.length} file(s) attached`);
      }
    }
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function validateStep(currentStep) {
    if (currentStep === 1 && !data.category) {
      toast('Please select a category');
      return false;
    }
    if (currentStep === 2) {
      if (!data.title.trim()) {
        toast('Please enter a brief request title');
        return false;
      }
      if (!data.description.trim()) {
        toast('Please describe your requirements in detail');
        return false;
      }
    }
    if (currentStep === 4) {
      if (Number(data.budget_min) < 0 || Number(data.budget_max) <= 0) {
        toast('Please specify a valid budget range');
        return false;
      }
      if (Number(data.budget_min) > Number(data.budget_max)) {
        toast('Minimum budget cannot exceed maximum budget');
        return false;
      }
    }
    return true;
  }

  function nextStep() {
    if (validateStep(step)) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function prevStep() {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await addRequest({
        title: cleanText(data.title, 150) || 'Academic Request',
        category: data.category || 'Other',
        subject: cleanText(data.subject, 80) || 'General',
        academic_level: data.academic_level,
        description: cleanText(data.description, 2000),
        budget_min: Math.max(0, Number(data.budget_min) || 0),
        budget_max: Math.max(0, Number(data.budget_max) || 0),
        deadline: data.deadline,
      });
      toast('Request posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast('Could not post your request — please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const progressPercent = Math.round((step / 6) * 100);

  return (
    <div className="app-shell">
      <aside className="app-side">
        <Link to="/dashboard">← Back to Dashboard</Link>
        <Link to="/dashboard/requests/new" className="active">✨ Post a Request</Link>
        <Link to="/requests">Browse Board</Link>
      </aside>

      <main className="app-main">
        {/* Progress & Stepper */}
        <div className="stepper-container" style={{ maxWidth: 640 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--ink-secondary)' }}>
            <span>Step {step} of 6: {STEP_TITLES[step - 1]}</span>
            <span>{progressPercent}% completed</span>
          </div>
          <div className="stepper-progress-bar">
            <div className="stepper-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          <div className="stepper">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="step-item">
                <div className={`sdot ${n === step ? 'active' : n < step ? 'done' : ''}`}>
                  {n < step ? '✓' : n}
                </div>
                <span className="step-item-title" style={{ fontSize: 12 }}>
                  {STEP_TITLES[n - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 640 }}>
          {/* STEP 1: Category */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 26, marginBottom: 8 }}>What type of support do you need?</h2>
              <p className="muted" style={{ marginBottom: 24, fontSize: 15 }}>
                Choose the primary category that best matches your academic assignment.
              </p>
              <div className="grid grid-2" style={{ gap: 14 }}>
                {CATEGORIES.map((c) => (
                  <div
                    key={c.name}
                    className={`card card-interactive ${data.category === c.name ? 'selected' : ''}`}
                    style={{
                      padding: 16,
                      border: data.category === c.name ? '2px solid var(--blue)' : '1px solid var(--border)',
                      background: data.category === c.name ? 'var(--blue-subtle)' : 'var(--surface)',
                    }}
                    onClick={() => setData((d) => ({ ...d, category: c.name }))}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                      {c.icon}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{c.name}</h3>
                    <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.4 }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 26, marginBottom: 8 }}>Tell us about your requirements</h2>
              <p className="muted" style={{ marginBottom: 22, fontSize: 15 }}>
                Provide clear instructions so relevant experts can accurately assess your request.
              </p>

              <div className="field">
                <label>
                  <span>Request Title *</span>
                  <span className="muted" style={{ fontSize: 12 }}>{data.title.length}/150</span>
                </label>
                <input
                  value={data.title}
                  onChange={update('title')}
                  placeholder="e.g. Guidance on Literature Review for Environmental Economics"
                  maxLength={150}
                  autoFocus
                />
              </div>

              <div className="field">
                <label>
                  <span>Detailed Description / Brief *</span>
                  <span className="muted" style={{ fontSize: 12 }}>{data.description.length}/2000</span>
                </label>
                <textarea
                  rows={5}
                  value={data.description}
                  onChange={update('description')}
                  placeholder="Explain what help you need: prompt requirements, rubric criteria, word count, referencing style (e.g. APA 7th), specific questions..."
                  maxLength={2000}
                />
              </div>

              <div className="field">
                <label>Academic Subject / Discipline</label>
                <input
                  value={data.subject}
                  onChange={update('subject')}
                  placeholder="e.g. Psychology, Business Finance, Computer Science, Law"
                  maxLength={80}
                />
              </div>

              <div className="field">
                <label>Academic Level</label>
                <select value={data.academic_level} onChange={update('academic_level')}>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Timeline */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 26, marginBottom: 8 }}>When is your target deadline?</h2>
              <p className="muted" style={{ marginBottom: 24, fontSize: 15 }}>
                Experts review turnaround times before committing to your request.
              </p>

              <div className="grid grid-2" style={{ gap: 14 }}>
                {DEADLINES.map((d) => (
                  <div
                    key={d.value}
                    className="card card-interactive"
                    style={{
                      padding: 18,
                      border: data.deadline === d.value ? '2px solid var(--blue)' : '1px solid var(--border)',
                      background: data.deadline === d.value ? 'var(--blue-subtle)' : 'var(--surface)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onClick={() => setData((s) => ({ ...s, deadline: d.value }))}
                  >
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{d.label}</h3>
                      <div className="muted" style={{ fontSize: 12.5 }}>Target turnaround</div>
                    </div>
                    <span className="badge badge-warn">{d.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Budget */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 26, marginBottom: 8 }}>What is your budget?</h2>
              <p className="muted" style={{ marginBottom: 20, fontSize: 15 }}>
                Set an estimated price range in INR (₹). You only pay once work is approved.
              </p>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 10 }}>
                  QUICK PRESETS
                </div>
                <div className="chip-row">
                  {BUDGET_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className={`chip ${data.budget_min === p.min && data.budget_max === p.max ? 'selected' : ''}`}
                      onClick={() => setData((d) => ({ ...d, budget_min: p.min, budget_max: p.max }))}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="wizard-budget-grid">
                <div className="field">
                  <label>Minimum (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={data.budget_min}
                    onChange={update('budget_min')}
                  />
                </div>
                <div className="field">
                  <label>Maximum (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={data.budget_max}
                    onChange={update('budget_max')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Attachments */}
          {step === 5 && (
            <div>
              <h2 style={{ fontSize: 26, marginBottom: 8 }}>Attach reference materials</h2>
              <p className="muted" style={{ marginBottom: 20, fontSize: 15 }}>
                Optional — attach rubrics, assignment prompts, lecture slides, or draft papers.
              </p>

              <label
                style={{
                  display: 'block',
                  border: '2px dashed var(--border-strong)',
                  borderRadius: 'var(--r-lg)',
                  padding: '36px 18px',
                  textAlign: 'center',
                  background: 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition)'
                }}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileAdd}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                />
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <IconUploadCloud size={26} color="var(--blue)" />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                  Click to browse or drag files here
                </div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                  PDF, DOCX, PPTX, XLSX, TXT up to 25MB
                </div>
              </label>

              {files.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 8 }}>
                    ATTACHED FILES ({files.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {files.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: 'var(--surface)',
                          borderRadius: 'var(--r-sm)',
                          border: '1px solid var(--border)',
                          fontSize: 14,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                          <IconPaperclip size={16} color="var(--blue)" />
                          <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {f.name}
                          </span>
                          <span className="muted" style={{ fontSize: 12 }}>({f.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          style={{ color: 'var(--error)', fontSize: 16, padding: '2px 6px' }}
                          title="Remove file"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Review */}
          {step === 6 && (
            <div>
              <h2 style={{ fontSize: 26, marginBottom: 8 }}>Review your request</h2>
              <p className="muted" style={{ marginBottom: 20, fontSize: 15 }}>
                Double check your brief before publishing to the board.
              </p>

              <div className="card" style={{ border: '1.5px solid var(--border-strong)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="badge">{data.category || 'Other'}</span>
                  <span className="badge badge-neutral">{data.academic_level}</span>
                </div>

                <h3 style={{ fontSize: 19, lineHeight: 1.3, marginBottom: 10 }}>
                  {data.title || 'Untitled Request'}
                </h3>

                <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.6, marginBottom: 16 }}>
                  {data.description || 'No description added.'}
                </p>

                <div className="tag-row" style={{ marginBottom: 16 }}>
                  <span className="tag">Subject: {data.subject || 'General'}</span>
                  <span className="tag">Files: {files.length} attached</span>
                </div>

                <div className="wizard-review-summary">
                  <div>
                    <span className="muted">Budget: </span>
                    <strong>₹{Number(data.budget_min).toLocaleString('en-IN')} – ₹{Number(data.budget_max).toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="muted">Deadline: </span>
                    <strong>{data.deadline}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={step === 1}
              onClick={prevStep}
            >
              ← Back
            </button>

            {step < 6 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-accent btn-lg"
                onClick={handleSubmit}
                disabled={submitting}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <IconSend size={18} color="#fff" />
                {submitting ? 'Publishing Request…' : 'Publish Request'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
