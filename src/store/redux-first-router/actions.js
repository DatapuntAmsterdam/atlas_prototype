import { ROUTER_NAMESPACE, routing } from '../../app/routes'
import { DATASET_ROUTE_MAPPER } from '../../shared/ducks/data-selection/constants'
import PARAMETERS from '../parameters'
import { VIEW_MODE } from '../../shared/ducks/ui/ui'

export const preserveQuery = (action, additionalParams = null) => ({
  ...action,
  meta: {
    ...(action.meta ? action.meta : {}),
    preserve: true,
    additionalParams,
  },
})

export const shouldResetState = (action, allowedRoutes = []) =>
  action.type &&
  action.type.startsWith(ROUTER_NAMESPACE) &&
  allowedRoutes.every(route => !action.type.includes(route))

export const toDataDetail = (detailReference, additionalParams = null, tracking = true) => {
  const [id, type, subtype] = detailReference
  return preserveQuery(
    {
      type: routing.dataDetail.type,
      payload: {
        type,
        subtype,
        id: `id${id}`,
      },
      meta: {
        tracking: {
          ...tracking,
          id,
        },
        forceSaga: true,
      },
    },
    additionalParams,
  )
}

export const toHome = () => ({
  type: routing.home.type,
})

export const toGeoSearch = additionalParams =>
  preserveQuery(
    {
      type: routing.dataSearchGeo.type,
      meta: {
        forceSaga: true,
      },
    },
    additionalParams,
  )

export const toDataSearchQuery = (
  additionalParams = null,
  skipSaga = false,
  forceSaga = false,
) => ({
  type: routing.dataSearchQuery.type,
  meta: {
    preserve: true,
    skipSaga,
    forceSaga,
    additionalParams,
  },
})

export const toMap = (preserve = false, forceSaga = true) => ({
  type: routing.data.type,
  meta: {
    preserve,
    forceSaga,
    additionalParams: {
      [PARAMETERS.VIEW]: VIEW_MODE.MAP,
    },
    query: {
      [PARAMETERS.VIEW]: VIEW_MODE.MAP,
    },
  },
})

export const toMapWithLegendOpen = () => {
  const additionalParams = {
    [PARAMETERS.VIEW]: VIEW_MODE.MAP,
    [PARAMETERS.LEGEND]: true,
  }
  return {
    type: routing.data.type,
    meta: {
      additionalParams,
      query: additionalParams,
    },
  }
}

export const toMapAndPreserveQuery = () => toMap(true)

export const toPanorama = (id, additionalParams = null) => ({
  type: routing.panorama.type,
  payload: {
    id,
  },
  meta: {
    preserve: true,
    additionalParams,
    query: additionalParams,
  },
})

export const toPanoramaAndPreserveQuery = (
  id = 'TMX7316010203-001187_pano_0000_001517',
  heading = 226,
  reference = [],
  pageReference = null,
) =>
  toPanorama(id, {
    heading,
    ...(reference.length === 3 ? { [PARAMETERS.DETAIL_REFERENCE]: reference } : {}),
    ...(pageReference ? { [PARAMETERS.PAGE_REFERENCE]: pageReference } : {}),
    [PARAMETERS.VIEW]: VIEW_MODE.SPLIT,
  })

export const extractIdEndpoint = endpoint => {
  return endpoint.match(/(\w+)\/([\w-]+)\/?$/)
}
export const getDetailPageData = endpoint => {
  const matches = endpoint.match(/(\w+)\/([\w-]+)\/([\w\.-]+)\/?$/) // eslint-disable-line no-useless-escape
  return {
    type: matches[1],
    subtype: matches[2],
    id: matches[3],
  }
}
export const toDetailFromEndpoint = (endpoint, view) => {
  const { type, subtype, id } = getDetailPageData(endpoint)
  return toDataDetail([id, type, subtype], {
    [PARAMETERS.VIEW]: view,
  })
}

