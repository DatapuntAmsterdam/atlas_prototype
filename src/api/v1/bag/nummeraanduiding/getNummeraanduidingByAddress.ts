import joinUrl from '../../../../app/utils/joinUrl'
import environment from '../../../../environment'
import queryStringParser from '../../../../shared/services/query-string-parser/query-string-parser'
import { fetchWithoutToken } from '../../../../shared/services/api/api'
import { Root as Nummeraanduiding } from './types'

type ReceiveFields = {
  _fields: string
}

/**
 * Retrieve nummeraanduiding
 *
 * API documentation: https://api.data.amsterdam.nl/v1/bag/nummeraanduiding
 *
 * @param {String} queryParams - Full URL or search string
 * @param {String} receiveFields - comma separated (no spaces) values indicating which fields should be returned from the API request
 */
// eslint-disable-next-line import/prefer-default-export
export const getNummeraanduidingByAddress = (
  queryParams: string,
  receiveFields?: string,
): Promise<Nummeraanduiding | null> => {
  const paramsString = queryParams.substr(queryParams.indexOf('?'))
  const searchParams = new URLSearchParams(paramsString)

  if (!searchParams.get('postcode') || !searchParams.get('huisnummer')) {
    return null
  }

  if (receiveFields) {
    searchParams.append('_fields', receiveFields)
  }

  const url = joinUrl([environment.API_ROOT, 'v1/bag/nummeraanduiding'])

  return fetchWithoutToken(`${url}?${searchParams.toString()}`)
}
