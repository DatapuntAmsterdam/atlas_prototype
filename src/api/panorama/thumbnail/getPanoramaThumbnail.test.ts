import { mocked } from 'ts-jest/utils'
import { fetchWithToken } from '../../../shared/services/api/api'
import { getPanoramaThumbnail } from './getPanoramaThumbnail'

jest.mock('../../../shared/services/api/api')

const mockedFetchWithToken = mocked(fetchWithToken, true)

describe('fetchPanoramaThumbnail', () => {
  const validResponse = {
    pano_id: 'pano_id',
    heading: 'heading',
    url: 'url',
  }

  it('should return data when getting a response', async () => {
    mockedFetchWithToken.mockReturnValueOnce(Promise.resolve(validResponse))

    await expect(getPanoramaThumbnail({ lat: 123, lng: 321 })).resolves.toEqual({
      id: 'pano_id',
      heading: 'heading',
      url: 'url',
    })

    expect(mockedFetchWithToken).toHaveBeenCalledWith(
      'https://acc.api.data.amsterdam.nl/panorama/thumbnail/?lat=123&lon=321',
    )
  })

  it('should return null when getting an empty response', async () => {
    mockedFetchWithToken.mockReturnValueOnce(Promise.resolve([]))

    await expect(getPanoramaThumbnail({ lat: 123, lng: 321 })).resolves.toEqual(null)
  })

  it('should throw an error when an exception occurs', async () => {
    const error = new Error('Error requesting a panoramic view')
    mockedFetchWithToken.mockReturnValueOnce(Promise.reject(error))

    await expect(
      getPanoramaThumbnail({
        lat: 123,
        lng: 321,
      }),
    ).rejects.toEqual(error)
  })

  it('should add parameters to the request', () => {
    mockedFetchWithToken.mockReturnValueOnce(Promise.resolve(validResponse))

    getPanoramaThumbnail(
      { lat: 123, lng: 321 },
      {
        width: 100,
        fov: 90,
        horizon: 0.4,
        aspect: 1.4,
        radius: 180,
      },
    )

    expect(mockedFetchWithToken).toHaveBeenCalledWith(
      'https://acc.api.data.amsterdam.nl/panorama/thumbnail/?lat=123&lon=321&width=100&fov=90&horizon=0.4&aspect=1.4&radius=180',
    )
  })
})
