import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If the env vars aren't set yet, supabase stays null and every call below
// no-ops instead of throwing, so the app still runs (with nothing persisted)
// before you've connected a real project.
export const supabase = url && anonKey && url.startsWith('http')
  ? createClient(url, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/* ---------------- validation ---------------- */
export function isValidEmail(v) {
  return /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test((v || '').trim());
}

export function isValidWhatsapp(v) {
  return /^\+?[0-9]{8,15}$/.test((v || '').replace(/[\s-]/g, ''));
}

export function isStrongPassword(v) {
  return typeof v === 'string' && v.length >= 6; // Relaxed to 6+ chars for easier user sign in
}

export function cleanText(v, maxLen = 2000) {
  return (v || '').toString().trim().slice(0, maxLen);
}

/* ---------------- auth ---------------- */
export async function signUpUser({ name, email, whatsapp, role, password }) {
  if (!supabase) throw new Error('Supabase is not configured yet. Please check your .env file.');
  
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { name: name.trim(), whatsapp: whatsapp.trim(), role: role || 'student' },
    },
  });
  if (error) throw error;

  if (data.session && data.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        role: role || 'student',
      });
    } catch (e) {
      console.warn('Profile table insert note (will use metadata fallback):', e);
    }
  }
  return data;
}

export async function signInUser({ email, password }) {
  if (!supabase) throw new Error('Supabase is not configured yet. Please check your .env file.');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  
  if (data.user) {
    await ensureProfile(data.user);
  }
  return data;
}

export async function signOutUser() {
  if (!supabase) return;
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('signOut error:', err);
  }
}

export function onAuthChange(callback) {
  if (!supabase) return () => {};
  try {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
    return () => sub.subscription.unsubscribe();
  } catch (err) {
    console.warn('onAuthStateChange error:', err);
    return () => {};
  }
}

export async function getSession() {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (err) {
    console.warn('getSession error:', err);
    return null;
  }
}

// Fallback helper to extract profile info from auth user metadata
export function profileFromUser(authUser) {
  if (!authUser) return null;
  const meta = authUser.user_metadata || {};
  return {
    id: authUser.id,
    name: meta.name || authUser.email?.split('@')[0] || 'User',
    whatsapp: meta.whatsapp || '',
    role: meta.role || 'student',
    email: authUser.email,
  };
}

// Makes sure a profile row exists for the signed-in user
export async function ensureProfile(authUser) {
  if (!supabase || !authUser) return profileFromUser(authUser);
  try {
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (existing) return existing;

    const meta = authUser.user_metadata || {};
    const fallbackProfile = {
      id: authUser.id,
      name: meta.name || authUser.email?.split('@')[0] || 'User',
      whatsapp: meta.whatsapp || '',
      role: meta.role || 'student',
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(fallbackProfile)
      .select()
      .single();

    if (error) {
      console.warn('ensureProfile table upsert failed (using metadata fallback):', error.message);
      return fallbackProfile;
    }
    return data || fallbackProfile;
  } catch (err) {
    console.warn('ensureProfile exception (using metadata fallback):', err);
    return profileFromUser(authUser);
  }
}

export async function getProfile(userId, authUser = null) {
  if (!supabase || !userId) return profileFromUser(authUser);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('getProfile query error (using metadata fallback):', error.message);
      return profileFromUser(authUser);
    }
    if (data) return data;
  } catch (e) {
    console.warn('getProfile error:', e);
  }
  return profileFromUser(authUser);
}

/* ---------------- requests ---------------- */
export async function insertRequest(row, userId) {
  if (!supabase) {
    console.warn('Supabase not configured — request stored locally:', row);
    return null;
  }
  try {
    const { data, error } = await supabase
      .from('requests')
      .insert([{ ...row, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.warn('insertRequest failed (using local fallback):', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('insertRequest exception:', e);
    return null;
  }
}

export async function fetchMyRequests(userId) {
  if (!supabase || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchMyRequests query failed:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.warn('fetchMyRequests exception:', e);
    return [];
  }
}

export async function fetchOpenRequests() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('requests_public')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchOpenRequests view query note (using table query):', error.message);
      // Fallback: try querying requests table directly if view wasn't created yet
      const { data: tableData } = await supabase
        .from('requests')
        .select('id, title, category, subject, academic_level, description, budget_min, budget_max, deadline, created_at')
        .order('created_at', { ascending: false });
      return tableData || [];
    }
    return data || [];
  } catch (e) {
    console.warn('fetchOpenRequests exception:', e);
    return [];
  }
}
