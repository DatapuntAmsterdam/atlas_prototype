import joinUrl from '../../../../app/utils/joinUrl'
import environment from '../../../../environment'
import { fetchProxy } from '../../../../shared/services/api/api'
import { List } from './types'
import { path } from '.'

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
): Promise<List | null> => {
  const paramsString = queryParams.substr(queryParams.indexOf('?'))
  const searchParams = new URLSearchParams(paramsString)

  if (!searchParams.get('postcode') || !searchParams.get('huisnummer')) {
    return Promise.resolve(null)
  }

  if (receiveFields) {
    searchParams.append('_fields', receiveFields)
  }

  const url = joinUrl([environment.API_ROOT, path])

  return fetchProxy(url, { searchParams })
}
