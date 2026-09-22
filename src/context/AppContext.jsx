import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  ensureProfile, fetchMyRequests, fetchOpenRequests, fetchAssignedRequests, getProfile, getSession,
  insertRequest, claimRequestInDB, submitDeliverableInDB, approveDeliverableInDB, requestRevisionInDB,
  onAuthChange, profileFromUser, signInUser, signOutUser, signUpUser, supabase,
} from '../lib/supabaseClient';

const AppContext = createContext(null);

const seedRequests = [
  {
    id: 'r1',
    title: 'Need help structuring a Marketing Research project',
    category: 'Research Support',
    subject: 'Marketing',
    academic_level: 'Undergraduate',
    budget_min: 800,
    budget_max: 1500,
    deadline: '3 days',
    status: 'open',
    description: 'Need guidance developing research methodology, interview question guides, and synthesizing 10+ academic sources on digital consumer behavior.',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'r2',
    title: 'Proofread a 12-page sociology literature review',
    category: 'Proofreading',
    subject: 'Sociology',
    academic_level: 'Postgraduate',
    budget_min: 600,
    budget_max: 1000,
    deadline: '5 days',
    status: 'in_progress',
    expert_id: 'demo_expert_1',
    expert_name: 'Dr. Sarah Jenkins',
    description: 'Looking for a specialist to review academic clarity, flow, and check APA 7th edition referencing for a graduate sociology review.',
    created_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: 'r3',
    title: 'Guidance formatting citations for a business report',
    category: 'Formatting',
    subject: 'Business',
    academic_level: 'Undergraduate',
    budget_min: 400,
    budget_max: 700,
    deadline: '2 days',
    status: 'submitted',
    expert_id: 'demo_expert_1',
    expert_name: 'Dr. Sarah Jenkins',
    submission_notes: 'Completed comprehensive Harvard-style citation reformatting across all 24 bibliography entries, validated all DOI links, updated in-text parenthetical citations, and formatted tabular financial exhibits.',
    submission_files: [
      { name: 'Business_Report_Harvard_Formatted.docx', size: '1.42 MB' },
      { name: 'Citation_Reference_Audit.pdf', size: '0.68 MB' },
    ],
    submitted_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    description: 'Need assistance fixing Harvard style citations, table of contents, figures, and executive summary styling.',
    created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
  {
    id: 'r4',
    title: 'Python Machine Learning thesis methodology tutoring',
    category: 'Tutoring',
    subject: 'Computer Science',
    academic_level: 'Postgraduate',
    budget_min: 2000,
    budget_max: 3500,
    deadline: '1 week',
    status: 'completed',
    expert_id: 'demo_expert_1',
    expert_name: 'Dr. Sarah Jenkins',
    submission_notes: 'Provided comprehensive Jupyter notebook with k-fold cross-validation code, ROC/AUC curve generator, and 3-page explanatory LaTeX writeup.',
    submission_files: [{ name: 'ML_Thesis_Methodology_Guide.zip', size: '4.80 MB' }],
    student_rating: 5,
    student_feedback: 'Outstanding explanation! Dr. Jenkins clarified XGBoost hyperparameter tuning brilliantly.',
    completed_at: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
    description: '1-on-1 tutoring sessions explaining random forest vs XGBoost validation techniques and ROC curve interpretation.',
    created_at: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
  },
  {
    id: 'r5',
    title: 'Presentation slides review for engineering project',
    category: 'Presentation Support',
    subject: 'Engineering',
    academic_level: 'Undergraduate',
    budget_min: 1000,
    budget_max: 1800,
    deadline: '2 days',
    status: 'open',
    description: 'Help condense complex mechanical engineering findings into clear, impactful visual slides and concise speaker notes.',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('wmw_demo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(!!supabase);
  const [requests, setRequests] = useState(seedRequests);
  const [myRequests, setMyRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const toast = useCallback((message) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  // Bootstraps session on load
  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    let cancelled = false;

    getSession().then(async (s) => {
      if (cancelled) return;
      setSession(s);
      if (s?.user) {
        const prof = await getProfile(s.user.id, s.user);
        setProfile(prof || profileFromUser(s.user));
      }
      setAuthLoading(false);
    });

    const unsubscribe = onAuthChange(async (s) => {
      setSession(s);
      if (s?.user) {
        const prof = await ensureProfile(s.user);
        setProfile(prof || profileFromUser(s.user));
      } else {
        const isDemo = localStorage.getItem('wmw_demo_user');
        if (!isDemo) setProfile(null);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // Fetch open public requests
  useEffect(() => {
    fetchOpenRequests().then((rows) => {
      if (rows && rows.length > 0) {
        setRequests(rows);
      }
    });
  }, []);

  // Fetch student's own requests & expert assigned requests
  useEffect(() => {
    if (session?.user) {
      fetchMyRequests(session.user.id).then((rows) => {
        if (rows && rows.length) setMyRequests(rows);
      });
      fetchAssignedRequests(session.user.id).then((rows) => {
        if (rows && rows.length) setAssignedRequests(rows);
      });
    }
  }, [session]);

  const user = profile
    ? {
        ...profile,
        email: profile.email || session?.user?.email || 'user@example.com',
      }
    : null;

  const signup = useCallback(async ({ name, email, whatsapp, role, password }) => {
    const data = await signUpUser({ name, email, whatsapp, role, password });
    if (!data.session) {
      return { needsConfirmation: true };
    }
    setSession(data.session);
    const prof = await ensureProfile(data.user);
    const resolvedProfile = prof || profileFromUser(data.user);
    setProfile(resolvedProfile);
    localStorage.removeItem('wmw_demo_user');
    return { needsConfirmation: false, user: resolvedProfile };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await signInUser({ email, password });
    setSession(data.session);
    const prof = (await getProfile(data.user.id, data.user)) || (await ensureProfile(data.user)) || profileFromUser(data.user);
    setProfile(prof);
    localStorage.removeItem('wmw_demo_user');
    return prof;
  }, []);

  // Demo Login helper
  const loginAsDemo = useCallback((role = 'student') => {
    const demoUser = {
      id: 'demo_' + role + '_' + Date.now(),
      name: role === 'expert' ? 'Dr. Sarah Jenkins' : 'Alex Johnson',
      email: role === 'expert' ? 'expert.demo@writemywords.com' : 'student.demo@writemywords.com',
      whatsapp: '+91 98765 43210',
      role: role,
    };
    setProfile(demoUser);
    localStorage.setItem('wmw_demo_user', JSON.stringify(demoUser));
    
    if (role === 'student') {
      // Alex has 1 open, 1 submitted (ready to review), and 1 completed
      setMyRequests([
        seedRequests[0], // open
        seedRequests[2], // submitted (needs review)
        seedRequests[3], // completed
      ]);
    } else if (role === 'expert') {
      // Dr. Jenkins has 1 in-progress, 1 submitted, and 1 completed
      setAssignedRequests([
        seedRequests[1], // in_progress (can submit work)
        seedRequests[2], // submitted
        seedRequests[3], // completed
      ]);
    }
    return demoUser;
  }, []);

  const logout = useCallback(async () => {
    await signOutUser();
    setSession(null);
    setProfile(null);
    setMyRequests([]);
    setAssignedRequests([]);
    localStorage.removeItem('wmw_demo_user');
  }, []);

  const addRequest = useCallback(async (reqData) => {
    if (!user) throw new Error('You need to be signed in to post a request.');
    
    let savedRow = null;
    if (session?.user && supabase) {
      try {
        savedRow = await insertRequest({ ...reqData, status: 'open' }, session.user.id);
      } catch (e) {
        console.warn('insertRequest note:', e);
      }
    }

    if (!savedRow) {
      savedRow = {
        id: 'req_' + Date.now(),
        ...reqData,
        status: 'open',
        user_id: user.id,
        created_at: new Date().toISOString(),
      };
    }

    setMyRequests((prev) => [savedRow, ...prev]);
    setRequests((prev) => [savedRow, ...prev]);
    return savedRow;
  }, [session, user]);

  // Expert claims an open request
  const claimRequest = useCallback(async (requestId) => {
    if (!user || user.role !== 'expert') {
      throw new Error('Only registered academic experts can claim requests.');
    }
    
    if (session?.user && supabase) {
      await claimRequestInDB(requestId, session.user.id, user.name);
    }

    const updater = (r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'in_progress',
          expert_id: user.id,
          expert_name: user.name,
        };
      }
      return r;
    };

    setRequests((prev) => prev.map(updater));
    setMyRequests((prev) => prev.map(updater));
    
    // Add to expert's assigned list
    const target = requests.find((r) => r.id === requestId) || myRequests.find((r) => r.id === requestId);
    if (target) {
      const updated = {
        ...target,
        status: 'in_progress',
        expert_id: user.id,
        expert_name: user.name,
      };
      setAssignedRequests((prev) => [updated, ...prev.filter((item) => item.id !== requestId)]);
    }
  }, [session, user, requests, myRequests]);

  // Expert submits deliverable work
  const submitWork = useCallback(async (requestId, { notes, files }) => {
    if (!user || user.role !== 'expert') {
      throw new Error('Only the assigned expert can submit deliverables.');
    }

    if (session?.user && supabase) {
      await submitDeliverableInDB(requestId, { notes, files });
    }

    const updater = (r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'submitted',
          submission_notes: notes,
          submission_files: files,
          submitted_at: new Date().toISOString(),
        };
      }
      return r;
    };

    setRequests((prev) => prev.map(updater));
    setMyRequests((prev) => prev.map(updater));
    setAssignedRequests((prev) => prev.map(updater));
  }, [session, user]);

  // Student approves deliverable
  const approveWork = useCallback(async (requestId, { rating, feedback }) => {
    if (!user) throw new Error('You need to be signed in to approve deliverables.');

    if (session?.user && supabase) {
      await approveDeliverableInDB(requestId, { rating, feedback });
    }

    const updater = (r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'completed',
          student_rating: rating,
          student_feedback: feedback,
          completed_at: new Date().toISOString(),
        };
      }
      return r;
    };

    setRequests((prev) => prev.map(updater));
    setMyRequests((prev) => prev.map(updater));
    setAssignedRequests((prev) => prev.map(updater));
  }, [session, user]);

  // Student requests revision
  const requestRevision = useCallback(async (requestId, { revisionNotes }) => {
    if (!user) throw new Error('You need to be signed in to request revisions.');

    if (session?.user && supabase) {
      await requestRevisionInDB(requestId, { revisionNotes });
    }

    const updater = (r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'revision_requested',
          revision_notes: revisionNotes,
        };
      }
      return r;
    };

    setRequests((prev) => prev.map(updater));
    setMyRequests((prev) => prev.map(updater));
    setAssignedRequests((prev) => prev.map(updater));
  }, [session, user]);

  return (
    <AppContext.Provider
      value={{
        user,
        session,
        authLoading,
        requests,
        myRequests,
        assignedRequests,
        addRequest,
        claimRequest,
        submitWork,
        approveWork,
        requestRevision,
        signup,
        login,
        loginAsDemo,
        logout,
        toast,
      }}
    >
      {children}
      <div id="toast-host">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span>ℹ️</span> {t.message}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
