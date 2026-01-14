// File Path: src/routes/ProtectedRoute.tsx
// File Name: ProtectedRoute.tsx
// Overview: Defines the layout for authenticated users, including a sidebar and top bar, and handles the loading and authentication state.

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/contexts';
import { Box, Paper, Typography, Stack, IconButton, Avatar, Divider } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { FullscreenLoading } from '@/components/layout';

export const ProtectedRoute = () => {
  const { user, isInitialLoading, signOut } = useAuthContext();

  // ✅ 修正：初回ロード時（userがまだいない時）のみ全画面ローディングを表示
  if (isInitialLoading) {
    return <FullscreenLoading />;
  }


  // 認証チェック：ロードが終わっていて、かつuserがいない場合
  if (!user) {
    // ユーザーがいない場合、ログアウト処理を念のため呼び出し、ログインページにリダイレクト
    // これにより、Supabaseセッションが残っている場合に発生しうる問題を回避
    signOut();
    return <Navigate to="/login" replace />;
  }

  const userEmail = user.email || '';
  const userName = userEmail.split('@')[0];

  // userがいる場合は、ロード中であってもレイアウトを描画し続ける
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* --- 共通サイドバー --- */}
      <Paper elevation={0} sx={{ width: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, borderRight: 1, borderColor: 'divider', bgcolor: 'transparent' }}>
        <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>L</Typography>
        <Stack spacing={4} sx={{ flexGrow: 1 }}>
          <IconButton color="primary"><GridViewIcon /></IconButton>
          <IconButton><AutoStoriesIcon /></IconButton>
          <IconButton><AccountTreeIcon /></IconButton>
        </Stack>
        <IconButton sx={{ mb: 2 }}><SettingsIcon /></IconButton>
      </Paper>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* --- 共通トップバー --- */}
        <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: 4, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>LinkusMap</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{userName}</Typography>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>{userName[0]?.toUpperCase()}</Avatar>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <IconButton size="small" onClick={signOut}><LogoutIcon fontSize="small" /></IconButton>
          </Stack>
        </Box>

        {/* --- ここに各ページの中身が表示される --- */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
