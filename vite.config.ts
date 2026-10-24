import { dirname, resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'

function sourceTextPlugin(): Plugin {
  return {
    name: 'component-library-source-text',
    enforce: 'pre',
    resolveId(source, importer) {
      const queryIndex = source.indexOf('?')
      if (queryIndex === -1 || !source.slice(queryIndex + 1).split('&').includes('source')) {
        return null
      }

      const sourcePath = source.slice(0, queryIndex)
      const importerPath = importer?.split('?')[0]
      const resolvedPath = importerPath
        ? resolve(dirname(importerPath), sourcePath)
        : resolve(sourcePath)

      return `\0component-library-source:${resolvedPath}.js`
    },
    load(id) {
      const prefix = '\0component-library-source:'
      if (!id.startsWith(prefix)) {
        return null
      }

      const filePath = id.slice(prefix.length, -'.js'.length)
      return `export default ${JSON.stringify(readFileSync(filePath, 'utf8'))}`
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [sourceTextPlugin(), react()],
  publicDir: mode === 'demo' ? 'public' : false,
  css: {
    modules: {
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },
  build:
    mode === 'demo'
      ? { outDir: 'dist-demo' }
      : {
          lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            name: 'ComponentLibrary',
            formats: ['es', 'cjs'],
            fileName: (format) =>
              format === 'es' ? 'componentlibrary.js' : 'componentlibrary.cjs',
            cssFileName: 'componentlibrary',
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
          },
        },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
}))
