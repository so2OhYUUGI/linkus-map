
// File Path: src/routes/router.tsx
// File Name: router.tsx
// Overview: Defines the main application routes using `createBrowserRouter`.

import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/components/layout/DashboardLayout';
import WorldSelector from '@/pages/dashboard/WorldSelector';
import UpdatePasswordPage from '@/pages/auth/UpdatePasswordPage';
import { ProtectedRoute, PublicRoute } from '@/routes';
import WorldDetail from '@/pages/dashboard/WorldDetail';

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
        element: <Dashboard />, // This acts as the layout (parent)
        children: [
          {
            index: true, // Renders at /dashboard
            element: <WorldSelector />,
          },
          {
            path: 'worlds/:worldId', // Renders at /dashboard/worlds/:worldId
            element: <WorldDetail />,
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
