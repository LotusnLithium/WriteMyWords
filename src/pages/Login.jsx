import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { isValidEmail } from '../lib/supabaseClient';
import {
  IconEye,
  IconEyeOff,
  IconGraduationCap,
  IconBriefcase,
  IconShield,
} from '../components/Icons.jsx';

export default function Login() {
  const { login, loginAsDemo, toast } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const update = (field) => (e) => {
    setErrorMessage('');
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setErrorMessage('');

    if (!isValidEmail(form.email)) {
      setErrorMessage('Please enter a valid email address.');
      toast('Please enter a valid email address');
      return;
    }
    if (!form.password) {
      setErrorMessage('Please enter your password.');
      toast('Please enter your password');
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await login(form);
      toast('Welcome back! Successfully logged in.');
      if (loggedUser?.role === 'expert') {
        navigate('/expert-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failure:', err);
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials')) {
        setErrorMessage('Invalid email or password. Please verify your details or create a new account.');
        toast('Invalid email or password');
      } else if (msg.includes('Email not confirmed')) {
        setErrorMessage('Your email address has not been confirmed yet. Please check your inbox for the verification link.');
        toast('Email not confirmed — check your inbox');
      } else if (msg.includes('Supabase is not configured')) {
        setErrorMessage('Supabase is not configured in .env. You can use Demo Login below to explore.');
        toast('Supabase not configured — try Demo Login');
      } else {
        setErrorMessage(msg || 'Could not log in. Please check your credentials.');
        toast(msg || 'Login failed');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleDemoLogin(role) {
    const demoUser = loginAsDemo(role);
    toast(`Logged in as Demo ${role === 'expert' ? 'Expert' : 'Student'}!`);
    if (demoUser.role === 'expert') {
      navigate('/expert-dashboard');
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Welcome back</h1>
          <p className="muted" style={{ fontSize: 14.5 }}>
            Log in to manage your academic requests and offers.
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
          <div className="field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update('email')}
              placeholder="name@university.edu"
              autoFocus
              required
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">
              <span>Password</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
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
          </div>

          <button
            className="btn btn-primary btn-block btn-lg"
            type="submit"
            disabled={submitting}
            style={{ marginTop: 8 }}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Logins for instant testing */}
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 12, letterSpacing: '0.04em' }}>
            QUICK 1-CLICK TEST DEMO
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleDemoLogin('student')}
              title="Test Student Dashboard & Post Request"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <IconGraduationCap size={16} color="var(--ink)" /> Demo Student
            </button>
            <button
              type="button"
              className="btn btn-subtle btn-sm"
              onClick={() => handleDemoLogin('expert')}
              title="Test Expert Dashboard & Open Requests"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <IconBriefcase size={16} color="var(--blue)" /> Demo Expert
            </button>
          </div>
        </div>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <p className="muted" style={{ fontSize: 14 }}>
            Don't have an account yet?{' '}
            <Link to="/signup" style={{ color: 'var(--blue)', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
