import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { cleanText, isStrongPassword, isValidEmail, isValidWhatsapp } from '../lib/supabaseClient';
import {
  IconEye,
  IconEyeOff,
  IconGraduationCap,
  IconBriefcase,
  IconShield,
} from '../components/Icons.jsx';

export default function Signup() {
  const { signup, toast } = useApp();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const role = params.get('role') === 'expert' ? 'expert' : 'student';

  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function update(field) {
    return (e) => {
      setErrorMessage('');
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };
  }

  function setRole(newRole) {
    if (newRole === 'expert') {
      setParams({ role: 'expert' });
    } else {
      setParams({});
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    if (website) return;
    setErrorMessage('');

    if (!cleanText(form.name)) {
      setErrorMessage('Please enter your name');
      toast('Please enter your name');
      return;
    }
    if (!isValidEmail(form.email)) {
      setErrorMessage('Please enter a valid email address');
      toast('Please enter a valid email address');
      return;
    }
    if (!isValidWhatsapp(form.whatsapp)) {
      setErrorMessage('Please enter a valid WhatsApp number including country code (e.g. +91 98765 43210)');
      toast('Please enter a valid WhatsApp number with country code');
      return;
    }
    if (!isStrongPassword(form.password)) {
      setErrorMessage('Password must be at least 8 characters and contain letters and numbers');
      toast('Password must be 8+ characters with letters & numbers');
      return;
    }

    setSubmitting(true);
    try {
      const result = await signup({
        name: cleanText(form.name, 100),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
        role,
        password: form.password,
      });

      if (result.needsConfirmation) {
        toast('Confirmation email sent! Please check your inbox, then log in.');
        navigate('/login');
      } else {
        toast(role === 'expert' ? 'Expert account created! Welcome.' : `Account created! Welcome, ${form.name}`);
        navigate(role === 'expert' ? '/expert-dashboard' : '/dashboard/requests/new');
      }
    } catch (err) {
      console.error('Signup error:', err);
      const msg = err.message || '';
      if (msg.includes('already registered')) {
        setErrorMessage('An account with this email already exists. Try logging in instead.');
        toast('Email already registered');
      } else {
        setErrorMessage(msg || 'Could not create account. Please try again.');
        toast(msg || 'Signup failed');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {/* Role Switcher Tabs */}
        <div className="role-switcher">
          <button
            type="button"
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => setRole('student')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <IconGraduationCap size={16} /> I'm a Student
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'expert' ? 'active' : ''}`}
            onClick={() => setRole('expert')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <IconBriefcase size={16} /> I'm an Expert
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, marginBottom: 6 }}>
            {role === 'expert' ? 'Become an Academic Expert' : 'Create Your Student Account'}
          </h1>
          <p className="muted" style={{ fontSize: 14 }}>
            {role === 'expert'
              ? 'Connect with university students and get paid for academic guidance.'
              : 'Post your requirements and match with verified academic specialists.'}
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--r-sm)',
              background: 'var(--error-subtle)',
              border: '1px solid #FECACA',
              color: 'var(--error)',
              fontSize: 13.5,
              lineHeight: 1.45,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <IconShield size={16} color="var(--error)" /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Honeypot field for bot protection */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="signup-name">{role === 'expert' ? 'Full name' : 'Your name'}</label>
            <input
              id="signup-name"
              value={form.name}
              onChange={update('name')}
              placeholder={role === 'expert' ? 'Dr. Alex Morgan' : 'Alex Johnson'}
              autoFocus
              maxLength={100}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@university.edu"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="signup-whatsapp">WhatsApp number</label>
            <input
              id="signup-whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={update('whatsapp')}
              placeholder="+91 98765 43210"
              required
            />
            <div className="field-hint">Include country code (e.g. +91, +1, +44) for notifications.</div>
          </div>

          <div className="field">
            <label htmlFor="signup-password">Create password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.password}
                onChange={update('password')}
                placeholder="At least 8 characters (letters & numbers)"
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ink-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff size={18} color="var(--ink-muted)" /> : <IconEye size={18} color="var(--ink-muted)" />}
              </button>
            </div>
            <div className="field-hint">Must contain at least 6 characters.</div>
          </div>

          <button
            className="btn btn-primary btn-block btn-lg"
            type="submit"
            disabled={submitting}
            style={{ marginTop: 10 }}
          >
            {submitting
              ? 'Setting up account…'
              : role === 'expert'
              ? 'Join as Academic Expert →'
              : 'Create Free Account & Post →'}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p className="muted" style={{ fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600 }}>
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
