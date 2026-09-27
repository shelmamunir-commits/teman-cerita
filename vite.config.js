import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const developmentCsp = {
  name: 'development-csp',
  apply: 'serve',
  enforce: 'post',
  transformIndexHtml(html) {
    // The React plugin injects an inline Fast Refresh preamble in development.
    // Keep the stricter CSP from index.html unchanged for production builds.
    return html.replace("script-src 'self';", "script-src 'self' 'unsafe-inline';")
  },
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    developmentCsp,
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.jpeg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Teman Cerita — Pesma Nur Alannur',
        short_name: 'Teman Cerita',
        description:
          'Ruang aman dari Pesma Nur Alannur untuk memahami diri, merawat kesehatan mental, dan menemukan bantuan.',
        theme_color: '#128f8a',
        background_color: '#f5f6f7',
        lang: 'id',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
