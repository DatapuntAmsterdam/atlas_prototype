import type { GraphQLFormattedError } from 'graphql'
import type { ErrorExtensions } from '../models/graphql'
import getUnauthorizedLabels from './getUnauthorizedLabels'

describe('getUnauthorizedLabels', () => {
  it('should get the labels of errors that are unauthorized', () => {
    const errors = [
      { extensions: { code: 'UNAUTHORIZED', label: 'TEST 1' } },
      { extensions: { code: 'FUBAR', label: 'TEST 2' } },
      {},
    ] as GraphQLFormattedError<ErrorExtensions>[]

    expect(getUnauthorizedLabels(errors)).toEqual(['test 1'])
  })
})
