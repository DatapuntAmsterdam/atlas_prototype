import getIdEndpoint from './getIdEndpoint'

describe('getIdEndpoint', () => {
  it('get the id with a monumenten endpoint', () => {
    const [, , id] = getIdEndpoint('monumenten/monumenten/255c300c-d02f-412b-899e-dfa08cbd794d/')
    expect(id).toEqual('255c300c-d02f-412b-899e-dfa08cbd794d')
  })

  it('get the id with an openbare ruimte endpoint', () => {
    const [, , id] = getIdEndpoint('bag/v1.1/openbareruimte/0363300000003469/')
    expect(id).toEqual('0363300000003469')
  })

  it('returns an error with an invalid endpoint', () => {
    expect(() => {
      getIdEndpoint(
        '/data/?modus=kaart&lagen=onrzk-bgem%3A0%7Conrzk-kgem%3A0%7Conrzk-ksec%3A1%7Conrzk-kot%3A0&legenda=true',
      )
    }).toThrowError(Error('Could not extract ID from endpoint'))
  })
})
