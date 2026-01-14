// src/contexts/AuthContext.tsx

/*
 * [アーキテクチャ設計方針]
 * この AuthContext は、アプリケーション全体の認証機能の「ハブ」として機能します。
 * 認証に関するすべての状態（ユーザー情報、ロード状態など）とアクション（ログイン、サインアップなど）を
 * このコンテキスト経由でコンポーネントに提供することを目的としています。
 *
 * ◆ 責務:
 * ・ useAuthState: グローバルな認証状態（ユーザー情報、初期ロード）を管理する。
 * ・ useAuthForm: フォーム固有の状態（送信中、エラー、メッセージ）とアクションを管理する。
 * ・ AuthProvider: 上記２つのカスタムフックを内部で合成し、単一の Context Value として配下のコンポーネントに提供する。
 *
 * ◆ 利用規約:
 * ・ ビューコンポーネント（.tsxファイル）は、原則としてこの `useAuth` フックのみを利用してください。
 * ・ `useAuthState` や `useAuthForm` をビューコンポーネントから直接呼び出すことは避けてください。
 *   これにより、認証ロジックの依存関係が `AuthContext` に集約され、コードの見通しと保守性が向上します。
 */

import React, { createContext } from 'react';
import type { User } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuth/useAuthState';
import { useAuthForm } from '@/hooks/useAuth/useAuthForm';

// コンテキストが提供する値の完全な型定義
interface AuthContextType {
  // --- from useAuthState ---
  user: User | null;
  isInitialLoading: boolean;
  signOut: () => Promise<void>;

  // --- from useAuthForm ---
  isSubmitting: boolean;
  error: string | null;
  message: string | null;
  signUp: (email: string, password: string, passwordConfirm: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  passwordReset: (email: string) => Promise<boolean>;
  clearError: () => void;
  clearMessage: () => void;
}

// コンテキストの作成
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/**
 * アプリケーションに認証機能を提供するProviderコンポーネント。
 * 内部で useAuthState と useAuthForm を呼び出し、その結果を単一のContextに集約する。
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // グローバルな認証状態（ユーザー情報、ロード状態）を取得
  const { user, isInitialLoading, signOut } = useAuthState();

  // フォーム関連のアクションと状態を取得
  const {
    isLoading: isSubmitting, // isSubmitting として名前を変更し、コンテキストの利用者に分かりやすくする
    error,
    message,
    signUp,
    login,
    passwordReset,
    clearError,
    clearMessage,
  } = useAuthForm();

  // コンポーネントに提供する単一の value オブジェクトを構築
  const value: AuthContextType = {
    user,
    isInitialLoading,
    signOut,
    isSubmitting,
    error,
    message,
    signUp,
    login,
    passwordReset,
    clearError,
    clearMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
