import formatNumber from './number-formatter'

describe('The number formatter service', () => {
  it('turns a number into a decimal string', () => {
    expect(formatNumber(3.14159265359, 4)).toEqual('3,1416')
  })
})
