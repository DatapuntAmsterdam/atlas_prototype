module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}'
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 24,
      branches: 38,
      functions: 38,
      lines: 32
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
    '**/!(*.visual).test.jsx',
    '**/*.test.js'
    // Do match
    // foo.test.jsx
    // barService.test.js
    // Do not match:
    // foo.visual.test.jsx
  ],
  testEnvironment: 'jest-environment-jsdom-global',
  testPathIgnorePatterns: [
    '/e2e/',
    '/modules/',
    '/node_modules/'
  ],
  watchPathIgnorePatterns: [
    '/modules/'
  ]
};
