import { ROUTER_NAMESPACE, routing } from '../../app/routes';
import { DATASET_ROUTE_MAPPER } from '../../shared/ducks/data-selection/constants';
import PARAMETERS from '../parameters';
import { VIEW_MODE } from '../../shared/ducks/ui/ui';

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

export const toDataDetail = (detailReference, additionalParams = null, tracking = true) => {
  const [id, type, subtype] = detailReference;
  return preserveQuery({
    type: routing.dataDetail.type,
    payload: {
      type,
      subtype,
      id: `id${id}`
    },
    meta: {
      tracking,
      forceSaga: true
    }
  }, additionalParams);
};

export const toGeoSearch = (additionalParams) => preserveQuery({
  type: routing.dataGeoSearch.type,
  meta: {
    forceSaga: true
  }
}, additionalParams);

export const toDataSearchQuery = (additionalParams = null, skipSaga = false) => ({
  type: routing.dataQuerySearch.type,
  meta: {
    skipSaga,
    additionalParams
  }
});

export const toMap = (preserve = false) => ({
  type: routing.home.type,
  meta: {
    preserve,
    additionalParams: {
      [PARAMETERS.VIEW]: VIEW_MODE.MAP
    }
  }
});

export const toMapWithLegendOn = () => ({
  type: routing.home.type,
  meta: {
    preserve: false,
    additionalParams: {
      [PARAMETERS.VIEW]: VIEW_MODE.MAP
    }
  }
});

export const toMapAndPreserveQuery = () => toMap(true);

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
  [PARAMETERS.VIEW]: VIEW_MODE.SPLIT
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
  return toDataDetail([id, type, subtype], {
    [PARAMETERS.VIEW]: view
  });
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
export const toDatasetSearch = (additionalParams = null, skipSaga = false) => ({
  type: routing.searchDatasets.type,
  meta: {
    skipSaga,
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
  const tracking = {
    category: payload.category,
    event: 'auto-suggest',
    query: payload.typedQuery
  };

  return toDataDetail([id, type, subtype], null, tracking);
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
      [PARAMETERS.VIEW]: VIEW_MODE.FULL
    }
  }
});
