import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './AuthContext';
import type { User, Session } from '@supabase/supabase-js';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      // Provide user-friendly error messages
      let userMessage = '로그인 중 오류가 발생했습니다.';
      
      switch (error.message) {
        case 'Invalid login credentials':
          userMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
          break;
        case 'Email not confirmed':
          userMessage = '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.';
          break;
        case 'Too many requests':
          userMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 'User not found':
          userMessage = '등록되지 않은 이메일입니다.';
          break;
        default:
          if (error.message.includes('network')) {
            userMessage = '네트워크 연결을 확인해주세요.';
          } else if (error.message.includes('timeout')) {
            userMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
          }
      }
      
      return { error: { ...error, userMessage } };
    }
    
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      // Provide user-friendly error messages
      let userMessage = '회원가입 중 오류가 발생했습니다.';
      
      switch (error.message) {
        case 'User already registered':
          userMessage = '이미 등록된 이메일입니다.';
          break;
        case 'Password should be at least 6 characters':
          userMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
          break;
        case 'Invalid email':
          userMessage = '올바른 이메일 형식이 아닙니다.';
          break;
        case 'Too many requests':
          userMessage = '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.';
          break;
        default:
          if (error.message.includes('network')) {
            userMessage = '네트워크 연결을 확인해주세요.';
          } else if (error.message.includes('timeout')) {
            userMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
          }
      }
      
      return { error: { ...error, userMessage } };
    }
    
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) {
      // Provide user-friendly error messages
      let userMessage = 'Google 로그인 중 오류가 발생했습니다.';
      
      switch (error.message) {
        case 'OAuth provider not enabled':
          userMessage = 'Google 로그인이 현재 사용할 수 없습니다.';
          break;
        case 'User not found':
          userMessage = 'Google 계정을 찾을 수 없습니다.';
          break;
        case 'Too many requests':
          userMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
          break;
        default:
          if (error.message.includes('network')) {
            userMessage = '네트워크 연결을 확인해주세요.';
          } else if (error.message.includes('timeout')) {
            userMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
          }
      }
      
      return { error: { ...error, userMessage } };
    }
    
    return { error: null };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

