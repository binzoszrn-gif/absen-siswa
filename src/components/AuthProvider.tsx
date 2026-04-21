import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, UserProfile } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(uid: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      
      if (error) {
        // If profile doesn't exist, create a default one
        if (error.code === 'PGRST116') {
          const { data: newUser } = await supabase.auth.getUser();
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert({
              id: uid,
              full_name: newUser.user?.user_metadata?.full_name || 'New User',
              role: 'admin' // Make first user admin as fallback
            })
            .select()
            .single();
          
          if (createError) throw createError;
          setUser(newProfile);
        } else {
          throw error;
        }
      } else {
        setUser(data);
      }
    } catch (err) {
      console.error('Error fetching/creating profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
