// File Path: src/routes/ProtectedRoute.tsx
// File Name: ProtectedRoute.tsx
// Overview: Defines the layout for authenticated users, including a sidebar and top bar, and handles the loading and authentication state.

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/contexts';
import { Box, CircularProgress, Paper, Typography, Stack, IconButton, Avatar, Divider } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

export const ProtectedRoute = () => {
  // supabaseの直接呼び出しを排除し、コンテキストから全て取得
  const { user, loading, signOut } = useAuthContext();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  const userEmail = user.email || '';
  const userName = userEmail.split('@')[0];

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

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* --- 共通トップバー --- */}
        <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: 4, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>LinkusMap</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{userName}</Typography>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>{userName[0]?.toUpperCase()}</Avatar>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            {/* ★ コンテキスト経由でのsignOut呼び出しに変更 */}
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