export const toConstructionFilesFromEndpoint = endpoint => {
  const { id } = getDetailPageData(endpoint)
  return {
    type: routing.constructionFile.type,
    payload: {
      id,
    },
  }
}

export const toDataSearchCategory = (searchQuery, category) => ({
  type: routing.dataSearchCategory.type,
  payload: {
    category,
  },
  meta: {
    additionalParams: {
      [PARAMETERS.QUERY]: searchQuery,
    },
  },
})

export const toDatasets = (additionalParams = null, preserve = false, forceSaga = true) => ({
  type: routing.datasets.type,
  meta: {
    preserve,
    additionalParams,
    forceSaga,
  },
})

export const toDatasetSearch = (additionalParams = null, skipSaga = false, forceSaga = false) => ({
  type: routing.datasetSearch.type,
  meta: {
    preserve: true,
    skipSaga,
    forceSaga,
    additionalParams,
  },
})
export const toDatasetsWithFilter = (additionalParams = {}, preserve = false) => ({
  type: routing.datasets.type,
  meta: {
    additionalParams,
    preserve,
  },
})
export const toDataSuggestion = (payload, view) => {
  const { type, subtype, id } = getDetailPageData(payload.endpoint)
  const tracking = {
    category: payload.category,
    event: 'auto-suggest',
    query: payload.typedQuery,
  }
  return toDataDetail(
    [id, type, subtype],
    {
      [PARAMETERS.VIEW]: view,
    },
    tracking,
  )
}

export const toDatasetDetail = payload => ({
  type: routing.datasetDetail.type,
  payload,
  meta: {
    forceSaga: true,
    tracking: {
      event: 'auto-suggest',
      query: payload.typedQuery,
    },
  },
})

export const toAdresses = () => ({
  type: routing.addresses.type,
  meta: {
    query: {
      [PARAMETERS.VIEW]: VIEW_MODE.FULL,
    },
  },
})

export const toArticleDetail = (id, slug = '') => ({
  type: routing.articleDetail.type,
  payload: {
    id,
    slug,
  },
})

export const toPublicationDetail = (id, slug = '') => ({
  type: routing.publicationDetail.type,
  payload: {
    id,
    slug,
  },
})

export const toSpecialDetail = (id, type = '', slug = '') => ({
  type: routing.specialDetail.type,
  payload: {
    id,
    type,
    slug,
  },
})

export const toConstructionFileViewer = (id, fileName) => ({
  type: routing.constructionFile.type,
  payload: {
    id,
  },
  meta: {
    query: {
      [PARAMETERS.FILE]: fileName,
    },
  },
})
export const toDatasetPage = dataset => ({
  type: DATASET_ROUTE_MAPPER[dataset],
})
export const toDatasetsTableWithFilter = (datasetType, filter) => ({
  type: datasetType,
  meta: {
    additionalParams: {
      ...(filter ? { [PARAMETERS.FILTERS]: filter } : {}),
      [PARAMETERS.VIEW]: VIEW_MODE.FULL,
    },
  },
})
export const toNotFoundPage = () => ({
  type: routing.niet_gevonden.type,
})

export const toApisPage = () => ({ type: routing.apis.type })
export const toPrivacyPage = () => ({ type: routing.privacy_beveiliging.type })
export const toAvailabilityPage = () => ({
  type: routing.beschikbaar_kwaliteit.type,
})
export const toMaintentancePage = () => ({
  type: routing.beheer_werkwijze.type,
})
export const toHelpPage = () => ({ type: routing.help.type })

export const toArticleSearch = (additionalParams = null, skipSaga = false, forceSaga = false) => ({
  type: routing.articleSearch.type,
  meta: {
    preserve: true,
    skipSaga,
    forceSaga,
    additionalParams,
  },
})

export const toPublicationSearch = (
  additionalParams = null,
  skipSaga = false,
  forceSaga = false,
) => ({
  type: routing.publicationSearch.type,
  meta: {
    preserve: true,
    skipSaga,
    forceSaga,
    additionalParams,
  },
})
