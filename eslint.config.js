import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['**/server/**'],
              message: 'Modular Monolith Governance: Direct importing of server/backend codebase files into React UI domain is strictly prohibited.',
            },
          ],
        },
      ],
    },
  },
  {
    // SECURITY GUARD: never give secret-like env vars a hardcoded fallback, e.g.
    //   process.env.JWT_SECRET || 'some-literal'   <- forbidden
    // Secrets must come from the environment (see server/src/config/env.ts).
    files: ['server/**/*.{ts,js}', 'tests/**/*.{ts,js}'],
    ignores: ['server/node_modules/**', 'server/prisma/generated/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "LogicalExpression[operator=/^(\\|\\||\\?\\?)$/][right.type='Literal'][right.value=/.+/] MemberExpression[object.property.name='env'][property.name=/SECRET|PASSWORD|PRIVATE_KEY|API_KEY|TOKEN/]",
          message:
            'Do not give secret-like environment variables a hardcoded fallback. Read them via server/src/config/env.ts and fail fast when missing.',
        },
      ],
    },
  },
])
