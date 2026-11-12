import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['ghost.svg'],
      manifest: {
        name: 'Ghost Story Relay',
        short_name: 'Story Relay',
        description: 'Write scary stories together, one sentence at a time, in realtime.',
        theme_color: '#0d0817',
        background_color: '#0d0817',
        display: 'standalone',
        start_url: '.',
        icons: [{ src: 'ghost.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
    }),
  ],
  server: { host: '127.0.0.1', port: 5174, strictPort: true },
});

