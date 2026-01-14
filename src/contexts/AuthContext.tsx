import React, { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthForm } from '@/hooks/useAuthForm';

// 認証コンテキストが提供する値の型を定義
interface AuthContextType {
  user: User | null;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

// コンテキストを作成。デフォルト値は後でProviderから供給
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// AuthProviderコンポーネント
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // useAuthStateフックから認証状態とすべての関連アクションを取得
  const { user, isInitialLoading, signOut } = useAuthState();
  const { isLoading: isSubmitting, error, clearError } = useAuthForm();

  // コンテキストに渡す値をオブジェクトにまとめる
  const value = {
    user,
    isInitialLoading,
    isSubmitting,
    signOut,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// コンテキストを簡単に利用するためのカスタムフック
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);
