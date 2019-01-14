import { routing } from '../app/routes';
import { DATA_SEARCH_REDUCER } from '../shared/ducks/data-search/reducer';
import { initialState as dataSearchInitialState } from '../shared/ducks/data-search/constants';
import {
  getDataSelectionPage,
  getDataSelectionView,
  getGeometryFilters
} from '../shared/ducks/data-selection/selectors';
import { DATA_SELECTION } from '../shared/ducks/data-selection/reducer';
import { DATASETS, getPage } from '../shared/ducks/datasets/datasets';
import { DATA, initialState as datasetsDataInitialState } from '../shared/ducks/datasets/data/data';
import { initialState as detailInitialState } from '../shared/ducks/detail/constants';
import { getDetailView } from '../shared/ducks/detail/selectors';
import { DETAIL } from '../shared/ducks/detail/reducer';
import { initialState as mapInitialState, MAP } from '../map/ducks/map/map';
import {
  getCenter,
  getMapOverlays,
  getMapView,
  getMapZoom,
  isMapPanelActive
} from '../map/ducks/map/map-selectors';
import { initialState as panoramaInitialState } from '../panorama/ducks/constants';
import { PANORAMA } from '../panorama/ducks/reducer';
import {
  getPanoramaHeading,
  getPanoramaHistory,
  getPanoramaLocation,
  getPanoramaPitch,
  getPanoramaView,
  getReference
} from '../panorama/ducks/selectors';
import {
  getDataSearchLocation,
  getSearchCategory,
  getSearchQuery, getView
} from '../shared/ducks/data-search/selectors';
import {
  initialState as dataSelectionInitialState,
  PARAMS_TO_VIEWS,
  VIEWS_TO_PARAMS
} from '../shared/ducks/data-selection/constants';
import {
  getFiltersWithoutShape,
  initialState as filterInitialState,
  REDUCER_KEY as FILTER
} from '../shared/ducks/filters/filters';
import {
  initialState as UIInitialState,
  isEmbedded,
  isEmbedPreview,
  isPrintMode,
  UI
} from '../shared/ducks/ui/ui';
import {
  normalizeCoordinate,
  parseLocationString
} from '../shared/services/coordinate-reference-system';
import PARAMETERS from './parameters';
import paramsRegistry from './params-registry';

const routesWithSearch = [
  routing.dataQuerySearch.type,
  routing.dataSearchCategory.type,
  routing.searchDatasets.type
];

const routesWithDataSelection = [
  routing.addresses.type,
  routing.cadastralObjects.type,
  routing.establishments.type
];

const routesWithMapActive = [
  ...routesWithDataSelection,
  routing.home.type,
  routing.dataGeoSearch.type,
  routing.dataDetail.type
];

