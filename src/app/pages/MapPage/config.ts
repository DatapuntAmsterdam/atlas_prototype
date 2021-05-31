import type { LocationDescriptorObject } from 'history'
import environment from '../../../environment'
import { toAddresses, toCadastralObjects, toEstablishments } from '../../links'
import { MAIN_PATHS, routing } from '../../routes'
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

export enum AuthScope {
  BRK = 'BRK/RSN',
  HR = 'HR/R',
  None = 'None',
}

export const defaultPanoramaUrl: LocationDescriptorObject = {
  pathname: routing.dataSearchGeo.path,
  search: new URLSearchParams({
    [centerParam.name]: '52.373308,4.8749081',
    [panoPitchParam.name]: '4',
    [panoHeadingParam.name]: '-144',
    [panoFovParam.name]: '27',
    [locationParam.name]: '52.3733935,4.8935746',
  }).toString(),
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
