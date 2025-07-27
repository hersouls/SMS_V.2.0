import { createContext } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';

// Extended error type with userMessage
interface ExtendedAuthError extends AuthError {
  userMessage?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: ExtendedAuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: ExtendedAuthError | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: ExtendedAuthError | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);