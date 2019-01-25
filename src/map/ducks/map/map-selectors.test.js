import {
  getActiveBaseLayer,
  getCenter,
  getDrawingMode,
  getMapBoundingBox,
  getMapCenter,
  getMapOverlays,
  getMapZoom,
  getRdGeoJsons,
  getGeometry,
  getShapeDistanceTxt,
  isMarkerActive,
  isMapLoading,
  isMapPanelActive
} from './map-selectors';
import { getGeoJson as getDetailGeoJson } from '../detail/map-detail';
import { getPanoramaLocation } from '../../../panorama/ducks/selectors';
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection';
import { isLoading } from '../../../shared/ducks/data-selection/selectors';

jest.mock('../../../shared/ducks/selection/selection');
jest.mock('../../../shared/ducks/data-selection/selectors');
jest.mock('../../../shared/ducks/data-search/selectors');
jest.mock('../../../panorama/ducks/selectors');
jest.mock('../detail/map-detail');
describe('Map Selectors', () => {
  const detail = {};
  const map = {
    baseLayer: 'baseLayer',
    boundingBox: {},
    drawingMode: 'draw',
    viewCenter: true,
    overlays: [{ overlay: '' }],
    zoom: 2,
    selectedLocation: '123,456',
    isLoading: false,
    mapPanelActive: false,
    geometry: [],
    shapeDistanceTxt: 'foo'
  };
  const panorama = {
    location: 'sss'
  };
  const selection = {};

  const state = {
    detail,
    map,
    panorama,
    selection
  };
  isLoading.mockImplementation(() => false);

  describe('simple selectors', () => {
    it('should return the proper result', () => {
      expect(getActiveBaseLayer(state)).toEqual(map.baseLayer);
      expect(getMapZoom(state)).toEqual(map.zoom);
      expect(getMapCenter(state)).toEqual(map.viewCenter);
      expect(getGeometry(state)).toEqual(map.geometry);
      expect(getDrawingMode(state)).toEqual(map.drawingMode);
      expect(getShapeDistanceTxt(state)).toEqual(map.shapeDistanceTxt);
      expect(isMapLoading(state)).toEqual(map.isLoading);
      expect(getMapBoundingBox(state)).toEqual(map.boundingBox);
      expect(isMarkerActive(state)).toEqual(!detail);
      expect(isMapPanelActive(state)).toEqual(map.mapPanelActive);

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
