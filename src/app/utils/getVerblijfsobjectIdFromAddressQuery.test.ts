import { mocked } from 'ts-jest/utils'
import getVerblijfsobjectIdFromAddressQuery from './getVerblijfsobjectIdFromAddressQuery'
import { getNummeraanduidingByAddress } from '../../api/bag/v1/nummeraanduiding-v1'

jest.mock('../../shared/services/query-string-parser/query-string-parser')
jest.mock('../../shared/services/api/api')
jest.mock('../../api/bag/v1/nummeraanduiding-v1', () => ({
  ...(jest.requireActual('../../api/bag/v1/nummeraanduiding-v1') as any),
  getNummeraanduidingByAddress: jest.fn(),
}))

const mockedGetNummeraanduidingByAddress = mocked(getNummeraanduidingByAddress, true)

describe('getVerblijfsobjectIdFromAddressQuery', () => {
  const queryParams = '?postcode=1&huisnummer=1'

  beforeEach(() => {
    mockedGetNummeraanduidingByAddress.mockReset()
  })

  it('should return an empty string when required parameters are not provided', async () => {
    mockedGetNummeraanduidingByAddress.mockReturnValueOnce(Promise.resolve(null))

    expect(await getVerblijfsobjectIdFromAddressQuery('?')).toEqual('')
    expect(await getVerblijfsobjectIdFromAddressQuery('?huisnummer=&postcode=')).toEqual('')
  })

  it('should return an empty string when not a single result is returned', async () => {
    const responseWithMoreThanOneResult = {
      page: { totalElements: 2, number: 1, size: 20, totalPages: 1 },
      _embedded: { nummeraanduiding: [] },
      _links: {
        self: {
          href: '',
        },
      },
    }
    mockedGetNummeraanduidingByAddress.mockReturnValueOnce(
      Promise.resolve(responseWithMoreThanOneResult),
    )

    expect(await getVerblijfsobjectIdFromAddressQuery(queryParams)).toEqual('')

    const responseWithZeroResults = {
      page: { totalElements: 0, number: 1, size: 20, totalPages: 1 },
      _embedded: { nummeraanduiding: [] },
      _links: {
        self: {
          href: '',
        },
      },
    }
    mockedGetNummeraanduidingByAddress.mockReturnValueOnce(Promise.resolve(responseWithZeroResults))

    expect(await getVerblijfsobjectIdFromAddressQuery(queryParams)).toEqual('')
  })

  it('should return an id', async () => {
    const verblijfsobjectId = '0363010000980408'
    const response = {
      page: { totalElements: 1, number: 1, size: 20, totalPages: 1 },
      _embedded: { nummeraanduiding: [{ verblijfsobjectId }] },
      _links: {
        self: {
          href: '',
        },
      },
    }
    mockedGetNummeraanduidingByAddress.mockReturnValueOnce(Promise.resolve(response))

    expect(await getVerblijfsobjectIdFromAddressQuery(queryParams)).toEqual(
      `id${verblijfsobjectId}`,
    )
  })
})
