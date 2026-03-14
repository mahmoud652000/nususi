// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // جميع طلبات API
      '/api': {
        target: 'https://backendnnususi-production.up.railway.app/api',
        changeOrigin: true,
        secure: false, // لحل مشاكل SSL أثناء التطوير
      },
      // تحميل الصور أو الملفات من uploads
      '/uploads': {
        target: 'https://backendnnususi-production.up.railway.app/api',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})