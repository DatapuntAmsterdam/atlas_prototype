import { LatLngLiteral } from 'leaflet'
import { fetchWithToken } from '../api/api'
import environment from '../../../environment'
import { LegacyDataSelectionConfigType } from './data-selection-config'
import { FilterObject } from '../../../app/components/DataSelection/types'

function getMarkers(
  signal: AbortSignal,
  config: LegacyDataSelectionConfigType,
  activeFilters: FilterObject,
) {
  return fetchWithToken<{ object_list: [{ _source: { centroid: LatLngLiteral[] } }] }>(
    `${environment.API_ROOT}${config.ENDPOINT_MARKERS}`,
    activeFilters,
    signal,
  ).then((data) => ({
    clusterMarkers: data.object_list
      // eslint-disable-next-line no-underscore-dangle
      .map((object) => object._source.centroid)
      .filter((x?) => x)
      .map(([lon, lat]) => [lat, lon]),
  }))
}

export default getMarkers
