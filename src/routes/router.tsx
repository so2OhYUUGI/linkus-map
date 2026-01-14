// File Path: src/routes/router.tsx
// File Name: router.tsx
// Overview: Defines the main application routes using `createBrowserRouter`.

import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/components/layout/DashboardLayout';
import WorldSelector from '@/pages/dashboard/WorldSelector';
import UpdatePasswordPage from '@/pages/auth/UpdatePasswordPage';
import { ProtectedRoute, PublicRoute } from '@/routes';

export const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/auth/update-password',
        element: <UpdatePasswordPage />,
      },
    ],
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />, // これがレイアウト（親）になる
        children: [
          {
            index: true, // /dashboard にアクセスした時
            element: <WorldSelector />,
          },
        ],
      },
    ],
  },

  // Redirect undefined paths to the root
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
