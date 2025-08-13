import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.vite'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@worker': path.resolve(__dirname, './worker'),
    },
  },
});