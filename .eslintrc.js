module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'plugin:jsx-a11y/strict', 'plugin:prettier/recommended', 'prettier/react'],
  env: {
    jest: true,
    browser: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'jsx-a11y'],
  root: true,
  globals: {
    jsdom: true,
    jasmine: true,
  },
  rules: {
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['a'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
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
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    'react/prop-types': [0],
    'react/jsx-props-no-spreading': [0],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'import/no-extraneous-dependencies': 'off',
    'no-console': 'error',
    'prettier/prettier': 'error',
    'no-underscore-dangle': [
      'error',
      {
        allow: [
          '_bijzondere_rechts_toestand',
          '_grootstedelijkgebied',
          '_display',
          '_embedded',
          '_links',
          '_northEast',
          '_paq',
          '_southWest',
          '_markers',
          '_display',
          '_getStorage',
          '_storage',
          '_keys',
          '_key',
          '_defaultValue',
          '_provider',
        ],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
}
