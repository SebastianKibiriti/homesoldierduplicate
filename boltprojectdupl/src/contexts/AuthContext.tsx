import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { setSentryUser, clearSentryUser, captureSupabaseError, addSentryBreadcrumb } from '../lib/sentry';
import type { User } from '@supabase/supabase-js';
import { logger } from '../utils/logger';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: 'parent' | 'child';
  age?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  isDemoMode: boolean;
  demoRole: 'parent' | 'child' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoRole, setDemoRole] = useState<'parent' | 'child' | null>(null);
  const { handleError } = useErrorHandler({ component: 'AuthContext' });

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for demo mode first
        const demoModeFlag = localStorage.getItem('demoMode');
        const demoDemoRole = localStorage.getItem('demoRole') as 'parent' | 'child' | null;
        
        if (demoModeFlag === 'true' && demoDemoRole) {
          setIsDemoMode(true);
          setDemoRole(demoDemoRole);
          // Create a mock user for demo mode
          const mockUser = {
            id: 'demo-user',
            email: `demo-${demoDemoRole}@homesoldier.com`,
            user_metadata: {
              full_name: demoDemoRole === 'parent' ? 'Demo Parent' : 'Demo Child',
              role: demoDemoRole
            }
          } as User;
          setUser(mockUser);
          
          // Set Sentry user context for demo
          setSentryUser({
            id: mockUser.id,
            email: mockUser.email,
            role: demoDemoRole,
          });
          
          addSentryBreadcrumb('Demo mode initialized', 'auth', 'info', { role: demoDemoRole });
          setLoading(false);
          return;
        }

        logger.info('AuthContext: Initializing authentication');
        addSentryBreadcrumb('Initializing authentication', 'auth', 'info');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          captureSupabaseError(error, {
            operation: 'getSession',
            userId: session?.user?.id,
          });
          throw error;
        }

        if (mounted) {
          setUser(session?.user ?? null);
          
          // Set Sentry user context
          if (session?.user) {
            setSentryUser({
              id: session.user.id,
              email: session.user.email,
              role: session.user.user_metadata?.role,
            });
            
            addSentryBreadcrumb('User session restored', 'auth', 'info', {
              userId: session.user.id,
              role: session.user.user_metadata?.role,
            });
          }
          
          logger.info('AuthContext: Session initialized', {
            hasUser: !!session?.user,
            userId: session?.user?.id,
          });
        }
      } catch (error) {
        if (mounted) {
          const errorMessage = handleError(error, { action: 'initialize_session' });
          setError(errorMessage);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      logger.info('AuthContext: Auth state changed', {
        event,
        hasUser: !!session?.user,
        userId: session?.user?.id,
      });

      addSentryBreadcrumb(`Auth state changed: ${event}`, 'auth', 'info', {
        userId: session?.user?.id,
      });

      setUser(session?.user ?? null);
      setError(null);
      
      if (event === 'SIGNED_OUT') {
        logger.info('AuthContext: User signed out');
        clearSentryUser();
        addSentryBreadcrumb('User signed out', 'auth', 'info');
        
        // Clear demo mode on sign out
        localStorage.removeItem('demoMode');
        localStorage.removeItem('demoRole');
        setIsDemoMode(false);
        setDemoRole(null);
      } else if (event === 'SIGNED_IN') {
        logger.info('AuthContext: User signed in', {
          userId: session?.user?.id,
          email: session?.user?.email,
        });
        
        if (session?.user) {
          setSentryUser({
            id: session.user.id,
            email: session.user.email,
            role: session.user.user_metadata?.role,
          });
          
          addSentryBreadcrumb('User signed in', 'auth', 'info', {
            userId: session.user.id,
            role: session.user.user_metadata?.role,
          });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleError]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      logger.info('AuthContext: Attempting sign in', { email });
      addSentryBreadcrumb('Sign in attempt', 'auth', 'info', { email });
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        captureSupabaseError(error, {
          operation: 'signInWithPassword',
          additionalData: { email },
        });
        throw error;
      }
      
      logger.info('AuthContext: Sign in successful', { email });
      addSentryBreadcrumb('Sign in successful', 'auth', 'info', { email });
    } catch (error) {
      const errorMessage = handleError(error, { action: 'sign_in', email });
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ email, password, fullName, role, age }: SignUpData) => {
    try {
      setLoading(true);
      setError(null);
      
      logger.info('AuthContext: Attempting sign up', { email, role });
      addSentryBreadcrumb('Sign up attempt', 'auth', 'info', { email, role });
      
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });
      
      if (signUpError) {
        captureSupabaseError(signUpError, {
          operation: 'signUp',
          additionalData: { email, role },
        });
        throw signUpError;
      }

      if (!data.user) {
        throw new Error('User creation failed');
      }

      // Create profile or child record based on role
      if (role === 'parent') {
        logger.info('AuthContext: Creating parent profile', { userId: data.user.id });
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, email, full_name: fullName }]);
          
        if (profileError) {
          captureSupabaseError(profileError, {
            operation: 'createProfile',
            userId: data.user.id,
            additionalData: { email, role },
          });
          throw profileError;
        }
      } else {
        logger.info('AuthContext: Creating child record', { userId: data.user.id });
        
        const { error: childError } = await supabase
          .from('children')
          .insert([{
            name: fullName,
            age: age!,
            parent_id: data.user.id,
          }]);
          
        if (childError) {
          captureSupabaseError(childError, {
            operation: 'createChild',
            userId: data.user.id,
            additionalData: { email, role, age },
          });
          throw childError;
        }
      }
      
      logger.info('AuthContext: Sign up successful', { email, role, userId: data.user.id });
      addSentryBreadcrumb('Sign up successful', 'auth', 'info', { email, role, userId: data.user.id });
    } catch (error) {
      const errorMessage = handleError(error, { action: 'sign_up', email, role });
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      logger.info('AuthContext: Attempting sign out');
      addSentryBreadcrumb('Sign out attempt', 'auth', 'info');
      
      // Clear demo mode
      localStorage.removeItem('demoMode');
      localStorage.removeItem('demoRole');
      setIsDemoMode(false);
      setDemoRole(null);
      
      if (!isDemoMode) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          captureSupabaseError(error, {
            operation: 'signOut',
          });
          throw error;
        }
      } else {
        // For demo mode, just clear the user
        setUser(null);
      }
      
      clearSentryUser();
      logger.info('AuthContext: Sign out successful');
      addSentryBreadcrumb('Sign out successful', 'auth', 'info');
    } catch (error) {
      const errorMessage = handleError(error, { action: 'sign_out' });
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      error, 
      isDemoMode, 
      demoRole 
    }}>
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