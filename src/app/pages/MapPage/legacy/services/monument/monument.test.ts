import * as api from '../../../../../../shared/services/api/api'
import { fetchByPandId } from './monument'

describe('The monument resource', () => {
  it('can fetch monumenten by pand id', () => {
    const fetchWithTokenMock = jest.spyOn(api, 'fetchWithToken').mockReturnValueOnce(
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

    const promise = fetchByPandId('1').then((response) => {
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

    expect(fetchWithTokenMock).toHaveBeenCalledWith(expect.stringContaining('betreft_pand=1'))
    return promise
  })
})
