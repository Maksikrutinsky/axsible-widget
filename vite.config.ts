import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'a11y-widget': resolve(__dirname, 'src/main.ts'),
        'a11y-loader': resolve(__dirname, 'src/loader.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist',
    minify: 'esbuild',
  },
});
