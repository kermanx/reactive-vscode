import { defineConfig } from 'vite'
import Dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
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
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vscode', '@reactive-vscode/reactivity'],
    },
  },
})
