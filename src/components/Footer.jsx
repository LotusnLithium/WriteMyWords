import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col" style={{ paddingRight: 20 }}>
            <div style={{ marginBottom: 14 }}>
              <span className="logo-text" style={{ fontSize: 20 }}>WriteMyWords</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.6, maxWidth: 360 }}>
              The secure, student-first platform connecting university scholars with verified academic specialists for guidance, tutoring, proofreading, and research assistance.
            </p>
          </div>

          <div className="footer-col">
            <h4>For Students</h4>
            <ul>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/for-students">Student Benefits</Link></li>
              <li><Link to="/signup">Post a Request</Link></li>
              <li><Link to="/login">Student Sign In</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>For Experts</h4>
            <ul>
              <li><Link to="/for-experts">Become an Expert</Link></li>
              <li><Link to="/requests">Browse Request Board</Link></li>
              <li><Link to="/signup?role=expert">Expert Registration</Link></li>
              <li><Link to="/login">Expert Sign In</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support Disciplines</h4>
            <ul>
              <li><Link to="/requests?category=Assignment+Guidance">Assignment Guidance</Link></li>
              <li><Link to="/requests?category=Research+Support">Research & Citations</Link></li>
              <li><Link to="/requests?category=Proofreading">Academic Proofreading</Link></li>
              <li><Link to="/requests?category=Tutoring">1-on-1 Tutoring</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} WriteMyWords. All rights reserved. Built for academic integrity & excellence.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>🔒 SSL Encrypted & Confidential</span>
            <span>⏱️ 24/7 Academic Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
