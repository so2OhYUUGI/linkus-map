import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase/client';

import ReactFlow, { type Node, type Edge, type OnNodesChange, type OnEdgesChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import TopPage from './pages/TopPage.tsx';
import AuthPage from './pages/AuthPage.tsx';


// メインのエディタ画面（旧Appコンポーネント）
const Editor = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange: OnNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange: OnEdgesChange = (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));

  useEffect(() => {
    // ログイン後にワールドのデータを読み込む処理を実装予定
    // 一時的に初期ノードを設定して警告を解消
    const initialNodes: Node[] = [
      {
        id: '1',
        position: { x: 250, y: 5 },
        data: { label: 'ようこそ！あなたのWorldへ' },
      },
    ];
    setNodes(initialNodes);
    setEdges([]); // setEdgesも使用する
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
      <button onClick={() => supabase.auth.signOut()} style={{ position: 'absolute', top: 10, right: 10 }}>
        ログアウト
      </button>
    </div>
  );
};


// 認証状態に応じてルーティングを管理するメインコンポーネント
function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // クリーンアップ
    return () => subscription.unsubscribe();
  }, []);

  // ログイン状態に基づいてルートを保護するコンポーネント
  const ProtectedRoute = () => {
    if (loading) return <div>読み込み中...</div>; // ローディング表示
    return session ? <Outlet /> : <Navigate to="/" replace />;
  };

  // 未ログイン状態のユーザー向けのルート
  const PublicRoute = () => {
    if (loading) return <div>読み込み中...</div>;
    // ログイン済みの場合はダッシュボードにリダイレクト
    return !session ? <Outlet /> : <Navigate to="/dashboard" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 未ログインユーザー向けルート */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<TopPage />} />
          <Route path="/auth/*" element={<AuthPage />} />
        </Route>

        {/* ログインユーザー向けルート */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Editor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
