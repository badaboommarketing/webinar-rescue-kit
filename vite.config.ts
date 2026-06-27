import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative assets keep the static build portable across Vercel and GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
})
