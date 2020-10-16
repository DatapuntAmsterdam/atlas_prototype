import proj4 from 'proj4'
import { mocked } from 'ts-jest/utils'
import {
  normalizeCoordinate,
  normalizeLocation,
  parseLocationString,
  rdToWgs84,
  wgs84ToRd,
} from './crs-converter'

jest.mock('proj4')

const mockedProj4 = mocked(proj4, true)

describe('The CRS converter service', () => {
  afterEach(() => {
    mockedProj4.mockReset()
  })

  it('can convert from WGS84 to RD coordinates', () => {
    mockedProj4.mockImplementation(() => [3, 4])

    const wgs84Coordinates = {
      latitude: 1,
      longitude: 0,
    }
    const actual = wgs84ToRd(wgs84Coordinates)

    expect(actual).toEqual({ x: 3, y: 4 })
  })

  it('can convert from RD to WGS84 coordinates', () => {
    mockedProj4.mockImplementation(() => [3, 4])

    const rdCoordinates = { x: 1, y: 0 }
    const actual = rdToWgs84(rdCoordinates)

    expect(mockedProj4.mock.calls[0][2]).toEqual([1, 0])
    expect(actual).toEqual({
      latitude: 4,
      longitude: 3,
    })
  })

  it('should parse the location string', () => {
    expect(parseLocationString('52.11,4.22')).toEqual({
      lat: 52.11,
      lng: 4.22,
    })
  })

  it('should correct normalize coordinates', () => {
    expect(normalizeCoordinate(5.12345678, 4)).toEqual(5.1235)
  })

  it('should correct normalize locations', () => {
    expect(
      normalizeLocation(
        {
          latitude: 52.12345678,
          longitude: 4.222222323,
        },
        5,
      ),
    ).toEqual({
      latitude: 52.12346,
      longitude: 4.22222,
    })
  })
})
