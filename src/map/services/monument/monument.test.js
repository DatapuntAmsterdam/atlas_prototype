import { fetchWithToken } from '../../../shared/services/api/api'
import { fetchByPandId } from './monument'

jest.mock('../../../shared/services/api/api')

describe('The monument resource', () => {
  afterEach(() => {
    fetchWithToken.mockReset()
  })

  it('can fetch monumenten by pand id', () => {
    fetchWithToken.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Monument display name 1',
            nummer: 'abc123',
          },
          {
            _display: 'Monument display name 2',
            nummer: 'xyz456',
          },
        ],
      }),
    )

    const promise = fetchByPandId(1).then((response) => {
      expect(response).toEqual([
        {
          _display: 'Monument display name 1',
          nummer: 'abc123',
        },
        {
          _display: 'Monument display name 2',
          nummer: 'xyz456',
        },
      ])
    })

    expect(fetchWithToken.mock.calls[0][0]).toContain('betreft_pand=1')
    return promise
  })
})
