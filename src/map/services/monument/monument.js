import { getByUrl } from '../../../shared/services/api/api'
import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'

export function fetchByPandId(pandId) {
  const searchParams = {
    betreft_pand: pandId,
  }

  const queryString = Object.keys(searchParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&')

  return getByUrl(`${SHARED_CONFIG.API_ROOT}monumenten/monumenten/?${queryString}`).then(
    data => data.results,
  )
}

export default fetchByPandId
