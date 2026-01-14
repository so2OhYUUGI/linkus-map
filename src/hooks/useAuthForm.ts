// src/hooks/useAuthForm.ts

/*
 * [アーキテクチャ設計方針]
 * このフックは、認証関連の「フォーム」操作に特化したカスタムフックです。
 * ログイン、サインアップ、パスワードリセットといった非同期のアクションと、
 * それに伴う状態（ローディング、エラー、成功メッセージ）をカプセル化します。
 *
 * ◆ 責務:
 * ・ 認証アクション（signUp, login, passwordReset）のロジック提供
 * ・ フォームの送信状態（isLoading）の管理
 * ・ アクション結果（error, message）の管理
 *
 * ◆ 利用規約:
 * ・ このフックは原則として `AuthContext` の内部でのみ使用してください。
 * ・ ビューコンポーネントが直接このフックを呼び出すことは想定していません。
 *   フォーム操作は `useAuthContext()` を経由して行うべきです。
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { AuthError } from '@supabase/supabase-js';
import { translateAuthError } from '@/utils/authErrors';
import { validateSignUp } from '@/utils/authValidation';

interface UseAuthFormReturn {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  signUp: (email: string, password: string, passwordConfirm: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  passwordReset: (email: string) => Promise<boolean>;
  clearError: () => void;
  clearMessage: () => void;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearMessage = useCallback(() => setMessage(null), []);

  // 認証関連の非同期処理を共通化する内部関数
  const authAction = async (action: () => Promise<{ error: AuthError | null }>, successMsg?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error: apiError } = await action();
      if (apiError) {
        setError(translateAuthError(apiError.message));
        return false;
      }
      if (successMsg) {
        setMessage(successMsg);
      }
      return true;
    } catch (e) {
      setError('予期しないエラーが発生しました。');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = useCallback(async (email: string, password: string, passwordConfirm: string) => {
    const validationError = validateSignUp(password, passwordConfirm);
    if (validationError) {
      setError(validationError);
      return false;
    }
    return authAction(
      () => supabase.auth.signUp({ email, password }),
      '確認メールを送信しました。メールボックスを確認してください。'
    );
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // ログイン成功時のメッセージは不要（ページ遷移するため）
    return authAction(() => supabase.auth.signInWithPassword({ email, password }));
  }, []);

  const passwordReset = useCallback(async (email: string) => {
    return authAction(
      () => supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      }),
      'パスワードリセット用のメールを送信しました。'
    );
  }, []);

  return {
    isLoading,
    error,
    message,
    signUp,
    login,
    passwordReset,
    clearError,
    clearMessage,
  };
};
