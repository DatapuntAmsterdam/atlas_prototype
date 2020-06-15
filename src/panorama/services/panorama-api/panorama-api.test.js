import { fetchWithToken } from '../../../shared/services/api/api'
import {
  getImageDataById,
  getImageDataByLocation,
  getLocationHistoryParams,
  getStreetViewUrl,
  PANORAMA_CONFIG,
} from './panorama-api'

jest.mock('../../../shared/services/api/api')

describe('The Panorama Api', () => {
  beforeEach(() => {
    fetchWithToken.mockImplementation((url) => {
      if (url.includes('near=999,999') || url.includes('###')) {
        return Promise.reject()
      }
      if (url.includes('near=1,1') && url.includes('newest_in_range=true')) {
        return Promise.resolve({
          _embedded: {
            adjacencies: [],
            panoramas: [],
          },
        })
      }

      return Promise.resolve({
        _embedded: {
          adjacencies: [
            {
              pano_id: 'TMX7315120208-000054_pano_0002_000177',
              direction: 116.48,
              distance: 10.14,
              mission_year: 2016,
              cubic_img_baseurl: 'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
              cubic_img_pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
              geometry: {
                type: 'Point',
                coordinates: [4.91359770418102, 52.3747994036985, 46.9912552172318],
              },
              timestamp: '2016-05-19T13:04:15.341110Z',
              _links: {
                cubic_img_preview: {
                  href: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg',
                },
              },
            },
            {
              pano_id: 'TMX7315120208-000054_pano_0002_000177',
              direction: 116.48,
              distance: 10.14,
              mission_year: 2016,
              cubic_img_baseurl: 'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
              cubic_img_pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
              geometry: {
                type: 'Point',
                coordinates: [4.91359770418102, 52.3747994036985, 46.9912552172318],
              },
              timestamp: '2016-05-19T13:04:15.341110Z',
              _links: {
                cubic_img_preview: {
                  href: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg',
                },
              },
            },
          ],
          panoramas: [
            {
              pano_id: 'TMX7315120208-000054_pano_0002_000177',
              direction: 116.48,
              distance: 10.14,
              mission_year: 2016,
              cubic_img_baseurl: 'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
              cubic_img_pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
              geometry: {
                type: 'Point',
                coordinates: [4.91359770418102, 52.3747994036985, 46.9912552172318],
              },
              timestamp: '2016-05-19T13:04:15.341110Z',
              _links: {
                adjacencies: 'http://pano.amsterdam.nl',
                cubic_img_preview: {
                  href: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg',
                },
              },
            },
            {
              pano_id: 'TMX7315120208-000054_pano_0002_000178',
              direction: 127.37,
              distance: 5.25,
              mission_year: 2017,
              cubic_img_baseurl: 'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
              cubic_img_pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
              geometry: {
                type: 'Point',
                coordinates: [4.91359770418102, 52.3747994036985, 46.9912552172318],
              },
              timestamp: '2017-05-19T13:04:15.341110Z',
              _links: {
                adjacencies: 'http://pano.amsterdam.nl',
                cubic_img_preview: {
                  href: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg',
                },
              },
            },
          ],
          _links: {
            href: 'http://pano.amsterdam.nl',
          },
        },
      })
    })
  })

  const prefix = PANORAMA_CONFIG.PANORAMA_ENDPOINT_PREFIX
  const suffix = PANORAMA_CONFIG.PANORAMA_ENDPOINT_SUFFIX

  describe('calls the API for panorama', () => {
    it('with the correct endpoint for id', () => {
      getImageDataById('ABC', {})

      const { newestInRange } = getLocationHistoryParams(null, undefined)

      expect(fetchWithToken).toHaveBeenCalledWith(
        `${process.env.API_ROOT}${prefix}/ABC/${suffix}/?${newestInRange}`,
      )
    })

    it('and returns error if failing for id', () => {
      let response
      getImageDataById('###', {})
        .then((_response_) => {
          response = _response_
        })
        .catch(() => {})

      expect(fetchWithToken).toHaveBeenCalled()
      expect(response).toBe(undefined)
    })
  })

  describe('calls the API for panorama', () => {
    it('with the correct endpoint for location', () => {
      getImageDataByLocation([52, 4])

      const { locationRange, standardRadius, tagsQuery, newestInRange } = getLocationHistoryParams(
        [52, 4],
        null,
      )

      expect(fetchWithToken).toHaveBeenCalledWith(
        `${process.env.API_ROOT}${prefix}` +
          `/?${locationRange}${tagsQuery}&${standardRadius}&${newestInRange}&limit_results=1`,
      )
    })

    it('with the correct endpoint for location if not found, ', () => {
      getImageDataByLocation([1, 1])

      const { locationRange, tagsQuery, standardRadius, newestInRange } = getLocationHistoryParams(
        [1, 1],
        null,
      )

      expect(fetchWithToken).toHaveBeenCalledWith(
        `${process.env.API_ROOT}${prefix}` +
          `/?${locationRange}${tagsQuery}&${standardRadius}&${newestInRange}&limit_results=1`,
      )
    })

    it('and rejects without location array', () => {
      expect(getImageDataByLocation(null)).toBe(null)
    })

    it('and returns error if failing for location', () => {
      let response
      getImageDataByLocation([999, 999], {})
        .then((_response_) => {
          response = _response_
        })
        .catch(() => {})

      expect(fetchWithToken).toHaveBeenCalled()
      expect(response).toBe(undefined)
    })
  })

  describe('the API will be mapped to the state structure', () => {
    let response

    beforeEach(() => {
      getImageDataById('ABC', {}).then((_response_) => {
        response = _response_
      })
    })

    it('converts date string to Javascript date format', () => {
      expect(response.date).toEqual(new Date('2016-05-19T13:04:15.341110Z'))
    })

    it('maps hotspot data to proper subset', () => {
      expect(response.hotspots).toEqual([
        {
          id: 'TMX7315120208-000054_pano_0002_000177',
          heading: 116.48,
          distance: 10.14,
          year: 2016,
        },
      ])
    })

    it('maps a geoJSON Point to a location in a custom formatted [lat, lng] Array notation', () => {
      expect(response.location).toEqual([52.3747994036985, 4.91359770418102])
    })

    it('fetches the cubic image', () => {
      expect(response.image).toEqual({
        baseurl: 'http://pano.amsterdam.nl/all/cubic/abf123/base.jpg',
        pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
        preview: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg',
      })
    })
  })

  describe('the history selection', () => {
    it("will make 'getImageDataByLocation' use another endpoint", () => {
      const history = { year: 2020, missionType: 'WOZ' }
      getImageDataByLocation([52, 4], history)

      const { tagsQuery, locationRange, standardRadius, newestInRange } = getLocationHistoryParams(
        [52, 4],
        history,
      )

      expect(fetchWithToken).toHaveBeenCalledWith(
        `${process.env.API_ROOT}${prefix}` +
          `/?${locationRange}${tagsQuery}&${standardRadius}&${newestInRange}&limit_results=1`,
      )
    })

    it("will make 'getImageDataById' use another endpoint", () => {
      const history = { year: 2020, missionType: 'WOZ' }
      getImageDataById('ABC', history)

      const { tagsQuery, newestInRange } = getLocationHistoryParams(null, history)

      expect(fetchWithToken).toHaveBeenCalledWith(
        `${process.env.API_ROOT}${prefix}/ABC/${suffix}/?${newestInRange}${tagsQuery}`,
      )
    })

    it('will not change the endpoint when falsy', () => {
      getImageDataByLocation([42, 4], null)
      const { locationRange, standardRadius, newestInRange, tagsQuery } = getLocationHistoryParams(
        [52, 4],
        null,
      )

      expect(fetchWithToken).toHaveBeenCalledWith(
        `${process.env.API_ROOT}${prefix}` +
          `/?${locationRange}${tagsQuery}&${standardRadius}&${newestInRange}&limit_results=1`,
      )

      getImageDataById('ABC', 0)

      expect(fetchWithToken).toHaveBeenCalledWith(
        `${process.env.API_ROOT}${prefix}/ABC/${suffix}/?${newestInRange}`,
      )
    })
  })

  describe('the external streeview url', () => {
    const location = [2, 3]
    const heading = 10

    it('should return an url to google streeview', () => {
      expect(getStreetViewUrl(location, heading)).toBe(
        `http://maps.google.com/maps?q=&layer=c&cbll=${location[0]},${location[1]}&cbp=11,${heading},0,0,0`,
      )
    })
  })
})
