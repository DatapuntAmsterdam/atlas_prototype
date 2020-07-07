module.exports = {
  displayName: 'unit',
  rootDir: './',
  collectCoverage: false,
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
      statements: 75,
      branches: 50,
      functions: 67,
      lines: 75,
    },
  },
  coverageReporters: process.env.CI ? ['html', 'text'] : ['lcov'],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/file-mock.js',
    '\\.(svg)$': '<rootDir>/test/file-svg-mock.js',
  },
  setupFiles: ['dotenv/config', 'raf/polyfill', './test/setup-jest.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFilesAfterEnv: ['./test/mocks.js'],
  testURL: 'http://localhost:3000/',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/modules/', '/node_modules/', '/test/'],
  watchPathIgnorePatterns: ['/modules/'],
}
