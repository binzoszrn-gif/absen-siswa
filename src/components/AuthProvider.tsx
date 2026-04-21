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
    setLoading(true);
    try {
      console.log('Fetching profile for UID:', uid);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      
      if (error) {
        console.warn('Profile fetch error:', error.message);
        // If profile doesn't exist (PGRST116), try to create one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, attempting to create default profile...');
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: uid,
              full_name: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'New User',
              role: 'admin' // Fallback to admin for setup
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Failed to create profile:', createError);
            throw createError;
          }
          console.log('Default profile created successfully');
          setUser(newProfile);
        } else {
          throw error;
        }
      } else {
        console.log('Profile found:', data.full_name, 'Role:', data.role);
        setUser(data);
      }
    } catch (err: any) {
      console.error('Auth Exception:', err.message);
      // Optional: alert(`Gagal memuat profil: ${err.message}. Pastikan SQL Schema sudah dijalankan.`);
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
