import { getScopes } from '../../../../../shared/services/auth/auth'
import type { MapLayer } from '../services'

// eslint-disable-next-line import/prefer-default-export
export function isAuthorised(layer: MapLayer) {
  return !layer.authScope || getScopes().includes(layer.authScope)
}
