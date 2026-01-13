import React, { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import { useAuthState } from '../hooks/useAuthState'; // パスとフック名を修正

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // useAuthStateフックから認証状態と関数を取得
  const { user, signOut, loading } = useAuthState();

  const value = {
    user,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);
