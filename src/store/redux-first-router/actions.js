import { ROUTER_NAMESPACE, routing } from '../../app/routes';
import { DATASET_ROUTE_MAPPER, VIEWS as DATASET_VIEWS } from '../../shared/ducks/data-selection/constants';
import PARAMETERS from '../parameters';
import { VIEWS as DATA_SEARCH_VIEW } from '../../shared/ducks/data-search/constants';
import { VIEWS as PANORAMA_VIEWS } from '../../panorama/ducks/constants';
import { VIEWS } from '../../map/ducks/map/map';
import { DETAIL_VIEW } from '../../shared/ducks/detail/constants';

export const preserveQuery = (action, additionalParams = null) => ({
  ...action,
  meta: {
    ...(action.meta) ? action.meta : {},
    preserve: true,
    additionalParams
  }
});

export const shouldResetState = (action, allowedRoutes = []) => (action.type &&
  action.type.startsWith(ROUTER_NAMESPACE) &&
  allowedRoutes.every((route) => !action.type.includes(route))
);

export const toDataDetail = (id, type, subtype, additionalParams = null) => preserveQuery({
  type: routing.dataDetail.type,
  payload: {
    type,
    subtype,
    id: `id${id}`
  },
  meta: {
    tracking: true
  }
}, additionalParams);

export const toGeoSearch = (location, view = DATA_SEARCH_VIEW.LIST) => preserveQuery({
  type: routing.dataGeoSearch.type
}, {
  [PARAMETERS.LOCATION]: location,
  [PARAMETERS.VIEW]: view
});

export const toDataSearchQuery = (additionalParams = null, skipFetch = false) => ({
  type: routing.dataQuerySearch.type,
  meta: {
    skipFetch,
    additionalParams
  }
});

export const toMap = () => ({
  type: routing.home.type,
  meta: {
    additionalParams: { view: VIEWS.MAP }
  }
});

export const toPanorama = (id, additionalParams = null) => ({
  type: routing.panorama.type,
  payload: {
    id
  },
  meta: {
    preserve: true,
    additionalParams
  }
});

export const toPanoramaAndPreserveQuery = (id, heading, reference = []) => toPanorama(id, {
  heading,
  ...(reference.length === 3 ? { [PARAMETERS.REFERENCE]: reference } : {}),
  [PARAMETERS.VIEW]: PANORAMA_VIEWS.MAP_PANO
});

export const extractIdEndpoint = (endpoint) => {
  const matches = endpoint.match(/\/([\w-]+)\/?$/);
  return matches[1];
};
const getDetailPageData = (endpoint) => {
  const matches = endpoint.match(/(\w+)\/([\w-]+)\/([\w\.-]+)\/?$/); // eslint-disable-line no-useless-escape
  return {
    type: matches[1],
    subtype: matches[2],
    id: matches[3]
  };
};
export const toDetailFromEndpoint = (endpoint, view) => {
  const { type, subtype, id } = getDetailPageData(endpoint);
  return toDataDetail(id, type, subtype, {
    [PARAMETERS.VIEW]: view
  });
};
export const pageTypeToEndpoint = (type, subtype, id) => {
  let endpoint = 'https://acc.api.data.amsterdam.nl/';
  endpoint += `${type}/${subtype}/${id}/`; // TODO: refactor, get back-end to return detail as detail GET not listing!
  return endpoint;
};
export const toDataSearchCategory = (searchQuery, category) => ({
  type: routing.dataSearchCategory.type,
  payload: {
    category
  },
  meta: {
    additionalParams: {
      [PARAMETERS.QUERY]: searchQuery
    }
  }
});
export const toDatasets = () => ({ type: routing.datasets.type });
export const toDatasetSearch = (additionalParams = null, skipFetch = false) => ({
  type: routing.searchDatasets.type,
  meta: {
    skipFetch,
    preserveQuery: true,
    additionalParams
  }
});
export const toDatasetsWithFilter = (additionalParams = {}, preserve = false) => ({
  type: routing.datasets.type,
  meta: {
    additionalParams,
    preserve
  }
});
export const toDataSuggestion = (payload) => {
  const { type, subtype, id } = getDetailPageData(payload.endpoint);
  return {
    type: routing.dataDetail.type,
    payload: {
      type,
      subtype,
      id: `id${id}`
    },
    meta: {
      additionalParams: {
        [PARAMETERS.VIEW]: DETAIL_VIEW.MAP_DETAIL
      },
      tracking: {
        category: payload.category,
        event: 'auto-suggest',
        query: payload.typedQuery
      }
    }
  };
};
export const toDatasetSuggestion = (payload) => ({
  type: routing.datasetsDetail.type,
  payload,
  meta: {
    tracking: {
      event: 'auto-suggest',
      query: payload.typedQuery
    }
  }
});

export const toDatasetPage = (dataset) => ({
  type: DATASET_ROUTE_MAPPER[dataset]
});
export const toDatasetsTableWithFilter = (datasetType, filter) => ({
  type: datasetType,
  meta: {
    additionalParams: {
      [PARAMETERS.FILTERS]: filter,
      [PARAMETERS.VIEW]: DATASET_VIEWS.TABLE
    }
  }
});
