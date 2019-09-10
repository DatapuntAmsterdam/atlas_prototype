module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:jsx-a11y/strict', '../.eslintrc.js', 'prettier/react'],
  env: {
    jest: true,
  },
  plugins: ['jsx-a11y'],
  root: true,
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
    'react/prop-types': [0],
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
}
