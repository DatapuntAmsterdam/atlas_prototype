import { mocked } from 'ts-jest/utils'
import { getBouwdossierById } from '.'
import joinUrl from '../../../app/utils/joinUrl'
import environment from '../../../environment'
import { fetchWithToken } from '../../../shared/services/api/api'

jest.mock('../../../shared/services/api/api')

const mockedFetchWithToken = mocked(fetchWithToken, true)

describe('getBouwdossierById', () => {
  const response = [{ foo: 'bar' }]

  it('makes a request and returns the response', async () => {
    mockedFetchWithToken.mockReturnValueOnce(Promise.resolve(response))

    const id = 'foobarbaz'
    await expect(getBouwdossierById(id)).resolves.toEqual(response)

    expect(mockedFetchWithToken).toHaveBeenCalledWith(
      joinUrl([environment.API_ROOT, 'iiif-metadata', 'bouwdossier', id], true),
    )
  })
})
