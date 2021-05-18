import type { GraphQLFormattedError } from 'graphql'
import getErrorsForPath from './getErrorsForPath'

const ERROR_NO_PATH = {
  message: 'Test 1',
}

const ERROR_SHORT_PATH = {
  message: 'Test 2',
  path: ['foo', 1, 'bar'],
}

const ERROR_LONG_PATH = {
  message: 'Test 3',
  path: ['foo', 1, 'bar', 'buzz'],
}

const TEST_ERRORS: GraphQLFormattedError[] = [ERROR_NO_PATH, ERROR_SHORT_PATH, ERROR_LONG_PATH]

describe('getErrorsForPath', () => {
  it('should ignore errors that have no path', () => {
    expect(getErrorsForPath(TEST_ERRORS, ['no', 'result'])).toEqual([])
  })

  it('should match errors with a partial path', () => {
    expect(getErrorsForPath(TEST_ERRORS, ['foo', 1, 'bar'])).toEqual([
      ERROR_SHORT_PATH,
      ERROR_LONG_PATH,
    ])
  })

  it('should match errors with an exact path', () => {
    expect(getErrorsForPath(TEST_ERRORS, ['foo', 1, 'bar'], true)).toEqual([ERROR_SHORT_PATH])
    expect(getErrorsForPath(TEST_ERRORS, ['foo', 1, 'bar', 'buzz'], true)).toEqual([
      ERROR_LONG_PATH,
    ])
  })
})
