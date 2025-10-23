import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/dailywordx-analytics/',
  build: {
  outDir: 'dist',
  assetsDir: '', // <- important, removes the leading /assets
  rollupOptions: {
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
    cors: false, // ensure dev server doesn’t mess with headers
  }
})