export default paramsRegistry
  .addParameter(PARAMETERS.QUERY, (routes) => {
    routes.add(routesWithSearch, DATA_SEARCH_REDUCER, 'query', {
      selector: getSearchQuery,
      defaultValue: dataSearchInitialState.query
    });
  })
  .addParameter(PARAMETERS.PAGE, (routes) => {
    routes
      .add(routesWithDataSelection, DATA_SELECTION, 'page', {
        defaultValue: dataSelectionInitialState.page,
        selector: getDataSelectionPage,
        decode: (value) => (Number.isInteger(value) ? parseFloat(value) : value)
      })
      .add(routing.datasets.type, `${DATASETS}.${DATA}`, 'page', {
        defaultValue: datasetsDataInitialState.page,
        selector: getPage,
        decode: (value) => (Number.isInteger(value) ? parseFloat(value) : value)
      });
  })
  .addParameter(PARAMETERS.GEO, (routes) => {
    routes.add(routesWithDataSelection, DATA_SELECTION, 'geometryFilter', {
      selector: getGeometryFilters,
      encode: ({ markers, description }) => {
        if (markers && description) {
          return btoa(JSON.stringify({
            markers: markers.map((latLong) => `${latLong[0]}:${latLong[1]}`).join('|'),
            description
          }));
        }
        return undefined;
      },
      decode: (geo) => {
        let geometryFilter = dataSelectionInitialState.geometryFilter;
        if (geo) {
          const { markers, description } = JSON.parse(atob(geo));
          geometryFilter = {
            markers: markers && markers.length
              ? markers.split('|').map((latLng) => latLng.split(':').map((str) => parseFloat(str)))
              : [],
            description
          };
        }

        return geometryFilter;
      }
    });
  })
  .addParameter(PARAMETERS.VIEW, (routes) => {
    routes
      .add(routesWithDataSelection, DATA_SELECTION, 'view', {
        selector: getDataSelectionView,
        decode: (val) => PARAMS_TO_VIEWS[val],
        encode: (val) => VIEWS_TO_PARAMS[val]
      })
      .add(routing.dataDetail.type, DETAIL, 'view', {
        selector: getDetailView,
        defaultValue: detailInitialState.view
      })
      .add(routing.panorama.type, PANORAMA, 'view', {
        defaultValue: panoramaInitialState.view,
        selector: getPanoramaView
      })
      .add(routing.dataGeoSearch.type, DATA_SEARCH_REDUCER, 'view', {
        defaultValue: dataSearchInitialState.view,
        selector: getView
      })
      .add(routing.home.type, MAP, 'view', {
        defaultValue: mapInitialState.view,
        selector: getMapView
      });
  })
  .addParameter(PARAMETERS.CATEGORY, (routes) => {
    routes.add(routing.dataQuerySearch.type, DATA_SEARCH_REDUCER, 'category', {
      defaultValue: dataSelectionInitialState.category,
      selector: getSearchCategory
    });
  })
  .addParameter(PARAMETERS.VIEW_CENTER, (routes) => {
    routes.add(routesWithMapActive, MAP, 'viewCenter', {
      defaultValue: mapInitialState.viewCenter,
      decode: (val = mapInitialState.viewCenter.join(',')) => val.split(',').map((ltLng) => normalizeCoordinate(parseFloat(ltLng), 7)),
      encode: (selectorResult) => selectorResult.join(','),
      selector: getCenter
    });
  })
  .addParameter(PARAMETERS.ZOOM, (routes) => {
    routes.add(routesWithMapActive, MAP, 'zoom', {
      defaultValue: mapInitialState.zoom,
      decode: (val) => parseFloat(val) || mapInitialState.zoom,
      selector: getMapZoom
    });
  })
  .addParameter(PARAMETERS.LEGEND, (routes) => {
    routes.add(routesWithMapActive, MAP, 'mapPanelActive', {
      defaultValue: mapInitialState.mapPanelActive,
      decode: (val) => val === 'true',
      selector: isMapPanelActive
    });
  })
  .addParameter(PARAMETERS.HEADING, (routes) => {
    routes.add(routing.panorama.type, PANORAMA, 'heading', {
      defaultValue: panoramaInitialState.heading,
      selector: getPanoramaHeading
    });
  })
  .addParameter(PARAMETERS.PANORAMA_SET, (routes) => {
    routes.add(routing.panorama.type, PANORAMA, 'history', {
      defaultValue: panoramaInitialState.history,
      selector: getPanoramaHistory,
      encode: (selectorResult) => `${selectorResult.year}.${selectorResult.missionType}`,
      decode: (val) => {
        if (val) {
          const [year, missionType] = val.split('.');
          return {
            year: parseFloat(year),
            missionType,
            label: `Alleen ${year} ${missionType}`,
            layerName: `pano${year}${missionType}`
          };
        }
        return val;
      }
    });
  })
  .addParameter(PARAMETERS.PITCH, (routes) => {
    routes.add(routing.panorama.type, PANORAMA, 'pitch', {
      defaultValue: panoramaInitialState.pitch,
      selector: getPanoramaPitch
    });
  })
  .addParameter(PARAMETERS.FILTERS, (routes) => {
    routes.add([
      routing.datasets.type,
      ...routesWithSearch,
      ...routesWithDataSelection
    ], FILTER, 'filters', {
      defaultValue: filterInitialState.filters,
      decode: (val) => {
        try {
          return Object.assign({}, JSON.parse(atob(val)));
        } catch (e) {
          return {};
        }
      },
      selector: getFiltersWithoutShape,
      encode: (selectorResult = {}) => (
        Object.keys(selectorResult).length ? btoa(JSON.stringify(selectorResult)) : undefined
      )
    });
  })
  .addParameter(PARAMETERS.REFERENCE, (routes) => {
    routes.add(routing.panorama.type, PANORAMA, 'reference', {
      defaultValue: panoramaInitialState.reference,
      decode: (val) => (val && val.length ? val.split(',') : panoramaInitialState.reference),
      selector: getReference,
      encode: (selectorResult) => (selectorResult.length ?
          selectorResult.join() :
          panoramaInitialState.reference
      )
    }, false);
  })
  .addParameter(PARAMETERS.EMBED_PREVIEW, (routes) => {
    routes.add(routing.home.type, UI, 'isEmbedPreview', {
      defaultValue: UIInitialState.isEmbedPreview,
      selector: isEmbedPreview,
      encode: (selectorResult) => (selectorResult ? 'true' : 'false'),
      decode: (val) => val === 'true'
    });
  })
  .addParameter(PARAMETERS.EMBED, (routes) => {
    routes.add(routing.home.type, UI, 'isEmbed', {
      defaultValue: UIInitialState.isEmbed,
      selector: isEmbedded,
      encode: (selectorResult) => (selectorResult ? 'true' : 'false'),
      decode: (val) => val === 'true'
    });
  })
  .addParameter(PARAMETERS.PRINT, (routes) => {
    routes.add(routing.home.type, UI, 'isPrintMode', {
      defaultValue: UIInitialState.isPrintMode,
      selector: isPrintMode,
      encode: (selectorResult) => (selectorResult ? 'true' : 'false'),
      decode: (val) => val === 'true'
    });
  })
  .addParameter(PARAMETERS.LAYERS, (routes) => {
    routes.add([
      routing.home.type,
      routing.dataGeoSearch.type,
      routing.dataDetail.type
    ], MAP, 'overlays', {
      defaultValue: mapInitialState.overlays,
      decode: (val) => {
        try {
          return val ? atob(val).split('|').map((obj) => {
            const layerInfo = obj.split(':');
            return { id: layerInfo[0], isVisible: !!parseInt(layerInfo[1], 0) };
          }) : mapInitialState.overlays;
        } catch (e) {
          return mapInitialState.overlays;
        }
      },
      selector: getMapOverlays,
      encode: (selectorResult) => (
        btoa(
          selectorResult.map((overlay) => `${overlay.id}:${overlay.isVisible ? 1 : 0}`).join('|')
        )
      )
    });
  })
  .addParameter(PARAMETERS.LOCATION, (routes) => {
    routes
      .add(routing.panorama.type, PANORAMA, 'location', {
        decode: (val) => (val ? val.split(',').map((string) => parseFloat(string)) : panoramaInitialState.location),
        defaultValue: panoramaInitialState.location,
        selector: getPanoramaLocation,
        encode: (selectorResult) => (
          selectorResult ?
            selectorResult.join() :
            panoramaInitialState.location
        )
      })
      .add(routing.dataGeoSearch.type, DATA_SEARCH_REDUCER, 'geoSearch', {
        defaultValue: null,
        selector: getDataSearchLocation,
        encode: (selectorResult) => {
          if (selectorResult && selectorResult.latitude) {
            return `${selectorResult.latitude},${selectorResult.longitude}`;
          } else if (Array.isArray(selectorResult)) {
            return selectorResult.join();
          }
          return undefined;
        },
        decode: (val) => {
          if (val) {
            const latLngObj = parseLocationString(val);
            return {
              latitude: latLngObj.lat,
              longitude: latLngObj.lng
            };
          }
          return null;
        }
      });
  });
