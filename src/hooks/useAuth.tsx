import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  handleSignUp: (email: string, password: string, passwordConfirm: string) => Promise<boolean>;
  clearError: () => void;
  clearMessage: () => void;
}

/**
 * 認証関連のロジックを管理するカスタムフック
 * 
 * @returns {UseAuthReturn} 認証関連の状態と関数
 */
export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  /**
   * エラーメッセージをクリアする
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 成功メッセージをクリアする
   */
  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  /**
   * 新規アカウント作成処理
   * 
   * @param {string} email - メールアドレス
   * @param {string} password - パスワード
   * @param {string} passwordConfirm - パスワード確認
   * @returns {Promise<boolean>} 成功した場合true、失敗した場合false
   */
  const handleSignUp = useCallback(
    async (email: string, password: string, passwordConfirm: string): Promise<boolean> => {
      // バリデーション: パスワードの一致確認
      if (password !== passwordConfirm) {
        setError('パスワードが一致しません。');
        setIsLoading(false);
        return false;
      }

      // バリデーション: パスワードの長さ確認
      if (password.length < 6) {
        setError('パスワードは6文字以上である必要があります。');
        setIsLoading(false);
        return false;
      }

      // バリデーション: メールアドレスの形式確認
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('有効なメールアドレスを入力してください。');
        setIsLoading(false);
        return false;
      }

      setIsLoading(true);
      setError(null);
      setMessage(null);

      try {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          // Supabaseのエラーメッセージをユーザーフレンドリーな日本語に変換
          let errorMessage = signUpError.message;
          
          if (signUpError.message.includes('already registered')) {
            errorMessage = 'このメールアドレスは既に登録されています。ログインしてください。';
          } else if (signUpError.message.includes('invalid email')) {
            errorMessage = '有効なメールアドレスを入力してください。';
          } else if (signUpError.message.includes('password')) {
            errorMessage = 'パスワードが弱すぎます。より強力なパスワードを設定してください。';
          } else if (signUpError.message.includes('rate limit')) {
            errorMessage = 'リクエストが多すぎます。しばらく待ってから再度お試しください。';
          }

          setError(errorMessage);
          setIsLoading(false);
          return false;
        }

        // 成功時のメッセージ
        setMessage('確認メールを送信しました。メールボックスを確認してください。');
        setIsLoading(false);
        return true;
      } catch (unexpectedError) {
        // 予期しないエラーの処理
        const errorMessage =
          unexpectedError instanceof Error
            ? unexpectedError.message
            : '予期しないエラーが発生しました。しばらく待ってから再度お試しください。';
        setError(errorMessage);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  return {
    isLoading,
    error,
    message,
    handleSignUp,
    clearError,
    clearMessage,
  };
};
