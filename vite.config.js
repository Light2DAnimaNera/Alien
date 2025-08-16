// vite.config.js
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: '/',
  server: {
    open: '/index.html',
  },
  build: {
    target: 'safari13',
    cssTarget: 'safari13',
    sourcemap: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // складываем страницы в отдельный чанк (как было)
          if (id.includes('/src/pages/')) return 'pages'
        },
      },
    },
  },
  plugins: [
    // Копируем любые «свободные» файлы из src/assets в dist/assets
    viteStaticCopy({
      targets: [
        { src: 'src/assets/**/*', dest: 'assets' },
      ],
    }),
  ],
})
