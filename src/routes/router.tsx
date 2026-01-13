// File Path: src/routes/router.tsx
// File Name: router.tsx
// Overview: Defines the main application routes using `createBrowserRouter`.

import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import TestDashboard from '@/pages/test/TestDashboard';
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
        element: <TestDashboard />,
      },
    ],
  },

  // Redirect undefined paths to the root
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
