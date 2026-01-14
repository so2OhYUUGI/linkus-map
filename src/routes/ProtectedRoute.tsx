// File Path: src/routes/ProtectedRoute.tsx
// File Name: ProtectedRoute.tsx
// Overview: Defines the layout for authenticated users, including a sidebar and top bar, and handles the loading and authentication state.

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/contexts';
import { Box } from '@mui/material';
import { FullscreenLoading } from '@/components/layout';

export const ProtectedRoute = () => {
  const { user, isInitialLoading } = useAuthContext();

  // ✅ 修正：初回ロード時（userがまだいない時）のみ全画面ローディングを表示
  if (isInitialLoading) {
    return <FullscreenLoading />;
  }

  // 認証チェック：ロードが終わっていて、かつuserがいない場合
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // userがいる場合は、ロード中であってもレイアウトを描画し続ける
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', minHeight: '100vh', bgcolor: 'background.default', flexDirection: 'column', overflow: 'hidden' }}>
      <Outlet />
    </Box>
  );
};
