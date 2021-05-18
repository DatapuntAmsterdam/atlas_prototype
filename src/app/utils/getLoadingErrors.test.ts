import type { GraphQLFormattedError } from 'graphql'
import type { ErrorExtensions } from '../models/graphql'
import getLoadingErrors from './getLoadingErrors'

describe('getLoadingErrors', () => {
  it('should get the loading errors', () => {
    const ERROR_UNAUTHORIZED = {
      extensions: { code: 'UNAUTHORIZED' },
    } as GraphQLFormattedError<ErrorExtensions>
    const ERROR_DIFFERENT_CODE = {
      extensions: { code: 'FOO' },
    } as GraphQLFormattedError<ErrorExtensions>
    const ERROR_NO_EXTENSIONS = {} as GraphQLFormattedError<ErrorExtensions>

    expect(
      getLoadingErrors([ERROR_UNAUTHORIZED, ERROR_DIFFERENT_CODE, ERROR_NO_EXTENSIONS]),
    ).toEqual([ERROR_DIFFERENT_CODE, ERROR_NO_EXTENSIONS])
  })
})
