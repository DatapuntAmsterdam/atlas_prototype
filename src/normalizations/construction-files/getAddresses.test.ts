import cloneDeep from 'lodash.clonedeep'
import bouwdossierFixture from '../../api/iiif-metadata/bouwdossier/fixture'

import getAddresses, { formatAddress } from './getAddresses'

describe('getAddresses', () => {
  it('returns a sorted list of addresses', () => {
    const { adressen } = cloneDeep(bouwdossierFixture)
    const sortedAddresses = getAddresses(adressen)
    const { verblijfsobjecten, verblijfsobjecten_label: verblijfsobjectenLabel } = adressen[0]
    const sortedVerblijfsobjectenLabels = verblijfsobjectenLabel.sort((a: string, b: string) =>
      a.localeCompare(b),
    )

    expect(sortedAddresses).toHaveLength(verblijfsobjecten.length)

    sortedAddresses.forEach((address, index) => {
      expect(verblijfsobjecten.includes(address.id)).toBeTruthy()
      expect(verblijfsobjectenLabel.includes(address.label)).toBeTruthy()

      expect(address.label).toEqual(sortedVerblijfsobjectenLabels[index])
      expect(address.type).toEqual('verblijfsobject')
    })
  })

  it('contains formatted address instead of verblijfsobjecten_label', () => {
    const { adressen } = cloneDeep(bouwdossierFixture)
    adressen[0].verblijfsobjecten_label = []

    const sortedAddresses = getAddresses(adressen)

    sortedAddresses.forEach((address) => {
      expect(address.label).toEqual(expect.stringContaining(adressen[0].straat))
    })
  })

  describe('formatAddress', () => {
    const { adressen } = bouwdossierFixture

    it('should give precendence over prop locatie_aanduiding', () => {
      const adres = cloneDeep(adressen[0])
      const locatieAanduiding = 'Foo bar baz'

      adres.verblijfsobjecten_label = []
      adres.locatie_aanduiding = locatieAanduiding

      expect(formatAddress(adres)).toEqual(locatieAanduiding)
    })

    it('should have huisnummer_van', () => {
      const adres = cloneDeep(adressen[0])
      adres.verblijfsobjecten_label = []

      expect(formatAddress(adres)).toEqual(`${adres.straat} ${adres.huisnummer_van}`)

      adres.huisnummer_tot = undefined

      expect(formatAddress(adres)).toEqual(`${adres.straat} ${adres.huisnummer_van}`)
    })

    it('should have huisnummer_tot', () => {
      const adres = cloneDeep(adressen[0])
      adres.verblijfsobjecten_label = []
      const huisnummerTot = 'Zork'
      adres.huisnummer_tot = huisnummerTot

      expect(formatAddress(adres)).toEqual(
        `${adres.straat} ${adres.huisnummer_van}-${huisnummerTot}`,
      )
    })

    it('should have huisnummer_toevoeging', () => {
      const adres = cloneDeep(adressen[0])
      adres.verblijfsobjecten_label = []
      adres.huisnummer_van = undefined
      adres.huisnummer_tot = undefined

      expect(formatAddress(adres)).toEqual(adres.straat)

      adres.huisnummer_toevoeging = 'Foo'

      expect(formatAddress(adres)).toEqual(`${adres.straat} -${adres.huisnummer_toevoeging}`)
    })
  })
})
