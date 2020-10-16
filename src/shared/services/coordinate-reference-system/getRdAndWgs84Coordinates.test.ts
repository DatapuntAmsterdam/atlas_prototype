import { mocked } from 'ts-jest/utils'
import { rdToWgs84, wgs84ToRd } from './crs-converter'
import getRdAndWgs84Coordinates from './getRdAndWgs84Coordinates'

jest.mock('./crs-converter')

const mockedRdToWgs84 = mocked(rdToWgs84, true)
const mockedWgs84ToRd4 = mocked(wgs84ToRd, true)

const MOCK_X = 85530.0525
const MOCK_Y = 446100.5804
const MOCK_LAT = 51.9989298421
const MOCK_LNG = 4.37558717217

describe('getRdAndWgs84Coordinates', () => {
  it('ignores a coordinate with an altitude', () => {
    expect(getRdAndWgs84Coordinates([0, 0, 0], 'WGS84')).toEqual('')
  })

  it('converts an RD coordinate and formats it accordingly', () => {
    mockedRdToWgs84.mockImplementationOnce(() => ({ latitude: MOCK_LAT, longitude: MOCK_LNG }))

    const result = getRdAndWgs84Coordinates([MOCK_X, MOCK_Y], 'RD')

    expect(mockedRdToWgs84).toHaveBeenCalledWith({ x: MOCK_X, y: MOCK_Y })
    expect(result).toEqual('85530.05, 446100.58 (51.9989298, 4.3755872)')
  })

  it('converts a WGS84 coordinate and formats it accordingly', () => {
    mockedWgs84ToRd4.mockImplementationOnce(() => ({ x: MOCK_X, y: MOCK_Y }))

    const result = getRdAndWgs84Coordinates([MOCK_LAT, MOCK_LNG], 'WGS84')

    expect(mockedWgs84ToRd4).toHaveBeenCalledWith({ lat: MOCK_LAT, lng: MOCK_LNG })
    expect(result).toEqual('85530.05, 446100.58 (51.9989298, 4.3755872)')
  })
})
