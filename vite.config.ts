import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/dailywordx-analytics/',
  build: {
    outDir: 'dist',
    assetsDir: '', // Keeps files flat (no /assets/ prefix)
    rollupOptions: {
      input: {
        main: 'index.html',      // Login page entry
        dashboard: 'dashboard.html' // Dashboard entry
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    cors: false, // Prevents dev server header issues
  }
})
