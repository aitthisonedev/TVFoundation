import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router']
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    minify: 'terser'
  },
  css: {
    devSourcemap: false
  },
  server: {
    port: 3000,
    host: true
  }
})
