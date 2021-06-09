import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/js-with-ts',
  displayName: 'unit',
  rootDir: './',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.constant.js',
    '!**/*.config.js',
    '!**/*.{integration}.test.{js,jsx}',
    '!**/*.mock.js',
    '!**/index.ts',
    '!src/*.js',
    '!src/.*.js',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 71,
      branches: 45,
      lines: 71,
      functions: 57,
    },
  },
  coverageReporters: process.env.CI ? ['text'] : ['lcov'],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/file-mock.ts',
    '\\.(svg)$': '<rootDir>/test/file-svg-mock.ts',
  },
  setupFiles: ['./test/setup-jest.ts'],
  setupFilesAfterEnv: ['./test/mocks.ts', './test/setup-env.ts'],
  testURL: 'http://localhost:3000/',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/test/'],
  transformIgnorePatterns: ['node_modules/(?!escape-string-regexp)'],
}

export default config
