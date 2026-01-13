// src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { user, loading } = useAuthContext();

	if (loading) return <div>Loading...</div>; // ロード中画面（スプラッシュ）

	if (!user) {
		return <Navigate to="/" replace />; // 未ログインならトップへ
	}

	return <>{children}</>;
};