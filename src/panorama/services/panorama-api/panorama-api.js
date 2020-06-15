import { fetchWithToken } from '../../../shared/services/api/api'
import getCenter from '../../../shared/services/geo-json/geo-json'

export const PANORAMA_CONFIG = {
  PANORAMA_ENDPOINT_PREFIX: 'panorama/panoramas',
  PANORAMA_ENDPOINT_SUFFIX: 'adjacencies',
  SRID: 4326, // For latitude, longitude
  DEFAULT_FOV: 80,
  MAX_FOV: 90,
  MAX_RADIUS: 22,
  LARGE_RADIUS: 100000,
  MAX_RESOLUTION: 12 * 1024,
  CAMERA_HEIGHT: 1.8,
  LEVEL_PROPERTIES_LIST: [
    {
      tileSize: 256,
      size: 256,
      fallbackOnly: true,
    },
    {
      tileSize: 512,
      size: 512,
    },
    {
      tileSize: 512,
      size: 1024,
    },
    {
      tileSize: 512,
      size: 2048,
    },
  ],
}

const prefix = PANORAMA_CONFIG.PANORAMA_ENDPOINT_PREFIX
const suffix = PANORAMA_CONFIG.PANORAMA_ENDPOINT_SUFFIX

export const getLocationHistoryParams = (location, tags) => {
  const tagsQuery = Array.isArray(tags) ? `&tags=${tags}` : ''
  const newestInRange = 'newest_in_range=true'
  const pageSize = 'page_size=1'

  return {
    locationRange: location
      ? `near=${location[1]},${location[0]}&srid=${PANORAMA_CONFIG.SRID}&${pageSize}`
      : '',
    newestInRange,
    standardRadius: `radius=${PANORAMA_CONFIG.MAX_RADIUS}`,
    largeRadius: `radius=${PANORAMA_CONFIG.LARGE_RADIUS}`,
    tagsQuery,
    adjacenciesParams: `${newestInRange}${tagsQuery}`,
  }
}

const imageData = (response) => {
  const panorama = response[0]
  const adjacencies = response.filter((adjacency) => adjacency !== response[0])

  const formattedGeometry = {
    coordinates: [panorama.geometry.coordinates[1], panorama.geometry.coordinates[0]],
    type: panorama.geometry.type,
  }

  const center = getCenter(formattedGeometry)

  return {
    date: new Date(panorama.timestamp),
    id: panorama.pano_id,
    hotspots: Array.isArray(adjacencies)
      ? adjacencies.map((adjacency) => ({
          id: adjacency.pano_id,
          heading: adjacency.direction,
          distance: adjacency.distance,
          year: adjacency.mission_year,
        }))
      : [],
    location: [center.x, center.y],
    image: {
      baseurl: panorama.cubic_img_baseurl,
      pattern: panorama.cubic_img_pattern,
      preview: panorama._links.cubic_img_preview.href,
    },
  }
}

function fetchPanorama(url) {
  const promise = new Promise((resolve, reject) => {
    fetchWithToken(url)
      .then((json) => json._embedded.adjacencies)
      .then((data) => {
        resolve(imageData(data))
      })
      .catch((error) => reject(error))
  })

  return promise
}

function getAdjacencies(url, params) {
  const getAdjacenciesUrl = `${url}?${params}`
  return fetchPanorama(getAdjacenciesUrl)
}

export function getImageDataByLocation(location, tags) {
  if (!Array.isArray(location)) {
    return null
  }

  const {
    adjacenciesParams,
    largeRadius,
    locationRange,
    newestInRange,
    standardRadius,
    tagsQuery,
  } = getLocationHistoryParams(location, tags)
  const getLocationUrl = `${process.env.API_ROOT}${prefix}/?${locationRange}${tagsQuery}`
  const limitResults = 'limit_results=1'

  const promise = new Promise((resolve, reject) => {
    fetchWithToken(`${getLocationUrl}&${standardRadius}&${newestInRange}&${limitResults}`)
      .then((json) => json._embedded.panoramas[0])
      .then((data) => {
        if (data) {
          // we found a pano nearby go to it
          resolve(getAdjacencies(data._links.adjacencies.href, adjacenciesParams))
        } else {
          // there is no pano nearby search with a large radius and go to it
          resolve(
            fetchWithToken(`${getLocationUrl}&${largeRadius}&${limitResults}`)
              .then((json) => json._embedded.panoramas[0])
              .then((_data) => getAdjacencies(_data._links.adjacencies.href, adjacenciesParams)),
          )
        }
      })
      .catch((error) => reject(error))
  })

  return promise
}

export function getImageDataById(id, tags) {
  const { adjacenciesParams } = getLocationHistoryParams(null, tags)

  return fetchPanorama(`${process.env.API_ROOT}${prefix}/${id}/${suffix}/?${adjacenciesParams}`)
}

export function getStreetViewUrl(location, heading) {
  const [latitude, longitude] = location
  const path = 'http://maps.google.com/maps?q=&layer=c&'
  const parameters = `cbll=${latitude},${longitude}&cbp=11,${heading},0,0,0`

  return `${path}${parameters}`
}
