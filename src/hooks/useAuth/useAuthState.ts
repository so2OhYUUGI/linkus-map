// src/hooks/useAuthState.ts

/*
 * [アーキテクチャ設計方針]
 * このフックは、グローバルな認証状態の管理に特化したカスタムフックです。
 * Supabase の `onAuthStateChange` をサブスクライブし、現在のユーザー情報と
 * アプリケーションの初回ロード状態（isInitialLoading）をリアルタイムで提供します。
 *
 * ◆ 責務:
 * ・ 認証状態の監視と更新
 * ・ ユーザー情報の提供
 * ・ サインアウト処理の提供
 *
 * ◆ 利用規約:
 * ・ このフックは原則として `AuthContext` の内部でのみ使用してください。
 * ・ ビューコンポーネントが直接このフックを呼び出すことは想定していません。
 *   認証状態へのアクセスは `useAuth()` を経由して行うべきです。
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UseAuthStateReturn {
  user: User | null;
  isInitialLoading: boolean;
  signOut: () => Promise<void>;
}

export const useAuthState = (): UseAuthStateReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // 認証状態の変更を監視するリスナーを設定
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      // ユーザーセッションの読み込みが完了したら、ローディング状態を解除
      setIsInitialLoading(false);
    });

    // コンポーネントのアンマウント時にリスナーをクリーンアップ
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // サインアウト処理
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // onAuthStateChange が発火するので、ここで user を null にする必要はない
  }, []);

  return { user, isInitialLoading, signOut };
};
