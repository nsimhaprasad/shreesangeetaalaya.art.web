import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    RubyPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/javascript'),
      '@components': path.resolve(__dirname, './app/javascript/Components'),
      '@pages': path.resolve(__dirname, './app/javascript/Pages'),
    },
  },
})
