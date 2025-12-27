import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'DropdownsJS',
      formats: ['es'],
      fileName: (format) => `dropdowns-js.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom']
    },
  },
})

