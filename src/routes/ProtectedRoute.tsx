// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Box, CircularProgress, Paper, Typography, Stack, Tooltip, IconButton, Avatar, Divider, useTheme, alpha } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { supabase } from '../lib/supabase/client';

export const AuthLayout = () => {
	const { user, loading } = useAuthContext();

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
						<IconButton size="small" onClick={() => supabase.auth.signOut()}><LogoutIcon fontSize="small" /></IconButton>
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