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
    port: 9002,
    allowedHosts: [
      "bwc-90.brainwaveconsulting.co.in",
      "bwc-97.brainwaveconsulting.co.in",
      "bwc-72.brainwaveconsulting.co.in"
    ],
    cors: true,
    proxy: {
      '/api': {
        target: 'http://bwc-97.brainwaveconsulting.co.in:8081',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔁 Proxying API request:', req.method, req.url);
            // Forward all headers
            Object.keys(req.headers).forEach(key => {
              proxyReq.setHeader(key, req.headers[key]);
            });
            proxyReq.setHeader('X-Forwarded-Host', 'bwc-72.brainwaveconsulting.co.in:3000');
            proxyReq.setHeader('X-Forwarded-Proto', 'http');
          });
        },
      },
      '/auth': {
        target: 'http://bwc-97.brainwaveconsulting.co.in:8081',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔐 Proxying auth request:', req.method, req.url);
            // Forward all headers
            Object.keys(req.headers).forEach(key => {
              proxyReq.setHeader(key, req.headers[key]);
            });
          });
        },
      },
      '/travel-management': {
        target: 'http://bwc-97.brainwaveconsulting.co.in:8090',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('✈️ Proxying travel management request:', req.method, req.url);
            // Forward all headers
            Object.keys(req.headers).forEach(key => {
              proxyReq.setHeader(key, req.headers[key]);
            });
            proxyReq.setHeader('X-Forwarded-Host', 'bwc-72.brainwaveconsulting.co.in:3000');
            proxyReq.setHeader('X-Forwarded-Proto', 'http');
          });
        },
      },
      '/travel-desk-proxy': {
        target: 'http://BWC-97.brainwaveconsulting.co.in:8088',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          const newPath = path.replace(/^\/travel-desk-proxy/, '');
          console.log('🔄 Proxy rewrite:', path, '→', newPath);
          return newPath;
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🚀 Proxying travel-desk request:', req.method, req.url);
            console.log('📋 Original headers:', req.headers);
            
            // Forward ALL headers from the original request
            Object.keys(req.headers).forEach(key => {
              proxyReq.setHeader(key, req.headers[key]);
            });
            
            // Ensure auth headers are specifically forwarded
            if (req.headers.authorization) {
              console.log('🔐 Forwarding Authorization header');
            }
            if (req.headers.auth_token) {
              console.log('🔐 Forwarding auth_token header');
            }
            if (req.headers['x-auth-token']) {
              console.log('🔐 Forwarding X-Auth-Token header');
            }
            
            proxyReq.setHeader('X-Forwarded-Host', 'bwc-72.brainwaveconsulting.co.in:3000');
            proxyReq.setHeader('X-Forwarded-Proto', 'http');
            proxyReq.setHeader('X-Forwarded-For', req.socket.remoteAddress);
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('📋 Travel-desk response status:', proxyRes.statusCode);
            console.log('📋 Travel-desk response headers:', proxyRes.headers);
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