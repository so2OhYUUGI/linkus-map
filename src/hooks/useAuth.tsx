// src/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';
import { translateAuthError } from '../utils/authErrors';

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  handleSignUp: (email: string, password: string, passwordConfirm: string) => Promise<boolean>;
  handleLogin: (email: string, password: string) => Promise<boolean>; // ログイン追加
  clearError: () => void;
  clearMessage: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearMessage = useCallback(() => setMessage(null), []);

  /**
   * 新規アカウント作成
   */
  const handleSignUp = useCallback(
    async (email: string, password: string, passwordConfirm: string): Promise<boolean> => {
      // 簡易バリデーション
      if (password !== passwordConfirm) {
        setError('パスワードが一致しません。');
        return false;
      }
      if (password.length < 6) {
        setError('パスワードは6文字以上である必要があります。');
        return false;
      }

      setIsLoading(true);
      setError(null);
      setMessage(null);

      try {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });

        if (signUpError) {
          setError(translateAuthError(signUpError.message));
          return false;
        }

        setMessage('確認メールを送信しました。メールボックスを確認してください。');
        return true;
      } catch (err) {
        setError('予期しないエラーが発生しました。');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * ログイン処理
   */
  const handleLogin = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      setMessage(null);

      try {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

        if (loginError) {
          setError(translateAuthError(loginError.message));
          return false;
        }

        return true;
      } catch (err) {
        setError('予期しないエラーが発生しました。');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    message,
    handleSignUp,
    handleLogin,
    clearError,
    clearMessage,
  };
};