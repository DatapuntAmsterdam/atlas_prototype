import type { LocationDescriptorObject } from 'history'
import type { BaseIconOptions } from 'leaflet'
import environment from '../../../environment'
import { toAddresses, toCadastralObjects, toEstablishments, toGeoSearch } from '../../links'
import { MAIN_PATHS, routing } from '../../routes'
import toSearchParams from '../../utils/toSearchParams'
import {
  centerParam,
  locationParam,
  panoFovParam,
  panoHeadingParam,
  panoPitchParam,
} from './query-params'

// Because we use these types as id's in option values (select), we need to convert them to strings
export enum DataSelectionType {
  BAG = 'BAG',
  BRK = 'BRK',
  HR = 'HR',
}

export enum DataSelectionMapVisualizationType {
  GeoJSON,
  Markers,
}

enum AuthScope {
  BRK = 'BRK/RSN',
  HR = 'HR/R',
  None = 'None',
}

export const defaultPanoramaUrl: LocationDescriptorObject = {
  ...toGeoSearch(),
  search: toSearchParams([
    [centerParam, [52.373308, 4.8749081]],
    [panoPitchParam, 4],
    [panoHeadingParam, -144],
    [panoFovParam, 27],
    [locationParam, [52.3733935, 4.8935746]],
  ]).toString(),
}

export default {
  [DataSelectionType.BAG]: {
    authScope: AuthScope.None,
    title: 'Adressen',
    path: routing.addresses.path,
    toTable: toAddresses(),
    extraParams: {},
    getDetailPath: (id: string) => `/${MAIN_PATHS.DATA}/bag/nummeraanduiding/${id}`,
    endpointData: `${environment.API_ROOT}dataselectie/bag/`,
    endpointMapVisualization: `${environment.API_ROOT}dataselectie/bag/geolocation/`,
  },
  [DataSelectionType.HR]: {
    authScope: AuthScope.HR,
    title: 'Vestigingen',
    path: routing.establishments.path,
    extraParams: {
      dataset: 'ves',
    },
    toTable: toEstablishments(),
    getDetailPath: (id: string) => `/${MAIN_PATHS.DATA}/handelsregister/vestiging/${id}`,
    endpointData: `${environment.API_ROOT}dataselectie/hr/`,
    endpointMapVisualization: `${environment.API_ROOT}dataselectie/hr/geolocation/`,
  },
  [DataSelectionType.BRK]: {
    authScope: AuthScope.BRK,
    title: 'Kadastrale objecten',
    extraParams: {},
    path: routing.cadastralObjects.path,
    toTable: toCadastralObjects(),
    getDetailPath: (id: string) => `/${MAIN_PATHS.DATA}/brk/object/${id}`,
    endpointData: `${environment.API_ROOT}dataselectie/brk/kot/`,
    endpointMapVisualization: `${environment.API_ROOT}dataselectie/brk/geolocation/`,
  },
}

export const DETAIL_ICON: BaseIconOptions = {
  iconUrl: '/assets/images/map/detail.svg',
  iconSize: [21, 21],
  iconAnchor: [10, 10],
}
