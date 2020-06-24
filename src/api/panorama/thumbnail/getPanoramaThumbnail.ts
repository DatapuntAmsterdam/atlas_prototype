import { LatLngLiteral } from 'leaflet'
import { fetchWithToken } from '../../../shared/services/api/api'

export interface FetchPanoramaOptions {
  /**
   * The width of the thumbnail image in pixels (max 1600).
   *
   * @default 750
   */
  width?: number
  /**
   * Field of view in degrees horizontal (max 120), max 20px width per degree.
   *
   * @default 80
   */
  fov?: number
  /**
   * Fraction of image that is below horizon.
   *
   * @default 0.3
   */
  horizon?: number
  /**
   * Aspect ratio of thumbnail (width/height, min 1).
   *
   * @default 1.5
   */
  aspect?: number
  /**
   * The radius around the provided location in which the panorama should be found. The expected unit of this field is specified in meters.
   *
   * @default 20
   */
  radius?: number
}

export interface PanoramaThumbnail {
  /**
   * The identifier of the associated panorama.
   */
  id: string
  heading: number
  /**
   * URL to the image preview.
   */
  url: string
}

type RawResponse =
  | {
      // eslint-disable-next-line camelcase
      pano_id: string
      heading: number
      url: string
    }
  | []

// TODO: Write method overloads for getting the thumbnail by the panorama id and RD coordinates (see API docs).
// TODO: Add support for providing RD coordinates (see API docs)

/**
 * Retrieve the panorama closest to the provided location.
 *
 * @param location The latitude and longitude of the location to find the preview at.
 *
 * API documentation: https://api.data.amsterdam.nl/panorama/thumbnail/
 */
export async function getPanoramaThumbnail(
  location: LatLngLiteral,
  options?: FetchPanoramaOptions,
) {
  const searchParams = new URLSearchParams({
    lat: location.lat.toString(),
    lon: location.lng.toString(),
  })

  if (options?.width) {
    searchParams.set('width', options?.width.toString())
  }

  if (options?.fov) {
    searchParams.set('fov', options?.fov.toString())
  }

  if (options?.horizon) {
    searchParams.set('horizon', options?.horizon.toString())
  }

  if (options?.aspect) {
    searchParams.set('aspect', options?.aspect.toString())
  }

  if (options?.radius) {
    searchParams.set('radius', options?.radius.toString())
  }

  const response = await fetchWithToken<RawResponse>(
    `${process.env.API_ROOT}panorama/thumbnail/?${searchParams.toString()}`,
  )

  return transformResponse(response)
}

function transformResponse(response: RawResponse): PanoramaThumbnail | null {
  // Because of a bug in the API empty responses are returned as an empty array.
  if (response instanceof Array) {
    return null
  }

  return {
    id: response.pano_id,
    heading: response.heading,
    url: response.url,
  }
}
