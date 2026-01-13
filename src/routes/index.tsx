// src/routes/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import TestDashboard from '../pages/test/TestDashboard';
import { AuthLayout } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute'; // 追加

export const router = createBrowserRouter([
  // 【公開・ゲスト限定ルート】ログイン済みなら入れない
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      // 将来的に /login, /signup を独立させるならここに入れる
    ],
  },

  // 【保護ルート】ログイン必須
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/dashboard',
        element: <TestDashboard />,
      },
      // ...他の保護ルート
    ],
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);