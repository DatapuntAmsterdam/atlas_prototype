import { getServiceDefinitions } from '../map-services.config'

/**
 * Get a map service definition by it's specified type. E.g. `grex/projecten`.
 *
 * @param type The type of the service definition.
 */
// eslint-disable-next-line import/prefer-default-export
export function getServiceDefinition(type: string) {
  return getServiceDefinitions().find((entry) => entry.type === type) ?? null
}
