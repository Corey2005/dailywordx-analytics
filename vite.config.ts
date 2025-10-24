import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/dailywordx-analytics/',
  build: {
    outDir: 'dist',
    assetsDir: '', // Flat structure
    rollupOptions: {
      input: {
        main: 'index.html',       // Login page
        dashboard: 'dashboard.html' // Dashboard with React
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        manualChunks: undefined,
      },
    },
    copyPublicDir: true, // Ensure HTML files are copied
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    cors: false,
  }
})
