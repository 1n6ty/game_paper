import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  base: '/',
  build: {
    // Вывод сборки будет в папку "static"
    // outDir: 'static',
    // Убираем вложенную папку для ассетов, чтобы все файлы (js, css, изображения) оказались прямо в "static"
    assetsDir: 'static'
  },
  plugins: [react(), svgr({
    svgrOptions: {
      // ...
    },

    // esbuild options, to transform jsx to js
    esbuildOptions: {
      // ...
    },

    // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
    include: "**/*.svg?react",

    // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default no files are ignored.
    exclude: "",
  })]
})
