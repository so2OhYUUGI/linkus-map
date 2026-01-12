import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import AuthTestPage from '../pages/test/AuthTestPage'; // テストページをインポート

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    // 認証関連ページの親ルート
    path: '/auth',
    element: <Navigate to="/" replace />, // 現時点ではトップへ
  },
  {
    // テスト用ルート
    path: '/test',
    element: <AuthTestPage />,
  },
  {
    // 未定義のパスはトップへリダイレクト
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
