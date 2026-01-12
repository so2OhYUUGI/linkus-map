import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <LandingPage />,
	},
	{
		// 今後、未定義のパスにアクセスされたらトップへ戻す設定
		path: '*',
		element: <Navigate to="/" replace />,
	},
]);