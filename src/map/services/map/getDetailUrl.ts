import joinUrl from '../../../app/utils/joinUrl'
import { ServiceDefinition } from '../map-services.config'
import environment from '../../../environment'

// eslint-disable-next-line import/prefer-default-export
export function getDetailUrl(serviceDefinition: ServiceDefinition, id: string) {
  const apiRoot = environment.API_ROOT

  if (!apiRoot) {
    throw new Error('Unable to format URL, missing API_ROOT environment variable.')
  }

  // TODO: Remove this exception once the 'endpoint' type has been made required.
  if (!serviceDefinition.endpoint) {
    throw new Error('Unable to format URL, missing endpoint in service definition.')
  }

  return joinUrl(apiRoot, serviceDefinition.endpoint, id)
}
