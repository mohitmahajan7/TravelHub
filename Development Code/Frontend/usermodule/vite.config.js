import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: { main: resolve(__dirname, "index.html") },
    },
  },
  server: {
    host: "bwc-72.brainwaveconsulting.co.in",
    port: 9000,
    cors: {
      origin: [
        "http://bwc-72.brainwaveconsulting.co.in:9000",
        "http://bwc-90.brainwaveconsulting.co.in",
        "http://bwc-97.brainwaveconsulting.co.in",
        "http://bwc-97.brainwaveconsulting.co.in:8081",
        "http://bwc-97.brainwaveconsulting.co.in:8090",
        "http://bwc-97.brainwaveconsulting.co.in:8088"
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    },
    proxy: {
      '/travel-management': {
        target: 'http://bwc-97.brainwaveconsulting.co.in:8090',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('✈️ Proxying request to:', `${options.target}${proxyReq.path}`);
            // Add CORS headers to the proxied request
            proxyReq.setHeader('Origin', 'http://bwc-97.brainwaveconsulting.co.in:8090');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Override backend CORS headers
            proxyRes.headers['Access-Control-Allow-Origin'] = 'http://bwc-72.brainwaveconsulting.co.in:9000';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
          });
        },
      },
      '/api': {
        target: 'http://bwc-97.brainwaveconsulting.co.in:8081',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://bwc-97.brainwaveconsulting.co.in:8081',
        changeOrigin: true,
        secure: false,
      },
      '/travel-desk-proxy': {
        target: 'http://bwc-97.brainwaveconsulting.co.in:8088',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/travel-desk-proxy/, ''),
      },
       '/pms': {
        target: 'http://bwc-97.brainwaveconsulting.co.in:8082',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('📋 Proxying PMS request to:', `${options.target}${proxyReq.path}`);
            proxyReq.setHeader('Origin', 'http://bwc-97.brainwaveconsulting.co.in:8082');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'http://bwc-72.brainwaveconsulting.co.in:9000';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
        },
      },
      // ✅ ADDED EMS PROXY (for employee data)
      '/ems': {
        target: 'http://bwc-97.brainwaveconsulting.co.in:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('👤 Proxying EMS request to:', `${options.target}${proxyReq.path}`);
            proxyReq.setHeader('Origin', 'http://bwc-97.brainwaveconsulting.co.in:8080');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'http://bwc-72.brainwaveconsulting.co.in:9000';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
        },
      },
      
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});