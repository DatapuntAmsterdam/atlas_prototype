import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { composeProviders } from 'redux-saga-test-plan/providers';

import watchMapClick, { goToGeoSearch, switchClickAction } from './map-click';
import {
  getActiveMapLayers,
  getLayers,
  getMapPanelLayers
} from '../../ducks/panel-layers/map-panel-layers';
import { SET_MAP_CLICK_LOCATION } from '../../ducks/map/map';
import { getMapZoom } from '../../ducks/map/map-selectors';
import { requestNearestDetails } from '../../../shared/ducks/data-search/actions';
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection';
import { getImageDataByLocation } from '../../../panorama/services/panorama-api/panorama-api';
import { getPage } from '../../../store/redux-first-router/selectors';
import { getViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui';

describe('watchMapClick', () => {
  const action = { type: SET_MAP_CLICK_LOCATION };

  it('should watch "SET_MAP_CLICK_LOCATION" and call switchClickAction', () => {
    testSaga(watchMapClick)
      .next()
      .takeLatestEffect(SET_MAP_CLICK_LOCATION, switchClickAction)
      .next(action)
      .isDone();
  });
});

describe('switchClickAction', () => {
  const payload = {
    location: {
      latitude: 52.11,
      longitude: 4.11
    }
  };

  const mockMapLayers = [
    {
      id: 'kot',
      url: 'maps/brk?service=wms',
      layers: [
        'kadastraal_object',
        'kadastraal_object_label'
      ],
      detailUrl: 'geosearch/search/',
      detailItem: 'kadastraal_object',
      detailIsShape: true
    }
  ];

  const mockPanelLayers = [
    {
      category: 'Geografie: onroerende zaken',
      maxZoom: 16,
      minZoom: 8,
      legendItems: [
        { id: 'bgem', notClickable: true }
      ],
      notClickable: true,
      title: 'Kadastrale perceelsgrenzen',
      url: '/maps/brk?version=1.3.0&service=WMS'
    },
    {
      category: 'Verkeer en infrastructuur',
      id: 'pv',
      notClickable: true,
      layers: ['alle_parkeervakken'],
      legendItems: [
        {
          selectable: false,
          title: 'FISCAAL'
        }
      ],
      maxZoom: 16,
      minZoom: 10,
      title: 'Parkeervakken - Fiscale indeling',
      url: '/maps/parkeervakken?version=1.3.0&service=WMS'
    }
  ];

  const matchingPanelLayer = {
    id: 'kot',
    maxZoom: 16,
    minZoom: 8,
    legendItems: [
      { id: 'kot', notClickable: true }
    ],
    notClickable: true,
    title: 'Kadastrale perceelsgrenzen',
    url: '/maps/brk?version=1.3.0&service=WMS'
  };

  const mapPanelLayersWithSelection = [...mockPanelLayers, matchingPanelLayer];

  const providePage = ({ selector }, next) => (selector === getPage ? null : next());
  const provideViewMode = ({ selector }, next) => (selector === getViewMode ? 'split' : next());
  const provideDataSelectionView = ({ selector }, next) => (selector === getViewMode ?
      null :
      next()
  );

  const provideMapLayers = ({ selector }, next) => (
    selector === getActiveMapLayers ||
    selector === getLayers
      ? mockMapLayers : next()
  );

  const provideMapZoom = ({ selector }, next) => (
    selector === getMapZoom ? 8 : next()
  );

  const provideSelectionTypePoint = ({ selector }, next) => (
    selector === getSelectionType ? SELECTION_TYPE.POINT : next()
  );

  const provideSelectionTypePanorama = ({ selector }, next) => (
    selector === getSelectionType ? SELECTION_TYPE.PANORAMA : next()
  );

  it('should dispatch the REQUEST_NEAREST_DETAILS when the panorama is not enabled', () => {
    const provideMapPanelLayers = ({ selector }, next) => (
      selector === getMapPanelLayers ? mapPanelLayersWithSelection : next()
    );
    return expectSaga(switchClickAction, { payload })
      .provide({
        select: composeProviders(
          providePage,
          provideDataSelectionView,
          provideMapLayers,
          provideMapZoom,
          provideViewMode,
          provideMapPanelLayers,
          provideSelectionTypePoint
        )
      })
      .put(requestNearestDetails({
        location: payload.location,
        layers: [...mockMapLayers],
        zoom: 8,
        view: VIEW_MODE.SPLIT
      }))
      .run();
  });

  it('should dispatch setGeolocation when the panorama is not enabled and there is no panelLayer found ', () => {
    const provideMapPanelLayers = ({ selector }, next) => (
      selector === getActiveMapLayers ||
      selector === getLayers
        ? [] : next()
    );

    return expectSaga(switchClickAction, { payload })
      .provide({
        select: composeProviders(
          providePage,
          provideDataSelectionView,
          provideViewMode,
          provideMapZoom,
          provideMapPanelLayers,
          provideSelectionTypePoint
        )
      })
      .call(goToGeoSearch, payload.location)
      .run();
  });

  it('should get panorama by location when in pano mode', () => {
    const provideCallGetImageDataByLocation = ({ fn }, next) => {
      if (fn === getImageDataByLocation) {
        return {
          id: '123',
          location: Object.keys(payload.location).map((key) => payload.location[key])
        };
      }
      return next();
    };

    return expectSaga(switchClickAction, { payload })
      .provide({
        select: composeProviders(
          provideSelectionTypePanorama
        ),
        call: provideCallGetImageDataByLocation
      })
      .run();
  });
});
