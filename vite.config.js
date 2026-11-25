import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this project under /pixabay-gallery/, so assets must be
// base-prefixed. Build output stays in `build/` to keep `gh-pages -d build`.
export default defineConfig({
  base: '/pixabay-gallery/',
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
