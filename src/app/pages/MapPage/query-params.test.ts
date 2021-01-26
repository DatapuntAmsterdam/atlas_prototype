import { v4 as uuid } from 'uuid'
import encodeParam from '../../utils/encodeParam'
import { panoTagParam, PolyDrawing, polygonParam, polylineParam } from './query-params'

describe('panoTagParam', () => {
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
