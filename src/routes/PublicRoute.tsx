// File Path: src/routes/PublicRoute.tsx
// File Name: PublicRoute.tsx
// Overview: Defines the routing logic for public pages. It redirects authenticated users to the dashboard unless they are accessing the password update page.

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts';
import FullscreenLoading from '@/components/layout/FullscreenLoading';

export const PublicRoute = () => {
	const { user, isInitialLoading } = useAuthContext();
	const location = useLocation();

	if (isInitialLoading) {
		return <FullscreenLoading />;
	}

	const isUpdatingPassword = location.pathname === '/auth/update-password';

	if (user && !isUpdatingPassword) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
};