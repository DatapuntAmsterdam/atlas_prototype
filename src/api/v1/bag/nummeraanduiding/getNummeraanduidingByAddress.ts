import joinUrl from '../../../../app/utils/joinUrl'
import environment from '../../../../environment'
import { fetchWithoutToken } from '../../../../shared/services/api/api'
import { Root as Nummeraanduiding } from './types'

/**
 * Retrieve nummeraanduiding
 *
 * API documentation: https://api.data.amsterdam.nl/v1/bag/nummeraanduiding
 *
 * @param queryParams - Full URL or search string
 * @param receiveFields - comma separated (no spaces) values indicating which fields should be returned from the API request
 */
// eslint-disable-next-line import/prefer-default-export
export const getNummeraanduidingByAddress = (
  queryParams: string,
  receiveFields?: string,
): Promise<Nummeraanduiding | null> => {
  const paramsString = queryParams.substr(queryParams.indexOf('?'))
  const searchParams = new URLSearchParams(paramsString)

  if (!searchParams.get('postcode') || !searchParams.get('huisnummer')) {
    return Promise.resolve(null)
  }

  if (receiveFields) {
    searchParams.append('_fields', receiveFields)
  }

  const url = joinUrl([environment.API_ROOT, 'v1/bag/nummeraanduiding'])

  return fetchWithoutToken(`${url}?${searchParams.toString()}`)
}
