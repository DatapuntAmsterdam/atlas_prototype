import { getDetailPageData } from './actions'

describe('getDetailPageData', () => {
  it('extract the type, subtype and id from a detail endpoint', () => {
    expect(getDetailPageData('https://example.com/brk/object/1234')).toEqual({
      type: 'brk',
      subtype: 'object',
      id: '1234',
    })
  })

  it('should map the subtype if needed', () => {
    expect(getDetailPageData('https://example.com/v1/bag/woonplaatsen/1234')).toEqual({
      type: 'bag',
      subtype: 'woonplaats',
      id: '1234',
    })
  })

  it('should handle v1.1 endpoints', () => {
    expect(getDetailPageData('https://example.com/bag/v1.1/woonplaats/1234')).toEqual({
      type: 'bag',
      subtype: 'woonplaats',
      id: '1234',
    })
  })
  it('should return an object with values set to null when the type, subtype or id cannot be extracted', () => {
    expect(getDetailPageData('https://example.com/')).toEqual({
      type: null,
      subtype: null,
      id: null,
    })
  })
})
