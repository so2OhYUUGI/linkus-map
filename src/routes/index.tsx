// src/routes/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import TestDashboard from '../pages/test/TestDashboard';
import UpdatePasswordPage from '../pages/auth/UpdatePasswordPage'; // 追加
import { AuthLayout } from './ProtectedRoute'; // リネーム済みなら適宜書き換えてください
import { PublicRoute } from './PublicRoute';

export const router = createBrowserRouter([
  // 【公開ルート】ログイン済みなら基本は入れないが、パスワード更新は許可する
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/auth/update-password', // 追加
        element: <UpdatePasswordPage />,
      },
    ],
  },

  // 【保護ルート】ログイン必須エリア
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/dashboard',
        element: <TestDashboard />,
      },
      // 今後ここに /settings や /worlds/:id などを追加していく
    ],
  },

  // 未定義のパスはトップへ
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);