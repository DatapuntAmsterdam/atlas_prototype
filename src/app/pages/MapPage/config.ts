import environment from '../../../environment'
import { toAddresses, toCadastralObjects, toEstablishments } from '../../links'
import { MAIN_PATHS, routing } from '../../routes'

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

export default {
  [DataSelectionType.BAG]: {
    authScope: AuthScope.None,
    title: 'Adressen',
    path: routing.addresses_TEMP.path,
    toTable: toAddresses(),
    extraParams: {},
    getDetailPath: (id: string) => `/${MAIN_PATHS.MAP}/bag/nummeraanduiding/${id}`,
    endpointData: `${environment.API_ROOT}dataselectie/bag/`,
    endpointMapVisualization: `${environment.API_ROOT}dataselectie/bag/geolocation/`,
  },
  [DataSelectionType.HR]: {
    authScope: AuthScope.HR,
    title: 'Vestigingen',
    path: routing.establishments_TEMP.path,
    extraParams: {
      dataset: 'ves',
    },
    toTable: toEstablishments(),
    getDetailPath: (id: string) => `/${MAIN_PATHS.MAP}/handelsregister/vestiging/${id}`,
    endpointData: `${environment.API_ROOT}dataselectie/hr/`,
    endpointMapVisualization: `${environment.API_ROOT}dataselectie/hr/geolocation/`,
  },
  [DataSelectionType.BRK]: {
    authScope: AuthScope.BRK,
    title: 'Kadastrale objecten',
    extraParams: {},
    path: routing.cadastralObjects_TEMP.path,
    toTable: toCadastralObjects(),
    getDetailPath: (id: string) => `/${MAIN_PATHS.MAP}/brk/object/${id}`,
    endpointData: `${environment.API_ROOT}dataselectie/brk/kot/`,
    endpointMapVisualization: `${environment.API_ROOT}dataselectie/brk/geolocation/`,
  },
}
