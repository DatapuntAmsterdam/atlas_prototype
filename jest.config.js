module.exports = {
  displayName: 'unit',
  rootDir: './',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/*.constant.js',
    '!**/*.config.js',
    '!**/*.{integration}.test.{js,jsx}',
    '!**/*.mock.js',
    '!**/index.js',
    '!**/angularModules.js',
    '!src/*.js',
    '!src/.*.js',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 79,
      branches: 70,
      functions: 74,
      lines: 80,
    },
  },
  coverageReporters: process.env.CI ? ['html', 'text'] : ['lcov'],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/file-mock.js',
    '\\.(svg)$': '<rootDir>/test/file-svg-mock.js',
  },
  setupFiles: ['raf/polyfill', './test/setup-jest.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testMatch: [
    '**/*.test.js?(x)',
  ],
  setupFilesAfterEnv: ["./test/mocks.js"],
  testURL: 'http://localhost:8080/',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/modules/', '/node_modules/', '/test/'],
  watchPathIgnorePatterns: ['/modules/'],
}
