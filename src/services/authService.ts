import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserRole } from '../types';

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export const authService = {
  isConfigured: isSupabaseConfigured,

  /**
   * Sign in with Email and Password
   */
  async signIn({ email, password }: SignInParams) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured yet. Running in Demo mode.') };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  /**
   * Sign up a new user and assign profile role
   */
  async signUp({ email, password, fullName, role, phone }: SignUpParams) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured yet. Running in Demo mode.') };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          phone: phone || '',
        },
      },
    });
    return { data, error };
  },

  /**
   * Sign out current user
   */
  async signOut() {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }
    return await supabase.auth.signOut();
  },

  /**
   * Get current authenticated user session
   */
  async getSession() {
    if (!isSupabaseConfigured()) {
      return { session: null, error: null };
    }
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  /**
   * Get user profile details by ID
   */
  async getProfile(userId: string) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  /**
   * Listen for Auth state changes
   */
  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};
