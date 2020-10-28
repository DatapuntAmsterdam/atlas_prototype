import { getNummeraanduidingByAddress } from '../../api/v1/bag/nummeraanduiding'

const getVerblijfsobjectIdFromAddressQuery = async (locationSearch: string): Promise<string> => {
  const result = await getNummeraanduidingByAddress(locationSearch)

  if (!result) return ''

  const {
    page: { totalElements },
    _embedded: data,
  } = result

  if (totalElements !== 1) return ''

  return `id${data.nummeraanduiding[0].verblijfsobjectId}`
}

export default getVerblijfsobjectIdFromAddressQuery
