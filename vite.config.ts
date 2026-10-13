import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project-site URL: https://mhsaleemalzayat.github.io/BinarySearch/
export default defineConfig({
  plugins: [react()],
  base: '/AlgorithmsLab/',
})
