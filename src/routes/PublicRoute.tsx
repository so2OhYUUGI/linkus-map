// src/routes/PublicRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export const PublicRoute = () => {
	const { user, loading } = useAuthContext();

	if (loading) {
		return (
			<Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
				<CircularProgress />
			</Box>
		);
	}

	// 🌟 すでにログイン済みならダッシュボードへ自動転送
	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	// 未ログインなら、そのまま子要素（LandingPageなど）を表示
	return <Outlet />;
};