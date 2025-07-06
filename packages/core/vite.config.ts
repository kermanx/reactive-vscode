import { defineConfig } from 'vite'
import Dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    {
      name: 'replace dev flag',
      enforce: 'pre',
      transform: {
        order: 'pre',
        handler(code, id) {
          if (id.endsWith('.ts'))
            return code.replaceAll(`__DEV__`, `!!(process.env.NODE_ENV !== "production")`)
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
      beforeWriteFile(_, content) {
        return {
          content: content.replaceAll('\'@vue/reactivity\'', '\'@reactive-vscode/reactivity\''),
        }
      },
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vscode', '@reactive-vscode/reactivity'],
    },
  },
})
