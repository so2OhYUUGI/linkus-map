import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // ここを 3000 に固定
    strictPort: true, // 3000が使われていたらエラーを出す（別のポートに逃げない）
  },
})
