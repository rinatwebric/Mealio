import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      // A feature or widget used by exactly one page is still a valid FSD slice.
      // Disabling this advisory keeps small, single-purpose slices explicit.
      'fsd/insignificant-slice': 'off',
    },
  },
])