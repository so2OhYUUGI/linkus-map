// src/routes/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import TestDashboard from '../pages/test/TestDashboard';
import { AuthLayout } from './AuthLayout'; // さっき作ったやつ
import { Box } from '@mui/material';

export const router = createBrowserRouter([
  // 【公開ルート】誰でもアクセス可能
  {
    path: '/',
    element: <LandingPage />,
  },

  // 【保護ルート】ログイン必須エリア
  {
    element: <AuthLayout />, // 親で認証チェックを一本化
    children: [
      {
        path: '/dashboard',
        element: <TestDashboard />,
      },
      {
        path: '/settings',
        element: <Box>設定画面（予定）</Box>,
      },
      {
        path: '/profile',
        element: <Box>ユーザープロファイル（予定）</Box>,
      },
      {
        path: '/worlds/:id',
        element: <Box>ワールド詳細画面（予定）</Box>,
      },
    ],
  },

  // 未定義のパス
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);