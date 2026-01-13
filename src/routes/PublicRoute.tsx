// File Path: src/routes/PublicRoute.tsx
// File Name: PublicRoute.tsx
// Overview: Defines the routing logic for public pages. It redirects authenticated users to the dashboard unless they are accessing the password update page.

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts';
import { Box, CircularProgress } from '@mui/material';

export const PublicRoute = () => {
	const { user, isLoading } = useAuthContext();
	const location = useLocation();

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
				<CircularProgress />
			</Box>
		);
	}

	const isUpdatingPassword = location.pathname === '/auth/update-password';

	if (user && !isUpdatingPassword) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
};