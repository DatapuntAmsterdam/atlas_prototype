import { server, rest, MockedRequest } from '../../../../../test/server'
import { singleFixture, path } from '.'

import { getNummeraanduidingByAddress } from './getNummeraanduidingByAddress'

let request: MockedRequest

describe('getNummeraanduidingByAddress', () => {
  beforeEach(() => {
    server.use(
      rest.get(new RegExp(`${path}*`), async (req, res, ctx) => {
        const response = await res(ctx.status(200), ctx.json(singleFixture))
        request = req
        return response
      }),
    )
  })

  it('returns null', async () => {
    expect(await getNummeraanduidingByAddress('')).toBeNull()
    expect(await getNummeraanduidingByAddress('foobarbaz')).toBeNull()
    expect(await getNummeraanduidingByAddress('?postcode=&huisnummer=')).toBeNull()
    expect(await getNummeraanduidingByAddress('postcode=&huisnummer=')).toBeNull()
    expect(
      await getNummeraanduidingByAddress('https://data.amsterdam.nl/zoek/?postcode=&huisnummer='),
    ).toBeNull()
  })

  it('makes a request and returns the response', async () => {
    const queryParams = '?postcode=1016XX&huisnummer=0001'
    const response = await getNummeraanduidingByAddress(queryParams)

    expect(request.url.toString()).toEqual(expect.stringContaining(queryParams))

    expect(response).toEqual(singleFixture)
  })

  it('requests specific fields to receive', async () => {
    const queryParams = '?postcode=1099AA&huisnummer=1000'
    const receiveFields = 'verblijfsobjectId,someOther,FooBar'

    await getNummeraanduidingByAddress(queryParams, receiveFields)

    expect(request.url.toString()).toEqual(expect.stringContaining(queryParams))

    expect(request.url.toString()).toEqual(
      expect.stringContaining(encodeURIComponent(receiveFields)),
    )
  })
})
