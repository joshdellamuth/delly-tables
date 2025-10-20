import { defineConfig } from 'vite'
import { resolve } from 'path';

export default defineConfig({
    base: "/delly-tables/",
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                /* Tells Vite you have two pages in your app and traces their dependencies for bundling. */
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin.html'),
            }
        }
    },
    server: {
        open: true
    }
});