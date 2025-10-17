import { defineConfig } from 'vite';
export default defineConfig({
    root: '/delly-tables/', // optional if you're in the root
    build: {
        outDir: 'dist'
    },
    server: {
        open: true
    }
});
