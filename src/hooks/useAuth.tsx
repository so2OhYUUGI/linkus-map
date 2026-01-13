// src/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';
import { translateAuthError } from '../utils/authErrors';
import { validateSignUp } from '../utils/authValidation';

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  handleSignUp: (email: string, password: string, passwordConfirm: string) => Promise<boolean>;
  handleLogin: (email: string, password: string) => Promise<boolean>;
  handlePasswordReset: (email: string) => Promise<boolean>; // 追加
  clearError: () => void;
  clearMessage: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearMessage = useCallback(() => setMessage(null), []);

  // 共通の処理をラップするヘルパー（内部用）
  const authAction = async (action: () => Promise<{ error: any }>, successMsg?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error: apiError } = await action();
      if (apiError) {
        setError(translateAuthError(apiError.message));
        return false;
      }
      if (successMsg) setMessage(successMsg);
      return true;
    } catch (err) {
      setError('予期しないエラーが発生しました。');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = useCallback(async (email: string, password: string, passwordConfirm: string) => {
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

  const handleLogin = useCallback(async (email: string, password: string) => {
    return authAction(() => supabase.auth.signInWithPassword({ email, password }));
  }, []);

  const handlePasswordReset = useCallback(async (email: string) => {
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
    handleSignUp,
    handleLogin,
    handlePasswordReset,
    clearError,
    clearMessage,
  };
};