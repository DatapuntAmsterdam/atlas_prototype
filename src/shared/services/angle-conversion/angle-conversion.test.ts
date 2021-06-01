import { degreesToRadians, radiansToDegrees } from './angle-conversion'

describe('The angle conversion service', () => {
  it('can convert degrees to radians', () => {
    expect(degreesToRadians(0).toFixed(2)).toBe('0.00')
    expect(degreesToRadians(45).toFixed(2)).toBe('0.79')
    expect(degreesToRadians(50).toFixed(2)).toBe('0.87')
    expect(degreesToRadians(270).toFixed(2)).toBe('4.71')
    expect(degreesToRadians(360).toFixed(2)).toBe('6.28')
    expect(degreesToRadians(361).toFixed(2)).toBe('6.30')
  })

  it('can convert radians to degrees', () => {
    expect(radiansToDegrees(0).toFixed(2)).toBe('0.00')
    expect(radiansToDegrees(1).toFixed(2)).toBe('57.30')
    expect(radiansToDegrees(2).toFixed(2)).toBe('114.59')
    expect(radiansToDegrees(6).toFixed(2)).toBe('343.77')
    expect(radiansToDegrees(7).toFixed(2)).toBe('401.07')
  })
})
