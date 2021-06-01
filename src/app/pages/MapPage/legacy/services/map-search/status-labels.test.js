import { getStatusLabelAddress, getStatusLabel } from './status-labels'

describe('getStatusLabel', () => {
  it('should get een empty label when the type is not found', () => {
    expect(getStatusLabel('not/known')).toEqual('')
  })

  it('should get the right label when the type is known', () => {
    expect(getStatusLabel('bag/ligplaats')).toEqual('ligplaats')
  })

  it('should get the right label when the type is known', () => {
    expect(getStatusLabel('ligplaats')).toEqual('ligplaats')
  })
})

describe('getStatusLabelAddress', () => {
  it('should return Nevenadres when is not hoofdadres ', () => {
    const result = {
      type_adres: 'Not a Hoofdadres',
      vbo_status: 'Verblijfsobject in gebruik',
    }
    expect(getStatusLabelAddress(result)).toEqual('Nevenadres')
  })

  it('should return Verblijfsobject in gebruik when is  hoofdadres ', () => {
    const result = {
      type_adres: 'Hoofdadres',
      vbo_status: 'a random, not normal status',
    }
    expect(getStatusLabelAddress(result)).toEqual('a random, not normal status')
  })

  it('should return Nevenadres when is not hoofdadres ', () => {
    const result = {
      type_adres: 'Not a Hoofdadres',
      vbo_status: 'a random, not normal status',
    }
    expect(getStatusLabelAddress(result)).toEqual('a random, not normal status Nevenadres')
  })
})
