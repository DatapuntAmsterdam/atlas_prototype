import { Adres } from '../../api/iiif-metadata/bouwdossier'

/* eslint-disable camelcase */
export const formatAddress = ({
  locatie_aanduiding,
  straat,
  huisnummer_letter,
  huisnummer_toevoeging,
  huisnummer_van,
  huisnummer_tot,
}: Adres) => {
  if (locatie_aanduiding) {
    return locatie_aanduiding
  }

  let label = straat

  if (huisnummer_van && huisnummer_tot) {
    label = `${label} ${huisnummer_van}${
      huisnummer_tot !== huisnummer_van ? `-${huisnummer_tot}` : ''
    }`
  } else {
    label = `${label} ${huisnummer_van || ''}${huisnummer_letter || ''}${
      huisnummer_toevoeging ? `-${huisnummer_toevoeging}` : ''
    }`
  }

  return label.trim()
}

type AddressResult = {
  id: string
  type: 'verblijfsobject'
  label: string
}

const getAddresses = (results: Adres[]) =>
  results
    .reduce<AddressResult[]>(
      (reducedResults, adres) => [
        ...reducedResults,
        ...adres.verblijfsobjecten.reduce<AddressResult[]>(
          (reducedVerblijfsobjecten, verblijfsobject, i) => [
            ...reducedVerblijfsobjecten,
            {
              id: verblijfsobject,
              type: 'verblijfsobject',
              label: adres.verblijfsobjecten_label[i] || formatAddress(adres),
            },
          ],
          [],
        ),
      ],
      [],
    )
    .sort((a, b) => a.label.localeCompare(b.label))

export default getAddresses
