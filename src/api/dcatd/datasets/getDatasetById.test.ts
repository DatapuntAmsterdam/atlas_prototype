import { mocked } from 'ts-jest/utils'
import joinUrl from '../../../app/utils/joinUrl'
import environment from '../../../environment'
import { fetchWithToken } from '../../../shared/services/api/api'
import { getDatasetById } from './getDatasetById'

jest.mock('../../../shared/services/api/api')

const mockedFetchWithToken = mocked(fetchWithToken, true)

describe('getDatasetById', () => {
  const validResponse = {
    foo: 'bar',
  }

  it('makes an api call and returns the correct response', async () => {
    mockedFetchWithToken.mockReturnValueOnce(Promise.resolve(validResponse))

    await expect(getDatasetById('baz')).resolves.toEqual(validResponse)

    expect(mockedFetchWithToken).toHaveBeenCalledWith(
      joinUrl([environment.API_ROOT, 'dcatd/datasets/baz']),
    )
  })
})
