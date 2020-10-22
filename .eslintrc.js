module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  extends: ['plugin:prettier/recommended'],
  globals: {
    jsdom: true,
    jasmine: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
  },
  rules: {
    'no-console': 'error',
    'prettier/prettier': 'error',
    'no-underscore-dangle': [
      'error',
      {
        allow: [
          '__BROWSER__',
          '__HOST__',
          '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__',
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
  },
}
