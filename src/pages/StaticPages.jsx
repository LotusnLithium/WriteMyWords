import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconGraduationCap,
  IconBriefcase,
  IconShield,
  IconClock,
  IconCurrency,
  IconUser,
  IconGlobe,
  IconAward,
  IconTrendingUp,
  IconMessageSquare,
} from '../components/Icons.jsx';

export function HowItWorks() {
  const studentSteps = [
    { num: '1', title: 'Post Your Brief', desc: 'Share your assignment prompt, target academic level, rubric criteria, and timeline.' },
    { num: '2', title: 'Review Verified Experts', desc: 'Browse matched specialists in your academic discipline without public spam.' },
    { num: '3', title: 'Collaborate 1-on-1', desc: 'Share draft files, ask questions, and receive step-by-step guidance.' },
    { num: '4', title: 'Approve & Finalize', desc: 'Review completed work against your rubric before releasing payment.' },
  ];

  const expertSteps = [
    { num: '1', title: 'Create Expert Profile', desc: 'Specify your academic disciplines, degree qualifications, and areas of expertise.' },
    { num: '2', title: 'Explore Student Briefs', desc: 'Filter requests by subject, budget, academic tier, and turnaround deadline.' },
    { num: '3', title: 'Deliver Support', desc: 'Provide constructive guidance, citation formatting, proofreading, and tutoring.' },
    { num: '4', title: 'Get Paid & Build Trust', desc: 'Receive secure compensation directly and establish a verified academic reputation.' },
  ];

  return (
    <div style={{ paddingBottom: 60 }}>
      <section className="static-page-section">
        <div className="wrap">
          <div className="section-head" style={{ maxWidth: 700 }}>
            <div className="eyebrow">HOW IT WORKS</div>
            <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 44px)', marginTop: 10 }}>
              Two sides, one seamless academic collaboration platform.
            </h1>
            <p className="lede" style={{ marginTop: 14 }}>
              WriteMyWords bridges students who need timely academic assistance with verified subject-matter experts who love teaching and mentoring.
            </p>
          </div>

          {/* Student Workflow */}
          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconGraduationCap size={20} color="var(--blue)" />
              </div>
              <h2 style={{ fontSize: 'clamp(19px, 3.5vw, 24px)' }}>For Students: In 4 Simple Steps</h2>
            </div>
            <div className="grid grid-4">
              {studentSteps.map((s) => (
                <div className="card" key={s.num} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ width: 30, height: 30, borderRadius: 'var(--r-xs)', background: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                      {s.num}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
                    <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22 }}>
              <Link to="/signup" className="btn btn-primary">
                Post a Request Free →
              </Link>
            </div>
          </div>

          {/* Expert Workflow */}
          <div style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconBriefcase size={20} color="var(--ink)" />
              </div>
              <h2 style={{ fontSize: 'clamp(19px, 3.5vw, 24px)' }}>For Academic Experts: How to Get Started</h2>
            </div>
            <div className="grid grid-4">
              {expertSteps.map((s) => (
                <div className="card" key={s.num} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ width: 30, height: 30, borderRadius: 'var(--r-xs)', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                      {s.num}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
                    <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22 }}>
              <Link to="/signup?role=expert" className="btn btn-accent">
                Apply as Academic Expert →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ForStudents() {
  const benefits = [
    { icon: <IconShield size={24} color="var(--blue)" />, title: '100% Confidential', desc: 'Your personal info is never shared publicly. Experts only see your academic brief.' },
    { icon: <IconClock size={24} color="var(--warning)" />, title: 'Guaranteed Deadlines', desc: 'Set your target delivery date. Experts commit before commencing.' },
    { icon: <IconCurrency size={24} color="var(--success)" />, title: 'Fair, Upfront Budgets', desc: 'Set your own budget range. No hidden platform fees or surprise invoices.' },
    { icon: <IconUser size={24} color="var(--indigo)" />, title: '1-on-1 Collaboration', desc: 'Work directly with your matched expert without layers of bureaucracy.' },
  ];

  return (
    <div style={{ paddingBottom: 60 }}>
      <section className="static-page-section">
        <div className="wrap">
          <div className="section-head" style={{ maxWidth: 680 }}>
            <div className="eyebrow">FOR STUDENTS</div>
            <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 44px)', marginTop: 10 }}>
              Get the academic support you need. Keep your momentum.
            </h1>
            <p className="lede" style={{ marginTop: 14 }}>
              From literature reviews and methodology guidance to citation formatting and presentation prep, connect with experts who understand your discipline.
            </p>
            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-primary btn-lg">
                Post a Request Free
              </Link>
              <Link to="/requests" className="btn btn-ghost btn-lg">
                Browse Sample Requests
              </Link>
            </div>
          </div>

          <div className="grid grid-2" style={{ marginTop: 36 }}>
            {benefits.map((b) => (
              <div className="card" key={b.title}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {b.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{b.title}</h3>
                <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ForExperts() {
  const benefits = [
    { icon: <IconGlobe size={24} color="var(--blue)" />, title: 'Flexible Remote Schedule', desc: 'Work on your own terms. Choose only the requests that fit your background and schedule.' },
    { icon: <IconCurrency size={24} color="var(--success)" />, title: 'Prompt & Secure Compensation', desc: 'Clear budget ranges agreed upon upfront and released directly upon student sign-off.' },
    { icon: <IconAward size={24} color="var(--warning)" />, title: 'Build Academic Reputation', desc: 'Grow your portfolio of successful student mentorships and verified reviews.' },
    { icon: <IconMessageSquare size={24} color="var(--indigo)" />, title: 'Direct Student Connection', desc: 'Communicate directly on assignment briefs, clear rubrics, and deliver impactful mentorship.' },
  ];

  return (
    <div style={{ paddingBottom: 60 }}>
      <section className="static-page-section">
        <div className="wrap">
          <div className="section-head" style={{ maxWidth: 680 }}>
            <div className="eyebrow">FOR ACADEMIC EXPERTS</div>
            <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 44px)', marginTop: 10 }}>
              Turn your academic knowledge into meaningful support and income.
            </h1>
            <p className="lede" style={{ marginTop: 14 }}>
              Join university graduates, researchers, tutors, and subject specialists helping the next generation of university students excel.
            </p>
            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/signup?role=expert" className="btn btn-accent btn-lg">
                Join as Academic Expert
              </Link>
              <Link to="/requests" className="btn btn-ghost btn-lg">
                Explore Active Requests
              </Link>
            </div>
          </div>

          <div className="grid grid-2" style={{ marginTop: 36 }}>
            {benefits.map((b) => (
              <div className="card" key={b.title}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {b.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{b.title}</h3>
                <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
