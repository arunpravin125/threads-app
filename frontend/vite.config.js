import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react()],
  server:{
    port:3000,

    proxy:{
      "/api":{
        target:"http://localhost:4900",
        changeOrigin:true,
        secure:false
      }
    }
  }
})
