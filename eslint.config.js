// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'packages/reactivity/**/*.ts',
      'docs/slides/slides.md',
    ],
  },
  {
    files: ['**/*.ts'],
    rules: {
      'node/no-exports-assign': 'off',
      'no-restricted-syntax': 'off',
      'style/lines-between-class-members': 'off',
    },
  },
)
