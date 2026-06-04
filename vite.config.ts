import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      filename: 'sw-v2.js',
      registerType: 'autoUpdate',
      skipWaiting: true,
      clientsClaim: true,
      includeAssets: ['vite.svg'],
      manifest: {
        name: '21Days',
        short_name: '21Days',
        description: '21天习惯养成打卡系统',
        theme_color: '#f97316',
        background_color: '#fafafa',
        display: 'standalone',
        icons: [
          { src: 'vite.svg', sizes: '192x192', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/minimax': {
        target: 'https://api.minimax.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/minimax/, ''),
      },
    },
  },
});