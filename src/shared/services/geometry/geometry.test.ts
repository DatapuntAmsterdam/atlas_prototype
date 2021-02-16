import { Point } from 'geojson'
import * as crsConverter from '../coordinate-reference-system/crs-converter'
import getGeometry from './geometry'

describe('geometry', () => {
  it('returns null', () => {
    expect(getGeometry({ href: '' })).toBeNull()
  })

  it('returns geometry', () => {
    const geometrie: Point = { type: 'Point', coordinates: [0.5000001, 0.0000001] }

    expect(getGeometry({ href: '', geometrie })).toEqual(geometrie)
  })

  it('returns geometry from bezoekadres', () => {
    // point within the bounds of the municipality
    const { x, y } = crsConverter.wgs84ToRd({ latitude: 52.3725512, longitude: 4.8675804 })

    const geometrie: Point = { type: 'Point', coordinates: [x, y] }

    const data = {
      href: '',
      bezoekadres: {
        geometrie,
      },
    }

    expect(getGeometry(data)).toEqual(geometrie)
  })

  it('returns geometry from monumentcoordinaten', () => {
    const monumentcoordinaten: Point = { type: 'Point', coordinates: [0.5000001, 0.0000001] }

    const data = {
      href: '',
      monumentcoordinaten,
    }

    expect(getGeometry(data)).toEqual(monumentcoordinaten)
  })

  it('returns geometry from monumentcoordinaten when bezoekadres is out of bounds', () => {
    // point ouf of bounds of the municipality
    const { x, y } = crsConverter.wgs84ToRd({ latitude: 52.2316188, longitude: 5.125528 })

    const geometrie: Point = { type: 'Point', coordinates: [x, y] }
    const monumentcoordinaten: Point = { type: 'Point', coordinates: [0.5000001, 0.0000001] }

    const data = {
      href: '',
      bezoekadres: {
        geometrie,
      },
      monumentcoordinaten,
    }

    expect(getGeometry(data)).toEqual(monumentcoordinaten)
  })
})
