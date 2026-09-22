import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { supabase, ensureProfile, getProfile } from '../lib/supabaseClient';
import { IconCheckCircle, IconClock } from '../components/Icons.jsx';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { toast } = useApp();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    // Immediately sanitize URL and wipe hash/token parameters from browser address bar
    // to prevent tokens from leaking into browser history, extensions, or referrer headers
    if (window.location.hash || window.location.search) {
      try {
        window.history.replaceState(null, document.title, window.location.pathname);
      } catch (e) {
        // Ignore in environments where replaceState is restricted
      }
    }

    async function handleAuthVerification() {
      if (!supabase) {
        setStatus('error');
        setMessage('Supabase client is not configured.');
        return;
      }

      try {
        // 1. Check if token_hash is in query params (PKCE / OTP flow)
        const token_hash = params.get('token_hash');
        const type = params.get('type') || 'signup';

        if (token_hash) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          });

          if (error) throw error;

          if (data?.user) {
            const profile = await ensureProfile(data.user);
            setStatus('success');
            setMessage('Email confirmed successfully! Taking you to your dashboard...');
            toast('🎉 Email verified! Welcome to WriteMyWords.');

            setTimeout(() => {
              if (profile?.role === 'expert') {
                navigate('/expert-dashboard', { replace: true });
              } else {
                navigate('/dashboard', { replace: true });
              }
            }, 1000);
            return;
          }
        }

        // 2. Otherwise check if access_token exists in session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (sessionData?.session?.user) {
          const profile = await ensureProfile(sessionData.session.user);
          setStatus('success');
          setMessage('Account verified! Taking you to your workspace...');
          toast('Email verified successfully!');

          setTimeout(() => {
            if (profile?.role === 'expert') {
              navigate('/expert-dashboard', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          }, 1000);
          return;
        }

        // If no session found yet, wait for onAuthStateChange
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const profile = await ensureProfile(session.user);
            setStatus('success');
            setMessage('Verified! Welcome to WriteMyWords.');
            toast('Email verified successfully!');

            setTimeout(() => {
              if (profile?.role === 'expert') {
                navigate('/expert-dashboard', { replace: true });
              } else {
                navigate('/dashboard', { replace: true });
              }
            }, 800);
          }
        });

        // Timeout fallback after 5s
        const timer = setTimeout(() => {
          if (status === 'verifying') {
            setStatus('success');
            setMessage('Verification processed. Redirecting to login...');
            navigate('/login', { replace: true });
          }
        }, 4000);

        return () => {
          authListener?.subscription?.unsubscribe();
          clearTimeout(timer);
        };
      } catch (err) {
        console.error('Email verification error:', err);
        setStatus('error');
        setMessage(err.message || 'Could not verify confirmation link. It may have expired.');
        toast('Verification link invalid or expired.');
      }
    }

    handleAuthVerification();
  }, [params, navigate, toast]);

  return (
    <div className="auth-shell" style={{ marginTop: 80 }}>
      <div className="auth-card" style={{ textAlign: 'center', padding: '48px 28px' }}>
        {status === 'verifying' && (
          <div>
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <IconClock size={28} color="var(--blue)" />
            </div>
            <h2 style={{ fontSize: 24, marginBottom: 10 }}>Confirming Your Email</h2>
            <p className="muted" style={{ fontSize: 15, maxWidth: 360, margin: '0 auto' }}>
              {message}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <IconCheckCircle size={32} color="var(--success)" />
            </div>
            <h2 style={{ fontSize: 24, marginBottom: 10 }}>Email Verified!</h2>
            <p className="muted" style={{ fontSize: 15, maxWidth: 360, margin: '0 auto' }}>
              {message}
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--error-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <span style={{ fontSize: 24, color: 'var(--error)' }}>⚠️</span>
            </div>
            <h2 style={{ fontSize: 24, marginBottom: 10 }}>Verification Issue</h2>
            <p className="muted" style={{ fontSize: 15, maxWidth: 360, margin: '0 auto 24px' }}>
              {message}
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
