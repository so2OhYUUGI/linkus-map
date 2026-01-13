// File Path: vite.config.ts
// File Name: vite.config.ts
// Overview: パスエイリアス（@/）の設定をViteに追加

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 追加

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // ここを 3000 に固定
    strictPort: true, // 3000が使われていたらエラーを出す（別のポートに逃げない）
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // @をsrcディレクトリに紐付け
    },
  },
});