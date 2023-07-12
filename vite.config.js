import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        firstSimulation: resolve(__dirname, 'first-simulation/index.html'),
      },
    },
  },
  optimizeDeps: {
    exclude: ['@babylonjs/havok', 'babylonjs-loaders'],
  },
})
