import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  ensureProfile, fetchMyRequests, fetchOpenRequests, getProfile, getSession,
  insertRequest, onAuthChange, profileFromUser, signInUser, signOutUser, signUpUser, supabase,
} from '../lib/supabaseClient';

const AppContext = createContext(null);

const seedRequests = [
  { id: 'r1', title: 'Need help structuring a Marketing Research project', category: 'Research Support', subject: 'Marketing', academic_level: 'Undergraduate', budget_min: 800, budget_max: 1500, deadline: '3 days', description: 'Need guidance developing research methodology, interview question guides, and synthesizing 10+ academic sources on digital consumer behavior.' },
  { id: 'r2', title: 'Proofread a 12-page sociology literature review', category: 'Proofreading', subject: 'Sociology', academic_level: 'Postgraduate', budget_min: 600, budget_max: 1000, deadline: '5 days', description: 'Looking for a specialist to review academic clarity, flow, and check APA 7th edition referencing for a graduate sociology review.' },
  { id: 'r3', title: 'Guidance formatting citations for a business report', category: 'Formatting', subject: 'Business', academic_level: 'Undergraduate', budget_min: 400, budget_max: 700, deadline: '2 days', description: 'Need assistance fixing Harvard style citations, table of contents, figures, and executive summary styling.' },
  { id: 'r4', title: 'Python Machine Learning thesis methodology tutoring', category: 'Tutoring', subject: 'Computer Science', academic_level: 'Postgraduate', budget_min: 2000, budget_max: 3500, deadline: '1 week', description: '1-on-1 tutoring sessions explaining random forest vs XGBoost validation techniques and ROC curve interpretation.' },
  { id: 'r5', title: 'Presentation slides review for engineering project', category: 'Presentation Support', subject: 'Engineering', academic_level: 'Undergraduate', budget_min: 1000, budget_max: 1800, deadline: '2 days', description: 'Help condense complex mechanical engineering findings into clear, impactful visual slides and concise speaker notes.' },
];

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(() => {
    // Check if demo user is stored in localStorage
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
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const toast = useCallback((message) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  // Bootstraps the session on load
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
        // Only clear if not in demo mode
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
        // Merge or replace seed with Supabase rows
        setRequests(rows);
      }
    });
  }, []);

  // Fetch student's own requests
  useEffect(() => {
    if (session?.user) {
      fetchMyRequests(session.user.id).then((rows) => {
        if (rows && rows.length) setMyRequests(rows);
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
      setMyRequests(seedRequests.slice(0, 2));
    }
    return demoUser;
  }, []);

  const logout = useCallback(async () => {
    await signOutUser();
    setSession(null);
    setProfile(null);
    setMyRequests([]);
    localStorage.removeItem('wmw_demo_user');
  }, []);

  const addRequest = useCallback(async (reqData) => {
    if (!user) throw new Error('You need to be signed in to post a request.');
    
    let savedRow = null;
    if (session?.user && supabase) {
      try {
        savedRow = await insertRequest(reqData, session.user.id);
      } catch (e) {
        console.warn('insertRequest note:', e);
      }
    }

    if (!savedRow) {
      savedRow = {
        id: 'req_' + Date.now(),
        ...reqData,
        user_id: user.id,
        created_at: new Date().toISOString(),
      };
    }

    setMyRequests((prev) => [savedRow, ...prev]);
    setRequests((prev) => [savedRow, ...prev]);
    return savedRow;
  }, [session, user]);

  return (
    <AppContext.Provider
      value={{
        user,
        session,
        authLoading,
        requests,
        myRequests,
        addRequest,
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
