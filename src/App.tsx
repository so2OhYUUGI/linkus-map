// File Path: src/App.tsx
// File Name: App.tsx
// Overview: Root application component.

import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { AuthProvider } from '@/contexts';

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
