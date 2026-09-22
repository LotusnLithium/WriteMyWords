import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import {
  IconHome,
  IconSearch,
  IconZap,
  IconGraduationCap,
  IconBriefcase,
  IconTrendingUp,
} from './Icons.jsx';

export default function Nav() {
  const { user, logout, toast } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  async function handleLogout() {
    await logout();
    toast('Logged out successfully');
    setMenuOpen(false);
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="nav">
        <div className="wrap nav-row">
          <Link to="/" className="logo" aria-label="WriteMyWords Home">
            <span className="logo-text">WriteMyWords</span>
          </Link>

          <nav className="nav-links" aria-label="Primary navigation">
            <Link to="/how-it-works" className={isActive('/how-it-works') ? 'active' : ''}>
              How It Works
            </Link>
            <Link to="/requests" className={isActive('/requests') ? 'active' : ''}>
              Find Requests
            </Link>
            <Link to="/for-students" className={isActive('/for-students') ? 'active' : ''}>
              For Students
            </Link>
            <Link to="/for-experts" className={isActive('/for-experts') ? 'active' : ''}>
              For Experts
            </Link>
          </nav>

          <div className="nav-right">
            {user ? (
              <>
                <Link
                  to={user.role === 'expert' ? '/expert-dashboard' : '/dashboard'}
                  className="btn btn-ghost btn-sm"
                  style={{ display: 'none', '@media (min-width: 520px)': { display: 'inline-flex' } }}
                >
                  Dashboard
                </Link>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleLogout}
                  style={{ display: 'none', '@media (min-width: 520px)': { display: 'inline-flex' } }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" style={{ display: 'none', '@media (min-width: 520px)': { display: 'inline-flex' } }}>
                  Log In
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm" style={{ display: 'none', '@media (min-width: 520px)': { display: 'inline-flex' } }}>
                  Post Request
                </Link>
              </>
            )}

            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`mobile-drawer-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div className="mobile-drawer-header">
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <span className="logo-text" style={{ fontSize: 20 }}>WriteMyWords</span>
          </Link>
          <button className="modal-close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>

        {user && (
          <div style={{ padding: '16px 14px', background: 'var(--surface-alt)', borderRadius: 'var(--r-sm)', marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{user.name || 'Account'}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-muted)', textTransform: 'capitalize' }}>
              Role: {user.role || 'Student'}
            </div>
          </div>
        )}

        <nav className="mobile-drawer-links">
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            <IconHome size={18} color="var(--blue)" /> Home
          </Link>
          <Link to="/requests" className={isActive('/requests') ? 'active' : ''}>
            <IconSearch size={18} color="var(--blue)" /> Find Requests
          </Link>
          <Link to="/how-it-works" className={isActive('/how-it-works') ? 'active' : ''}>
            <IconZap size={18} color="var(--blue)" /> How It Works
          </Link>
          <Link to="/for-students" className={isActive('/for-students') ? 'active' : ''}>
            <IconGraduationCap size={18} color="var(--blue)" /> For Students
          </Link>
          <Link to="/for-experts" className={isActive('/for-experts') ? 'active' : ''}>
            <IconBriefcase size={18} color="var(--blue)" /> For Experts
          </Link>
          {user && (
            <Link
              to={user.role === 'expert' ? '/expert-dashboard' : '/dashboard'}
              className={isActive('/dashboard') || isActive('/expert-dashboard') ? 'active' : ''}
            >
              <IconTrendingUp size={18} color="var(--blue)" /> Dashboard
            </Link>
          )}
        </nav>

        <div className="mobile-drawer-footer">
          {user ? (
            <>
              <Link
                to={user.role === 'expert' ? '/expert-dashboard' : '/dashboard/requests/new'}
                className="btn btn-primary btn-block"
              >
                {user.role === 'expert' ? 'View Matches' : '+ Post a Request'}
              </Link>
              <button className="btn btn-ghost btn-block" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary btn-block">
                Post a Request
              </Link>
              <Link to="/login" className="btn btn-ghost btn-block">
                Log In
              </Link>
              <Link to="/signup?role=expert" className="btn btn-subtle btn-block" style={{ fontSize: 13.5 }}>
                Become an Academic Expert →
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
