import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        register: 'register.html',
        catalog: 'catalog.html',
        product: 'product.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
