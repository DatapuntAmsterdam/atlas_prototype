import { mocked } from 'ts-jest/utils'
import getVerblijfsobjectIdFromAddressQuery from './getVerblijfsobjectIdFromAddressQuery'
import { getNummeraanduidingByAddress } from '../../api/bag/v1/nummeraanduiding-v1'

jest.mock('../../shared/services/query-string-parser/query-string-parser')
jest.mock('../../shared/services/api/api')
jest.mock('../../api/bag/v1/nummeraanduiding-v1', () => ({
  // @ts-ignore
  ...jest.requireActual('../../api/bag/v1/nummeraanduiding-v1'),
  getNummeraanduidingByAddress: jest.fn(),
}))

const mockedGetNummeraanduidingByAddress = mocked(getNummeraanduidingByAddress, true)

describe('getVerblijfsobjectIdFromAddressQuery', () => {
  let search = '?postcode=1&huisnummer=1'
  Object.defineProperty(window, 'location', {
    value: {
      ...window.location,
      search,
    },
  })

  beforeEach(() => {
    mockedGetNummeraanduidingByAddress.mockReset()
  })

  it('should return an empty string when required parameters are not provided', async () => {
    mockedGetNummeraanduidingByAddress.mockReturnValueOnce(Promise.resolve(null))

    search = '?'
    expect(await getVerblijfsobjectIdFromAddressQuery()).toEqual('')
    search = '?huisnummer=&postcode='
    expect(await getVerblijfsobjectIdFromAddressQuery()).toEqual('')
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

    expect(await getVerblijfsobjectIdFromAddressQuery()).toEqual('')

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

    expect(await getVerblijfsobjectIdFromAddressQuery()).toEqual('')
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

    expect(await getVerblijfsobjectIdFromAddressQuery()).toEqual(`id${verblijfsobjectId}`)
  })
})
