import { defineConfig } from 'vite';
export default defineConfig({
    base: "/delly-tables/",
    build: {
        outDir: 'dist',
        emptyOutDir: true
    },
    server: {
        open: true
    }
});
