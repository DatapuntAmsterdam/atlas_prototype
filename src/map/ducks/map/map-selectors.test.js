import {
  getActiveBaseLayer,
  getCenter,
  getMapCenter,
  getMapOverlays,
  getMapZoom,
  getRdGeoJsons
} from './map-selectors';
import { getGeoJson as getDetailGeoJson } from '../detail/map-detail';
import { getPanoramaLocation } from '../../../shared/ducks/panorama/panorama';
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection';

jest.mock('../../../shared/ducks/selection/selection');
jest.mock('../../../shared/ducks/data-search/selectors');
jest.mock('../../../shared/ducks/panorama/panorama');
jest.mock('../detail/map-detail');
describe('Map Selectors', () => {
  const map = {
    baseLayer: 'baseLayer',
    viewCenter: true,
    overlays: [{ overlay: '' }],
    zoom: 2,
    selectedLocation: '123,456'
  };
  const panorama = {
    location: 'sss'
  };
  const selection = {};

  const state = {
    map,
    panorama,
    selection
  };

  describe('simple selectors', () => {
    it('should return the proper result', () => {
      expect(getActiveBaseLayer(state)).toEqual(map.baseLayer);
      expect(getMapZoom(state)).toEqual(map.zoom);
      expect(getMapCenter(state)).toEqual(map.viewCenter);

      getRdGeoJsons(state);
      expect(getDetailGeoJson).toHaveBeenCalledWith(state);
    });
  });

  describe('getMapOverlays', () => {
    it('should return selected layers', () => {
      getSelectionType.mockImplementation(() => SELECTION_TYPE.NONE);
      expect(getMapOverlays({
        ...state,
        some: 'state' // force the state to change so it clears the cache
      })).toEqual(map.overlays);
    });
  });

  describe('getCenter selector', () => {
    beforeEach(() => {
      getCenter.resetRecomputations();
    });

    it('should return the state', () => {
      expect(getCenter(state)).toEqual(map.viewCenter);
    });

    it('should return panoramaLocation when it\'s defined', () => {
      getPanoramaLocation.mockImplementation(() => 'panorama location');
      expect(getCenter({
        ...state,
        some: 'state' // force the state to change so it clears the cache
      })).toEqual('panorama location');
    });
  });
});
