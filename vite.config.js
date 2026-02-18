import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/javascript'),
      '@components': path.resolve(__dirname, './app/javascript/Components'),
      '@pages': path.resolve(__dirname, './app/javascript/Pages'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: '/app/javascript/application.jsx',
    },
    outDir: path.resolve(__dirname, 'public/vite'),
    emptyOutDir: true,
  },
})
