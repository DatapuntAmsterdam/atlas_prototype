import bouwdossierFixture from '../../../test/fixtures/iiif-metadata_bouwdossier.json'
import getAddresses from './getAddresses'

describe('getAddresses', () => {
  it('returns a sorted list of objects', () => {
    const { adressen } = bouwdossierFixture
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
})
