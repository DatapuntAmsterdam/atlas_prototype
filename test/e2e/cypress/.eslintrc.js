module.exports = {
  extends: ['airbnb', '../../../.eslintrc.js'],
  env: {
    'cypress/globals': true,
  },
  plugins: ['cypress'],
  root: true,
  rules: {
    'newline-per-chained-call': 'off',
  },
}
