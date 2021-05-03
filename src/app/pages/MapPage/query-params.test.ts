import { v4 as uuid } from 'uuid'
import encodeParam from '../../utils/encodeParam'
import {
  isEmbeddedParam,
  panoFovParam,
  panoHeadingParam,
  panoPitchParam,
  panoTagParam,
  PolyDrawing,
  polygonParam,
  polylineParam,
} from './query-params'

describe('panoTagParam', () => {
  describe('isEmbeddedParam', () => {
    it('encodes the value to parameter value', () => {
      expect(isEmbeddedParam.encode(true)).toBe('true')
      expect(isEmbeddedParam.encode(false)).toBe('false')
    })

    it('decodes the value from the parameter', () => {
      expect(isEmbeddedParam.decode('true')).toBe(true)
      expect(isEmbeddedParam.decode('false')).toBe(false)
    })
  })

  it('encodes the parameter', () => {
    expect(panoTagParam.encode('pano2016bi')).toBe('pano2016bi')
  })

  it('decodes the parameter', () => {
    expect(panoTagParam.decode('pano2017woz')).toBe('pano2017woz')
  })

  it('decodes the parameter with a legacy value', () => {
    expect(panoTagParam.decode('mission-2016,mission-bi')).toBe('pano2016bi')
    expect(panoTagParam.decode('mission-2017,mission-woz')).toBe('pano2017woz')
  })

  it('falls back to default value when decoding a non-existent value', () => {
    expect(panoTagParam.decode('somevalue')).toBe(panoTagParam.defaultValue)
    expect(panoTagParam.decode('somevalue,mission-woz')).toBe(panoTagParam.defaultValue)
    expect(panoTagParam.decode('some-value,missionwoz')).toBe(panoTagParam.defaultValue)
    expect(panoTagParam.decode('somevalue,missionwoz,someothervalue')).toBe(
      panoTagParam.defaultValue,
    )
  })
})

describe('panoPitchParam and panoHeadingParam', () => {
  it('should encode the value to parameter value', () => {
    expect(panoPitchParam.encode(123)).toBe('123')
    expect(panoPitchParam.encode(0)).toBe('0')

    expect(panoHeadingParam.encode(123)).toBe('123')
    expect(panoHeadingParam.encode(0)).toBe('0')

    expect(panoPitchParam.encode(-123.12312412344)).toBe('-123.12312412344')
    expect(panoHeadingParam.encode(-123.12312412344)).toBe('-123.12312412344')
  })

  it('should decode the value from the parameter', () => {
    expect(panoPitchParam.decode('123')).toBe(123)
    expect(panoPitchParam.decode('0')).toBe(0)

    expect(panoHeadingParam.decode('123')).toBe(123)
    expect(panoHeadingParam.decode('0')).toBe(0)

    expect(panoPitchParam.decode('-123.12312412344')).toBe(-123.12312412344)
    expect(panoPitchParam.decode('notanumber')).toBe(null)
    expect(panoHeadingParam.decode('-123.12312412344')).toBe(-123.12312412344)
    expect(panoHeadingParam.decode('notanumber')).toBe(null)
  })
})

describe('panoFovParam', () => {
  it('should encode the value to parameter value', () => {
    expect(panoFovParam.encode(123)).toBe('123')
    expect(panoFovParam.encode(0)).toBe('0')
    expect(panoFovParam.encode(-123.12312412344)).toBe('-123')
  })

  it('should decode the value from the parameter', () => {
    expect(panoFovParam.decode('123')).toBe(123)
    expect(panoFovParam.decode('0')).toBe(0)
    expect(panoFovParam.decode('-123.12312412344')).toBe(-123)
    expect(panoFovParam.decode('notanumber')).toBe(null)
  })
})

describe('polygonParam and polylineParam', () => {
  const id = uuid()
  const expectedEncoded = `{"id":"${id}","polygon":[[52.37628201724842,4.896165591846303],[52.37422313732434,4.891254241303624],[52.37422452094195,4.898852807226181]]}`
  const expectedDecoded: PolyDrawing = {
    id,
    polygon: [
      { lat: 52.37628201724842, lng: 4.896165591846303 },
      { lat: 52.37422313732434, lng: 4.891254241303624 },
      { lat: 52.37422452094195, lng: 4.898852807226181 },
    ],
  }

  it('encodes the parameter', () => {
    expect(encodeParam(polygonParam, expectedDecoded)).toEqual(expectedEncoded)
    expect(encodeParam(polygonParam, null)).toEqual(null)

    expect(encodeParam(polylineParam, expectedDecoded)).toEqual(expectedEncoded)
    expect(encodeParam(polylineParam, null)).toEqual(null)
  })

  it('decodes the parameter', () => {
    expect(polygonParam.decode(expectedEncoded)).toEqual(expectedDecoded)
    expect(polylineParam.decode(expectedEncoded)).toEqual(expectedDecoded)
  })

  it('decodes the parameter with a legacy value', () => {
    const description = '1,21 km en 59.151,1 m²'
    const legacyValue = `{"description":"${description}","markers":"52.37628201724842:4.896165591846303|52.37422313732434:4.891254241303624|52.37422452094195:4.898852807226181"}`
    const expectedLegacy = {
      id: btoa(description),
      polygon: expectedDecoded.polygon,
    }

    expect(polygonParam.decode(legacyValue)).toEqual(expectedLegacy)
    expect(polylineParam.decode(legacyValue)).toEqual(expectedLegacy)
  })
})
