// src/hooks/useAuthForm.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { AuthError } from '@supabase/supabase-js';
import { translateAuthError } from '../utils/authErrors';
import { validateSignUp } from '../utils/authValidation';

interface UseAuthFormReturn {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  signUp: (email: string, password: string, passwordConfirm: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  passwordReset: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  clearMessage: () => void;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearMessage = useCallback(() => setMessage(null), []);

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
      if (successMsg) setMessage(successMsg);
      return true;
    } catch {
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

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    isLoading,
    error,
    message,
    signUp,
    login,
    passwordReset,
    signOut,
    clearError,
    clearMessage,
  };
};
