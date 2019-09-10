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
      hoofdadres: false,
      vbo_status: { code: '21', omschrijving: 'Verblijfsobject in gebruik' },
    }
    expect(getStatusLabelAddress(result)).toEqual('Nevenadres')
  })

  it('should return Verblijfsobject in gebruik when is  hoofdadres ', () => {
    const result = {
      hoofdadres: true,
      vbo_status: {
        code: '18',
        omschrijving: 'a random, not normal status',
      },
    }
    expect(getStatusLabelAddress(result)).toEqual('a random, not normal status')
  })

  it('should return Nevenadres when is not hoofdadres ', () => {
    const result = {
      hoofdadres: false,
      vbo_status: {
        code: '18',
        omschrijving: 'a random, not normal status',
      },
    }
    expect(getStatusLabelAddress(result)).toEqual('a random, not normal status Nevenadres')
  })
})
