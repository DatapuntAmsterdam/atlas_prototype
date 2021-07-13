import { getScopes } from '../../../../../shared/services/auth/auth'
import type { MapGroup } from '../../../../../api/cms_search/graphql'

// eslint-disable-next-line import/prefer-default-export
export function isAuthorised(layer: MapGroup) {
  return !layer.authScope || getScopes().includes(layer.authScope)
}
