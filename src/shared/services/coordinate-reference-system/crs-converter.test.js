import proj4 from 'proj4'
import {
  wgs84ToRd,
  rdToWgs84,
  parseLocationString,
  normalizeCoordinate,
  normalizeLocation,
} from './crs-converter'

jest.mock('proj4')

describe('The CRS converter service', () => {
  afterEach(() => {
    proj4.mockReset()
  })

  it('can convert from WGS84 to RD coordinates', () => {
    proj4.mockImplementation(() => [3, 4])

    const wgs84Coordinates = {
      latitude: 1,
      longitude: 0,
    }
    const actual = wgs84ToRd(wgs84Coordinates)

    expect(actual).toEqual({ x: 3, y: 4 })
  })

  it('can convert from RD to WGS84 coordinates', () => {
    proj4.mockImplementation(() => [3, 4])

    const rdCoordinates = { x: 1, y: 0 }
    const actual = rdToWgs84(rdCoordinates)

    expect(proj4.mock.calls[0][2]).toEqual([1, 0])
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
