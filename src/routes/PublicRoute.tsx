// src/routes/PublicRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // useLocationを追加
import { useAuthContext } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export const PublicRoute = () => {
	const { user, loading } = useAuthContext();
	const location = useLocation();

	if (loading) {
		return (
			<Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
				<CircularProgress />
			</Box>
		);
	}

	// 🌟 パスワード更新ページへのアクセスの場合は、ログイン済みでもリダイレクトさせない
	const isUpdatingPassword = location.pathname === '/auth/update-password';

	if (user && !isUpdatingPassword) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
};