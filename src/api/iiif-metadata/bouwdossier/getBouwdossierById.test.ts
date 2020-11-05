import { mocked } from 'ts-jest/utils'
import { getBouwdossierById } from '.'
import joinUrl from '../../../app/utils/joinUrl'
import environment from '../../../environment'
import { fetchProxy } from '../../../shared/services/api/api'

jest.mock('../../../shared/services/api/api')

const mockedFetchProxy = mocked(fetchProxy, true)

describe('getBouwdossierById', () => {
  it('makes a request and returns the response', () => {
    const id = 'foobarbaz'
    getBouwdossierById(id)

    expect(mockedFetchProxy).toHaveBeenCalledWith(
      joinUrl([environment.API_ROOT, 'iiif-metadata', 'bouwdossier', id], true),
    )
  })
})
