import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, referralCode?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // If Supabase is not configured, set loading to false immediately
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: SupabaseUser) => {
    try {
      setLoading(true);
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        throw error;
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          phone: profile.phone,
          referralCode: profile.referral_code,
          referredBy: profile.referred_by,
          createdAt: profile.created_at,
        };
        setUser(userData);
        setIsAdmin(profile.email === 'admin@cashflowa.com');
      } else {
        console.error('No profile found for user');
        throw new Error('Profil utilisateur non trouvé');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase n\'est pas configuré. Veuillez connecter Supabase.');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, referralCode?: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase n\'est pas configuré. Veuillez connecter Supabase.');
    }

    setLoading(true);
    try {
      // First, sign up the user with email confirmation disabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
        }
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Échec de la création du compte');
      }

      // Create user profile
      const newReferralCode = generateReferralCode();
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          referral_code: newReferralCode,
          referred_by: referralCode || null,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Erreur lors de la création du profil');
      }

      // Create initial balance record
      const { error: balanceError } = await supabase
        .from('balances')
        .insert({
          user_id: authData.user.id,
          balance: 0,
          earnings: 0,
          referral_count: 0,
        });

      if (balanceError) {
        console.error('Balance creation error:', balanceError);
        throw new Error('Erreur lors de la création du solde');
      }

      // If referred by someone, update their referral count
      if (referralCode) {
        try {
          const { data: referrer } = await supabase
            .from('users')
            .select('id')
            .eq('referral_code', referralCode)
            .single();

          if (referrer) {
            // Update referrer's referral count
            const { data: referrerBalance } = await supabase
              .from('balances')
              .select('referral_count')
              .eq('user_id', referrer.id)
              .single();

            if (referrerBalance) {
              await supabase
                .from('balances')
                .update({ referral_count: referrerBalance.referral_count + 1 })
                .eq('user_id', referrer.id);
            }
          }
        } catch (referralError) {
          console.error('Referral update error:', referralError);
          // Don't throw here, as the main registration was successful
        }
      }

      // Load the user profile to set the user state
      await loadUserProfile(authData.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}