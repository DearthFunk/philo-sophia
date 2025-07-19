import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Allow unused vars that start with underscore
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Allow any type in some cases
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow empty functions
      '@typescript-eslint/no-empty-function': 'warn',
      // Allow console logs (useful for development)
      
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
    ],
  }
);
