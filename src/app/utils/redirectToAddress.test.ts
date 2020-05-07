import queryStringParser from '../../shared/services/query-string-parser/query-string-parser'
import { getByUri } from '../../shared/services/api/api'
import redirectToAddress from './redirectToAddress'

jest.mock('../../shared/services/query-string-parser/query-string-parser')
jest.mock('../../shared/services/api/api')

describe('getUnauthorizedLabels', () => {
  it('should return an empty string when required paramters are not provided', async () => {
    const queryStringParserMock = queryStringParser.mockReturnValue({})

    const input = '?'

    const output = await redirectToAddress(input)

    expect(queryStringParserMock).toHaveBeenCalledWith(input)
    expect(output).toEqual('')
  })

  it('should return an empty string when more than 1 result is returned', async () => {
    const queryStringParserMock = queryStringParser.mockReturnValue({
      postcode: 1,
      huisnummer: 1,
    })
    const getByUriMock = getByUri.mockReturnValue({
      count: 2,
      _embedded: {},
    })

    const input = '?postcode=1&huisnummer=1'

    const output = await redirectToAddress(input)

    expect(queryStringParserMock).toHaveBeenCalledWith(input)
    expect(getByUriMock).toHaveBeenCalled()
    expect(output).toEqual('')
  })

  it('should return an id', async () => {
    const queryStringParserMock = queryStringParser.mockReturnValue({
      postcode: 1,
      huisnummer: 1,
    })
    const getByUriMock = getByUri.mockReturnValue({
      count: 1,
      _embedded: {
        nummeraanduiding: [{ verblijfsobjectId: 1 }],
      },
    })

    const input = '?postcode=1&huisnummer=1'

    const output = await redirectToAddress(input)

    expect(queryStringParserMock).toHaveBeenCalledWith(input)
    expect(getByUriMock).toHaveBeenCalled()
    expect(output).toEqual('id1')
  })
})
