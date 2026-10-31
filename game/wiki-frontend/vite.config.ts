import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
  base: './',
  plugins: [react(), tailwindcss(), {
    name: 'production-csp',
    transformIndexHtml: () => command === 'build' ? [{
      tag: 'meta',
      attrs: { 'http-equiv': 'Content-Security-Policy', content: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'" },
      injectTo: 'head-prepend',
    }] : [],
  }],
  server: {
    host: '127.0.0.1',
    proxy: {
      '/data': 'http://127.0.0.1:8767',
      '/sprites': 'http://127.0.0.1:8767',
      '/assets': 'http://127.0.0.1:8767',
      '/LICENSES.html': 'http://127.0.0.1:8767',
      '/style.css': 'http://127.0.0.1:8767',
      '/wiki': 'http://127.0.0.1:8767',
      '/patcher-source': {
        target: 'http://127.0.0.1:8767',
        rewrite: (path) => path.replace(/^\/patcher-source/, ''),
      },
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
}));
