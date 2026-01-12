import { RouterProvider } from 'react-router-dom';
import { router } from './routes'; // 先ほど作成した routes/index.tsx をインポート

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;