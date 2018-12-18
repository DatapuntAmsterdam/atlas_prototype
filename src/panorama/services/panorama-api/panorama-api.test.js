import { getByUrl } from '../../../shared/services/api/api';
import {
  getImageDataById,
  getImageDataByLocation,
  PANORAMA_CONFIG,
  getLocationHistoryParams
} from './panorama-api';
import sharedConfig from '../../../shared/services/shared-config/shared-config';

jest.mock('../../../shared/services/api/api');

describe('The panoramaApi Factory', () => {
  beforeEach(() => {
    getByUrl.mockImplementation(() => Promise.resolve({
      image_sets: {
        cubic: {
          pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
          preview: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg'
        }
      },
      geometrie: {
        type: 'Point',
        coordinates: [
          4.91359770418102,
          52.3747994036985,
          46.9912552172318
        ]
      },
      adjacent: [
        {
          pano_id: 'TMX7315120208-000054_pano_0002_000177',
          heading: 116.48,
          distance: 10.14,
          year: 2016
        },
        {
          pano_id: 'TMX7315120208-000054_pano_0002_000178',
          heading: 127.37,
          distance: 5.25,
          year: 2017
        }
      ],
      timestamp: '2016-05-19T13:04:15.341110Z'
    }));
  });

  it('calls the API factory with the correct endpoint for id', () => {
    getImageDataById('ABC');
    expect(getByUrl).toHaveBeenCalledWith(`${sharedConfig.API_ROOT}${PANORAMA_CONFIG.PANORAMA_ENDPOINT_ALL}ABC/`); // Test the last argument for being a promise lateron
  });

  it('calls the API factory with the correct endpoint for location', () => {
    getImageDataByLocation([52, 4]);
    expect(getByUrl).toHaveBeenCalledWith(`${sharedConfig.API_ROOT}${PANORAMA_CONFIG.PANORAMA_ENDPOINT_ALL}?lat=52&lon=4&radius=100000`);
  });

  it('return null when no straatbeeld is found', async () => {
    getByUrl.mockImplementation(() => Promise.resolve({}));
    const result = await getImageDataByLocation([52, 4]);

    expect(result).toBe(null);
  });

  describe('the API will be mapped to the state structure', () => {
    let response;

    beforeEach(() => {
      getImageDataById('ABC').then((_response_) => {
        response = _response_;
      });
    });

    it('converts date string to Javascript date format', () => {
      expect(response.date).toEqual(new Date('2016-05-19T13:04:15.341110Z'));
    });

    it('maps hotspot data to proper subset', () => {
      expect(response.hotspots).toEqual(
        [{
          id: 'TMX7315120208-000054_pano_0002_000177',
          heading: 116.48,
          distance: 10.14,
          year: 2016
        }, {
          id: 'TMX7315120208-000054_pano_0002_000178',
          heading: 127.37,
          distance: 5.25,
          year: 2017
        }]
      );
    });

    it('maps a geoJSON Point to a location in a custom formatted [lat, lng] Array notation', () => {
      expect(response.location).toEqual([52.3747994036985, 4.91359770418102]);
    });

    it('fetches the cubic image', () => {
      expect(response.image).toEqual({
        pattern: 'http://pano.amsterdam.nl/all/cubic/abf123/{a}/{b}/{c}.jpg',
        preview: 'http://pano.amsterdam.nl/all/cubic/abf123/preview.jpg'
      });
    });
  });

  describe('the history selection', () => {
    it('will make \'getImageDataByLocation\' use another endpoint', () => {
      const year = 2020;
      getImageDataByLocation([52, 4], year);

      expect(getByUrl).toHaveBeenCalledWith(`${sharedConfig.API_ROOT}${PANORAMA_CONFIG.PANORAMA_ENDPOINT_YEAR}${year}/?lat=52&lon=4&radius=100000`);
    });

    it('will make \'getImageDataById\' use another endpoint', () => {
      const year = 2020;
      getImageDataById('ABC', year);

      expect(getByUrl).toHaveBeenCalledWith(
        `${sharedConfig.API_ROOT}${PANORAMA_CONFIG.PANORAMA_ENDPOINT_YEAR}${year}/ABC/`
      );
    });

    it('will not change the endpoint when falsy', () => {
      getImageDataByLocation([52, 4], 0);
      const {
        locationRange,
        yearTypeMission,
        standardRadius,
        largeRadius,
        newestInRange
      } = getLocationHistoryParams([52, 4], 0);

      expect(getByUrl).toHaveBeenCalledWith(
        `${sharedConfig.API_ROOT}${PANORAMA_CONFIG.PANORAMA_ENDPOINT_PREFIX}` +
        `/?${locationRange}${yearTypeMission}&${standardRadius}&${newestInRange}&limit_results=1`
      );

      expect(getByUrl).toHaveBeenCalledWith(
        `${sharedConfig.API_ROOT}${PANORAMA_CONFIG.PANORAMA_ENDPOINT_PREFIX}` +
        `/?${locationRange}${yearTypeMission}&${largeRadius}&${newestInRange}&limit_results=1`
      );

      getImageDataById('ABC', 0);

      expect(getByUrl).toHaveBeenCalledWith(
        `${sharedConfig.API_ROOT}${PANORAMA_CONFIG.PANORAMA_ENDPOINT_PREFIX}ABC/${newestInRange}`
      );
    });
  });
});
