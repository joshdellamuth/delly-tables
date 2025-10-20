import { defineConfig } from 'vite'
import { resolve } from 'path';

export default defineConfig({
    base: "/delly-tables/",
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin.html'),
            }
        }
    },
    server: {
        open: true
    }
});