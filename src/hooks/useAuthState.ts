// File Path: src/hooks/useAuthState.ts
// Overview: Provides authentication state and actions with initialization tracking.

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export interface UseAuthReturn {
  user: User | null;
  isInitialLoading: boolean; // ✅ isInitialLoading に変更
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

export const useAuthState = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // 最初に現在のユーザーセッションを取得
    const fetchUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      // これで初期ユーザーチェックは完了
      setIsInitialLoading(false);
    };

    fetchUser();

    // 認証状態の変更を監視するリスナー
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // 状態変更が検知された時点で、初期ロードは完了していると見なす
      setIsInitialLoading(false);
    });

    // コンポーネントのアンマウント時にリスナーを解除
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      console.error('Error signing in with Google:', error);
    }
  }, []);

  return { user, isInitialLoading, signOut, signInWithGoogle };
};
