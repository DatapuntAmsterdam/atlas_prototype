module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  displayName: 'unit',
  rootDir: './',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.constant.js',
    '!**/*.config.js',
    '!**/*.{integration}.test.{js,jsx}',
    '!**/*.mock.js',
    '!**/index.js',
    '!src/*.js',
    '!src/.*.js',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 59,
      branches: 35,
      functions: 50,
      lines: 60,
    },
  },
  coverageReporters: process.env.CI ? ['text'] : ['lcov'],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/file-mock.js',
    '\\.(svg)$': '<rootDir>/test/file-svg-mock.js',
  },
  setupFiles: ['raf/polyfill', './test/setup-jest.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFilesAfterEnv: ['./test/mocks.js'],
  // will be uncommented once the base branch is ready for merge
  // setupFilesAfterEnv: ['./test/mocks.js', './test/setup-env.js'],
  testURL: 'http://localhost:3000/',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/modules/', '/node_modules/', '/test/'],
  watchPathIgnorePatterns: ['/modules/'],
}
