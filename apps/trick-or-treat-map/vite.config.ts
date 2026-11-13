import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pumpkin.svg'],
      manifest: {
        name: 'Trick-or-Treat Map',
        short_name: 'TOT Map',
        description: 'A local Halloween candy map — add fictional stops, filter markers, and share thanks.',
        theme_color: '#0d0817',
        background_color: '#0d0817',
        display: 'standalone',
        start_url: '.',
        icons: [{ src: 'pumpkin.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
    }),
  ],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks: { leaflet: ['leaflet'] },
      },
    },
  },
});
