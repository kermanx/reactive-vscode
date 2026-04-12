// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'packages/reactivity/**/*.ts',
      'docs/slides/slides.md',
    ],
    rules: {
      'e18e/prefer-static-regex': 'off',
      'markdown/require-alt-text': 'off',
      'markdown/heading-increment': 'off',
    },
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
