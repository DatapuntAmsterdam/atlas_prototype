import transformResultByType from './transform-result-by-type'

describe('transformResultByType', () => {
  it('should get the default description when the results are not adress or openbareruimte', async () => {
    const result = {
      properties: {
        code: 'A',
        display: 'Centrum',
        distance: 746.859791397161,
        id: '03630000000018',
        type: 'gebieden/stadsdeel',
        uri: 'https://acc.api.data.amsterdam.nl/gebieden/stadsdeel/03630000000018/',
      },
    }
    expect(transformResultByType(result)).toEqual({
      categoryLabel: 'Gebied',
      categoryLabelPlural: 'Gebieden',
      label: 'Centrum',
      parent: undefined,
      statusLabel: 'stadsdeel',
      type: 'gebieden/stadsdeel',
      uri: 'https://acc.api.data.amsterdam.nl/gebieden/stadsdeel/03630000000018/',
    })
  })

  it('should get the address description', () => {
    const result = {
      dataset: 'bag',
      hoofdadres: true,
      landelijk_id: '0363200000391071',
      properties: {
        uri: 'https://acc.api.data.amsterdam.nl/bag/nummeraanduiding/0363200000391071/',
        display: 'Singel 190-2',
        type: 'pand/address',
        parent: 'bag/pand',
      },
      vbo_status: 'Verblijfsobject in gebruik',
      _display: 'Singel 190-2',
    }
    expect(transformResultByType(result)).toEqual({
      categoryLabel: 'Adres',
      categoryLabelPlural: 'Adressen',
      isNevenadres: false,
      label: 'Singel 190-2',
      parent: 'bag/pand',
      status: 'Verblijfsobject in gebruik',
      statusLabel: '',
      type: 'pand/address',
      uri: 'https://acc.api.data.amsterdam.nl/bag/nummeraanduiding/0363200000391071/',
    })
  })

  it('should get the openbareruimte description', () => {
    const result = {
      properties: {
        display: 'Torensteeg',
        distance: 7.2270743707366,
        id: '0363300000005142',
        opr_type: 'Weg',
        type: 'bag/openbareruimte',
        uri: 'https://acc.api.data.amsterdam.nl/bag/openbareruimte/03630000005142/',
      },
    }
    expect(transformResultByType(result)).toEqual({
      categoryLabel: 'Openbare ruimte',
      categoryLabelPlural: 'Openbare ruimtes',
      label: 'Torensteeg',
      parent: undefined,
      statusLabel: '',
      type: 'bag/openbareruimte',
      uri: 'https://acc.api.data.amsterdam.nl/bag/openbareruimte/03630000005142/',
    })
  })

  it('should get the openbareruimte description when opr_type is not "Weg" ', () => {
    const result = {
      properties: {
        display: 'Torensteeg',
        distance: 7.2270743707366,
        id: '0363300000005142',
        opr_type: 'NotWeg',
        type: 'bag/openbareruimte',
        uri: 'https://acc.api.data.amsterdam.nl/bag/openbareruimte/03630000005142/',
      },
    }
    expect(transformResultByType(result)).toEqual({
      categoryLabel: 'Openbare ruimte',
      categoryLabelPlural: 'Openbare ruimtes',
      label: 'Torensteeg',
      parent: undefined,
      statusLabel: 'NotWeg',
      type: 'bag/openbareruimte',
      uri: 'https://acc.api.data.amsterdam.nl/bag/openbareruimte/03630000005142/',
    })
  })
})
