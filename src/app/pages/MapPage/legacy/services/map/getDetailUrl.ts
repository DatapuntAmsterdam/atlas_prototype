import joinUrl from '../../../../../utils/joinUrl'
import environment from '../../../../../../environment'
import type { ServiceDefinition } from '../map-services.config'

// eslint-disable-next-line import/prefer-default-export
export function getDetailUrl(serviceDefinition: ServiceDefinition, id: string) {
  const apiRoot = environment.API_ROOT

  // TODO: Remove this exception once the 'endpoint' type has been made required.
  if (!serviceDefinition.endpoint) {
    throw new Error('Unable to format URL, missing endpoint in service definition.')
  }

  return joinUrl([apiRoot, serviceDefinition.endpoint, id], true)
}
