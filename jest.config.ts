import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  displayName: 'unit',
  rootDir: './',
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 71,
      branches: 44,
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
