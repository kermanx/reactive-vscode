import path from 'node:path'
import { defineConfig } from 'vite'
import Dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    {
      name: 'replace constants',
      enforce: 'pre',
      transform: {
        order: 'pre',
        handler(code, id) {
          if (id.endsWith('.mjs')) {
            return code
              .replaceAll(`getCurrentInstance()`, `null`)
              .replaceAll(`getLifeCycleTarget()`, `null`)
          }
        },
      },
    },
    Dts({
      include: [
        './src/**/*.ts',
        './tsconfig.json',
        './shim.d.ts',
      ],
      rollupTypes: true,
      bundledPackages: ['@vueuse/core', '@vueuse/shared'],
      beforeWriteFile(_, content) {
        return {
          content: content.replaceAll('\'vue\'', '\'@reactive-vscode/reactivity\''),
        }
      },
    }),
  ],
  resolve: {
    alias: {
      vue: path.resolve(__dirname, './src/vue-replacement.ts'),
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['@reactive-vscode/reactivity'],
    },
    minify: false,
  },
})
