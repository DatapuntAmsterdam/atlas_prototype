module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jsx-a11y/strict',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:cypress/recommended',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  env: {
    jest: true,
    browser: true,
    node: true,
    'cypress/globals': true,
  },
  root: true,
  globals: {
    jsdom: true,
    jasmine: true,
  },
  ignorePatterns: ['public/*'],
  rules: {
    'consistent-return': 'off',
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': 'error',

    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',

    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['*.test.*'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
      },
    },
  ],
}
