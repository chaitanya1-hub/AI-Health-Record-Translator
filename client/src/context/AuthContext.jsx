import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedDemoUser = localStorage.getItem('ai_health_user');
    if (savedDemoUser) {
      try { return JSON.parse(savedDemoUser); } catch (e) {}
    }
    return {
      id: 'user-demo-123',
      email: 'alex.patient@example.com',
      user_metadata: { full_name: 'Alex Morgan' },
      isDemo: true
    };
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Fetch initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
        }
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
      } catch (err) {
        if (err.message === 'Failed to fetch' || err.status === 0) {
          console.warn('Supabase fetch failed. Falling back to Instant Demo Mode.');
        } else {
          throw err;
        }
      }
    }
    const demoUser = {
      id: 'user-demo-123',
      email: email || 'alex.patient@example.com',
      user_metadata: { full_name: email ? email.split('@')[0] : 'Alex Morgan' },
      isDemo: true
    };
    setUser(demoUser);
    localStorage.setItem('ai_health_user', JSON.stringify(demoUser));
    return { user: demoUser };
  };

  const signUpWithEmail = async (email, password, fullName) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;
      return data;
    }
    const demoUser = {
      id: 'user-demo-' + Date.now(),
      email,
      user_metadata: { full_name: fullName || 'Patient' },
      isDemo: true
    };
    setUser(demoUser);
    localStorage.setItem('ai_health_user', JSON.stringify(demoUser));
    return { user: demoUser };
  };

  const loginWithProvider = async (provider) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: provider, // 'google'
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
        return data;
      } catch (err) {
        if (err.message === 'Failed to fetch' || err.status === 0) {
          console.warn(`Supabase OAuth fetch failed for ${provider}. Falling back to Instant Demo Mode.`);
        } else {
          throw err;
        }
      }
    }
    const demoUser = {
      id: `user-${provider}-` + Date.now(),
      email: `alex.${provider}@example.com`,
      user_metadata: { full_name: `Alex Morgan (${provider.charAt(0).toUpperCase() + provider.slice(1)})` },
      isDemo: true
    };
    setUser(demoUser);
    localStorage.setItem('ai_health_user', JSON.stringify(demoUser));
    return { user: demoUser };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('ai_health_user');
  };

  const value = {
    user,
    loading,
    isSupabaseConfigured,
    loginWithEmail,
    signUpWithEmail,
    loginWithProvider,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
