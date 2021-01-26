import environment from '../../../environment'
import { toDetailFromEndpoint } from '../../../store/redux-first-router/actions'
import { toAddresses, toCadastralObjects, toEstablishments } from '../../links'
import { routing } from '../../routes'

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
    path: routing.addresses.path,
    toTable: toAddresses(),
    toDetailAction: (id: string) =>
      toDetailFromEndpoint(`${environment.API_ROOT}bag/nummeraanduiding/${id}`),
    endpointData: `${environment.API_ROOT}dataselectie/bag/`,
    endpointMapVisualization: `${environment.API_ROOT}dataselectie/bag/geolocation/`,
  },
  [DataSelectionType.HR]: {
    authScope: AuthScope.HR,
    title: 'Vestigingen',
    path: routing.establishments.path,
    toTable: toEstablishments(),
    toDetailAction: (id: string) =>
      toDetailFromEndpoint(`${environment.API_ROOT}handelsregister/vestiging/${id}`),
    endpointData: `${environment.API_ROOT}dataselectie/hr/`,
    endpointMapVisualization: `${environment.API_ROOT}dataselectie/hr/geolocation/`,
  },
  [DataSelectionType.BRK]: {
    authScope: AuthScope.BRK,
    title: 'Kadastrale objecten',
    path: routing.cadastralObjects.path,
    toTable: toCadastralObjects(),
    toDetailAction: (id: string) => toDetailFromEndpoint(`${environment.API_ROOT}brk/object/${id}`),
    endpointData: `${environment.API_ROOT}dataselectie/brk/kot/`,
    endpointMapVisualization: `${environment.API_ROOT}dataselectie/brk/geolocation/`,
  },
}
