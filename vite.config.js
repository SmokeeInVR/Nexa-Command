import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // Dev: inspections endpoint served by local dev-api server (port 4001)
      '/api/os': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
      // Dev: all other /api calls forwarded to nexa-core backend
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
