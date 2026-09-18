import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/sebthms/',
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: [
        'index.html',
        '404.html',
        'mentions-legales.html',
        'politique-confidentialite.html',
      ],
    },
  },
})
