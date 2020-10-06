import { mocked } from 'ts-jest/utils'
import environment from '../../environment'
import { fetchWithoutToken } from '../../shared/services/api/api'
import { getMetadata } from './getMetadata'

jest.mock('../../shared/services/api/api')

const mockedFetchWithoutToken = mocked(fetchWithoutToken, true)

describe('getMetadata', () => {
  const response = [{ foo: 'bar' }]

  it('makes a request and returns the response', async () => {
    mockedFetchWithoutToken.mockReturnValueOnce(Promise.resolve(response))

    await expect(getMetadata()).resolves.toEqual(response)

    expect(mockedFetchWithoutToken).toHaveBeenCalledWith(`${environment.API_ROOT}metadata/`)
  })
})
