import { mocked } from 'ts-jest/utils'
import joinUrl from '../../../../app/utils/joinUrl'
import environment from '../../../../environment'
import { fetchWithoutToken } from '../../../../shared/services/api/api'
import nummeraanduidingFixture, { verblijfsobjectFieldFixture } from './fixture'

import { getNummeraanduidingByAddress } from './getNummeraanduidingByAddress'

jest.mock('../../../../shared/services/api/api')

const mockedFetchWithoutToken = mocked(fetchWithoutToken, true)

describe('getNummeraanduidingByAddress', () => {
  beforeEach(() => {
    mockedFetchWithoutToken.mockReset()
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
    mockedFetchWithoutToken.mockReturnValueOnce(Promise.resolve(nummeraanduidingFixture))

    const queryParams = '?postcode=1016XX&huisnummer=0001'

    await expect(getNummeraanduidingByAddress(queryParams)).resolves.toEqual(
      nummeraanduidingFixture,
    )

    expect(mockedFetchWithoutToken).toHaveBeenCalledWith(
      expect.stringContaining(joinUrl([environment.API_ROOT, 'v1/bag/nummeraanduiding'])),
    )

    expect(mockedFetchWithoutToken).toHaveBeenCalledWith(
      expect.stringContaining('postcode=1016XX&huisnummer=0001'),
    )
  })

  it('requests specific fields to receive', async () => {
    mockedFetchWithoutToken.mockReturnValueOnce(Promise.resolve(verblijfsobjectFieldFixture))

    const queryParams = '?postcode=1099AA&huisnummer=1000'
    const receiveFields = 'verblijfsobjectId,someOther,FooBar'

    await expect(getNummeraanduidingByAddress(queryParams, receiveFields)).resolves.toEqual(
      verblijfsobjectFieldFixture,
    )

    expect(mockedFetchWithoutToken).toHaveBeenCalledWith(
      expect.stringContaining(joinUrl([environment.API_ROOT, 'v1/bag/nummeraanduiding'])),
    )

    expect(mockedFetchWithoutToken).toHaveBeenCalledWith(
      expect.stringContaining(`${queryParams}&_fields=${encodeURIComponent(receiveFields)}`),
    )
  })
})
