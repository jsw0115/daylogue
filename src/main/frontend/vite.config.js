import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 반드시 있어야 함
const __dirname = path.resolve();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 윈도우 환경에서 가장 안전한 절대 경로 매핑 방식입니다.
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
