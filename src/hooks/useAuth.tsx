import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Student, Parent } from '../types';
import { mockStudents, mockParents } from '../data/mockStudents';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService, SignInParams, SignUpParams } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  currentStudent: Student;
  currentParent: Parent | null;
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
  loginAsStudent: (idOrEmail: string) => boolean;
  loginAsParent: (emailOrPhone: string) => boolean;
  loginAsAdmin: (email: string) => boolean;
  signInWithSupabase: (params: SignInParams) => Promise<{ success: boolean; error?: string }>;
  signUpWithSupabase: (params: SignUpParams) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLiveSupabase: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sri_sai_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return {
      id: 'usr-student-001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@srisai.edu',
      role: 'student',
      createdAt: '2024-06-10',
    };
  });

  const [selectedChildId, setSelectedChildId] = useState<string>('SRI-2026-001');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLive = isSupabaseConfigured();

  // Listen to Supabase Auth state if configured
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      if (!isLive) {
        setIsLoading(false);
        return;
      }

      try {
        const { session } = await authService.getSession();
        if (session?.user && mounted) {
          const { data: profile } = await authService.getProfile(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
            role: (profile?.role || session.user.user_metadata?.role || 'student') as UserRole,
            phone: profile?.phone || session.user.phone,
            createdAt: session.user.created_at,
          });
        }
      } catch (err) {
        console.error('Error checking Supabase session:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initSession();

    if (isLive) {
      const { data: authListener } = authService.onAuthStateChange(async (event, session: any) => {
        if (session?.user) {
          const { data: profile } = await authService.getProfile(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
            role: (profile?.role || session.user.user_metadata?.role || 'student') as UserRole,
            phone: profile?.phone || session.user.phone,
            createdAt: session.user.created_at,
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => {
        mounted = false;
        authListener?.subscription?.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, [isLive]);

  // Sync to local storage for persistent demo sessions
  useEffect(() => {
    if (user) {
      localStorage.setItem('sri_sai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sri_sai_user');
    }
  }, [user]);

  const currentStudent = mockStudents.find((s) => s.id === selectedChildId) || mockStudents[0];
  const currentParent = mockParents[0];

  const signInWithSupabase = async (params: SignInParams) => {
    setIsLoading(true);
    const { data, error } = await authService.signIn(params);
    setIsLoading(false);
    if (error) {
      return { success: false, error: error.message };
    }
    if (data?.user) {
      const { data: profile } = await authService.getProfile(data.user.id);
      setUser({
        id: data.user.id,
        email: data.user.email || params.email,
        name: profile?.full_name || data.user.user_metadata?.full_name || 'User',
        role: (profile?.role || data.user.user_metadata?.role || 'student') as UserRole,
        phone: profile?.phone,
        createdAt: data.user.created_at,
      });
      return { success: true };
    }
    return { success: false, error: 'Authentication failed' };
  };

  const signUpWithSupabase = async (params: SignUpParams) => {
    setIsLoading(true);
    const { data, error } = await authService.signUp(params);
    setIsLoading(false);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const loginAsStudent = (idOrEmail: string) => {
    const matched =
      mockStudents.find(
        (s) => s.id.toLowerCase() === idOrEmail.toLowerCase() || s.name.toLowerCase().includes(idOrEmail.toLowerCase())
      ) || mockStudents[0];

    setSelectedChildId(matched.id);
    setUser({
      id: `usr-${matched.id}`,
      name: matched.name,
      email: `${matched.name.toLowerCase().replace(' ', '.')}@srisai.edu`,
      role: 'student',
      createdAt: matched.admissionDate,
    });
    return true;
  };

  const loginAsParent = (_emailOrPhone: string) => {
    setUser({
      id: 'usr-parent-001',
      name: currentParent.name,
      email: currentParent.email,
      role: 'parent',
      phone: currentParent.phone,
      createdAt: '2024-06-10',
    });
    setSelectedChildId(currentParent.childrenIds[0]);
    return true;
  };

  const loginAsAdmin = (_email: string) => {
    setUser({
      id: 'usr-admin-001',
      name: 'Mrs. Telu Dhana Lakshmi',
      email: 'dhanalakshmi.telu@srisaituition.edu.in',
      role: 'admin',
      createdAt: '2020-01-01',
    });
    return true;
  };

  const logout = async () => {
    if (isLive) {
      await authService.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        currentStudent,
        currentParent,
        selectedChildId,
        setSelectedChildId,
        loginAsStudent,
        loginAsParent,
        loginAsAdmin,
        signInWithSupabase,
        signUpWithSupabase,
        logout,
        isAuthenticated: !!user,
        isLiveSupabase: isLive,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
