import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            // Gracefully handle backend startup / restart without unhandled error dump
            if ((err as any)?.code === 'ECONNREFUSED') {
              if (res && !res.headersSent && typeof (res as any).writeHead === 'function') {
                (res as any).writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Backend server is booting up, please retry shortly' }));
              }
            }
          });
        },
      }
    }
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'recharts-vendor': ['recharts'],
          'lightweight-vendor': ['lightweight-charts'],
          'query-vendor': ['@tanstack/react-query', 'zustand'],
          'ui-vendor': ['lucide-react', 'sonner', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
})
