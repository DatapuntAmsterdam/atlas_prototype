import { ROUTER_NAMESPACE, routing } from '../../app/routes'
import { ViewMode } from '../../shared/ducks/ui/ui'
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

const toSearchOfType =
  (type) =>
  (additionalParams = null, skipSaga = false, forceSaga = false, preserve = true) => ({
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
      [PARAMETERS.VIEW]: ViewMode.Map,
    },
    query: {
      [PARAMETERS.VIEW]: ViewMode.Map,
    },
  },
})

export const toMapWithLegendOpen = (layers) => {
  const additionalParams = {
    [PARAMETERS.VIEW]: ViewMode.Map,
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
    [PARAMETERS.VIEW]: ViewMode.Split,
  })

export const extractIdEndpoint = (endpoint) => {
  return endpoint.match(/(\w+)\/([\w-]+)\/?$/)
}

const URL_SUBTYPES_MAPPING = {
  openbareruimtes: 'openbareruimte',
  woonplaatsen: 'woonplaats',
  ligplaatsen: 'ligplaats',
}

export const getDetailPageData = (endpoint) => {
  // TODO: Add endpoint mapping when new router is introduced
  let matches = endpoint
    .split('?')[0] // Remove query
    .replace('bag/v1.1/', 'bag/') // Clean URL if this is using the new BAG v1.1 API
    .replace('iiif-metadata/', 'bouwdossiers/') // Clean URL if this is using the new IIIF Metadata API
  // eslint-disable-next-line no-useless-escape
  matches = matches.match(/(\w+)\/([\w-]+)\/([\w\.-]+)\/?$/)

  if (matches === null) {
    // eslint-disable-next-line no-console
    console.warn(
      `Type, subtype and id from the given endpoint to getDetailPageData could not be extracted`,
    )
    return {
      type: null,
      subtype: null,
      id: null,
    }
  }
  return {
    type: matches[1],
    subtype: URL_SUBTYPES_MAPPING[matches[2]] ?? matches[2],
    id: matches[3],
  }
}
export const toDetailFromEndpoint = (endpoint, view) => {
  const { type, subtype, id } = getDetailPageData(endpoint)
  return toDataDetail([id, type, subtype], {
    [PARAMETERS.VIEW]: view,
  })
}

export const toDatasetSearch = toSearchOfType(routing.datasetSearch.type)
export const toSearch = toSearchOfType(routing.search.type)

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

export const toPublicationSearch = toSearchOfType(routing.publicationSearch.type)
export const toArticleSearch = toSearchOfType(routing.articleSearch.type)
export const toSpecialSearch = toSearchOfType(routing.specialSearch.type)
export const toCollectionSearch = toSearchOfType(routing.collectionSearch.type)
export const toMapSearch = toSearchOfType(routing.mapSearch.type)

export const toMapSearchType = (type) =>
  toMapSearch({ [PARAMETERS.FILTERS]: [{ type: 'map-type', values: [type] }] }, false, true)
