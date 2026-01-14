// File Path: src/routes/ProtectedRoute.tsx
// File Name: ProtectedRoute.tsx
// Overview: Defines the routing logic for protected pages, ensuring only authenticated users can access them.

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/contexts';
import FullscreenLoading from '@/components/layout/FullscreenLoading';

export const ProtectedRoute = () => {
  const { user, isInitialLoading, signOut } = useAuthContext();

  if (isInitialLoading) {
    return <FullscreenLoading />;
  }

  if (!user) {
    // ユーザーがいない場合、ログアウト処理を念のため呼び出し、ログインページにリダイレクト
    // これにより、Supabaseセッションが残っている場合に発生しうる問題を回避
    signOut(); 
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
