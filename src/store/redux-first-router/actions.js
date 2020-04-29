import { ROUTER_NAMESPACE, routing } from '../../app/routes'
import { HEADER_LINKS } from '../../shared/config/config'
import { DATASET_ROUTE_MAPPER } from '../../shared/ducks/data-selection/constants'
import { VIEW_MODE } from '../../shared/ducks/ui/ui'
import PARAMETERS from '../parameters'

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
  allowedRoutes.every((route) => !action.type.includes(route))

const toSearchOfType = (type) => (
  additionalParams = null,
  skipSaga = false,
  forceSaga = false,
  preserve = true,
) => ({
  type,
  meta: {
    preserve,
    skipSaga,
    forceSaga,
    additionalParams,
  },
})

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

export const toGeoSearch = (additionalParams) =>
  preserveQuery(
    {
      type: routing.dataSearchGeo.type,
      meta: {
        forceSaga: true,
      },
    },
    additionalParams,
  )

export const toDataSearch = toSearchOfType(routing.dataSearch.type)

export const toDataSearchType = (type) =>
  toDataSearch(
    {
      [PARAMETERS.FILTERS]: [
        {
          type: 'dataTypes',
          values: [type],
        },
      ],
    },
    false,
    true,
  )

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

export const toMapWithLegendOpen = (layers) => {
  const additionalParams = {
    [PARAMETERS.VIEW]: VIEW_MODE.MAP,
    [PARAMETERS.LEGEND]: true,
    [PARAMETERS.LAYERS]: layers,
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

export const extractIdEndpoint = (endpoint) => {
  return endpoint.match(/(\w+)\/([\w-]+)\/?$/)
}
export const getDetailPageData = (endpoint) => {
  let matches = endpoint.replace('bag/v1.1/', 'bag/') // Clean URL if this is using the new BAG v1.1 API
  // eslint-disable-next-line no-useless-escape
  matches = matches.match(/(\w+)\/([\w-]+)\/([\w\.-]+)\/?$/)

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

export const toDataDetailPage = ({ type, subtype, id }, view) =>
  toDataDetail([id, type, subtype], {
    [PARAMETERS.VIEW]: view,
  })

export const toConstructionFilesFromEndpoint = (endpoint) => {
  const { id } = getDetailPageData(endpoint)
  return {
    type: routing.constructionFile.type,
    payload: {
      id,
    },
  }
}

export const toDatasetSearch = toSearchOfType(routing.datasetSearch.type)
export const toSearch = toSearchOfType(routing.search.type)

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

export const toDatasetDetail = (payload) => ({
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

export const toCadastralObjects = () => ({
  type: routing.cadastralObjects.type,
  meta: {
    query: {
      [PARAMETERS.VIEW]: VIEW_MODE.FULL,
    },
  },
})

export const toEstablishments = () => ({
  type: routing.establishments.type,
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

export const toCollectionDetail = (id, slug = '') => ({
  type: routing.collectionDetail.type,
  payload: {
    id,
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
export const toDatasetPage = (dataset) => ({
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

export const toHelpPage = () =>
  toArticleDetail(HEADER_LINKS.HELP.id[process.env.NODE_ENV], HEADER_LINKS.HELP.slug)

export const toPublicationSearch = toSearchOfType(routing.publicationSearch.type)
export const toArticleSearch = toSearchOfType(routing.articleSearch.type)
export const toSpecialSearch = toSearchOfType(routing.specialSearch.type)
export const toCollectionSearch = toSearchOfType(routing.collectionSearch.type)
export const toMapSearch = toSearchOfType(routing.mapSearch.type)

export const toMapSearchType = (type) =>
  toMapSearch({ [PARAMETERS.FILTERS]: [{ type: 'map-type', values: [type] }] }, false, true)
