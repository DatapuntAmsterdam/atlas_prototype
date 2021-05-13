import { getNummeraanduidingByAddress } from '../../api/bag/v1/nummeraanduiding-v1'

/**
 * Get a verblijfsobject id from a URL or search string
 */
const getVerblijfsobjectIdFromAddressQuery = async (): Promise<string> => {
  const result = await getNummeraanduidingByAddress(window.location.search)

  if (!result) return ''

  const {
    page: { totalElements },
    _embedded: data,
  } = result

  if (totalElements !== 1) return ''

  const { verblijfsobjectId } = data.nummeraanduiding[0]
  return verblijfsobjectId ? `id${verblijfsobjectId}` : ''
}

export default getVerblijfsobjectIdFromAddressQuery
