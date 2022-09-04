/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
      '~~': resolve(__dirname, '.'),
    }
  },
  test: {
    environment: 'happy-dom',
    coverage: {
      reporter: ['lcov', 'text'],
      include: ['src/core/*.ts', 'src/*.ts'],
    }
  }
})