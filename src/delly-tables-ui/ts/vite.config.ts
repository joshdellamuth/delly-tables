import { defineConfig } from 'vite'

export default defineConfig({
  root: '.', // optional if you're in the root
  build: {
    outDir: 'dist'
  },
  server: {
    open: true
  }
})