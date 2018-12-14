module.exports = {
  displayName: 'unit',
  rootDir: '../',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/*.constant.js',
    '!**/*.config.js',
    '!**/*.{integration}.test.{js,jsx}',
    '!**/*.mock.js',
    '!**/index.js',
    '!src/*.js',
    '!src/.*.js'
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 76,
      branches: 73, // TODO refactor, get coverage up
      lines: 77,
      functions: 78
    }
  },
  coverageReporters: process.env.CI ? [
    'html',
    'text'
  ] : ['lcov'],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/file-mock.js',
    '\\.(svg)$': '<rootDir>/test/file-svg-mock.js'
  },
  setupFiles: [
    'raf/polyfill',
    './test/setup-jest.js'
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  testMatch: [
    '**/!(*.integration).test.js?(x)'
    // Do match:
    // foo.test.jsx
    // barService.test.js
    // Do not match:
    // fooService.jsx
    // foo.integration.test.jsx
  ],
  testURL: 'http://localhost:8080/',
  testEnvironment: 'jest-environment-jsdom-global',
  testPathIgnorePatterns: [
    '/modules/',
    '/node_modules/'
  ],
  watchPathIgnorePatterns: [
    '/modules/'
  ]
};
