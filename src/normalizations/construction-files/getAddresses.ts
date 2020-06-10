/* eslint-disable camelcase */
function formatAddress(
  locationLabel: string,
  street: string,
  houseNumberLetter?: string,
  houseNumberAddition?: string,
  houseNumberStarting?: number,
  houseNumberEnd?: number,
) {
  if (locationLabel) {
    return locationLabel
  }

  let label = street

  if (houseNumberStarting && houseNumberEnd) {
    label += ` ${houseNumberStarting}${
      houseNumberEnd !== houseNumberStarting ? `-${houseNumberEnd}` : ''
    }`
  } else {
    label += ` ${houseNumberStarting || ''}${houseNumberLetter || ''}${
      houseNumberAddition ? `-${houseNumberAddition}` : ''
    }`
  }

  return label
}

export type Address = {
  nummeraanduidingen: Array<string>
  nummeraanduidingen_label: Array<string>
  verblijfsobjecten: Array<string>
  verblijfsobjecten_label: Array<string>
  locatie_aanduiding: string
  straat: string
  huisnummer_letter?: string
  huisnummer_toevoeging?: string
  huisnummer_van?: number
  huisnummer_tot?: number
}

type AddressResult = {
  id: string
  type: 'nummeraanduiding' | 'verblijfsobject'
  label: string
}

export default function getAddresses(results: Array<Address>) {
  return results.reduce<Array<AddressResult>>(
    (
      acc,
      {
        nummeraanduidingen,
        nummeraanduidingen_label,
        verblijfsobjecten,
        verblijfsobjecten_label,
        locatie_aanduiding,
        straat,
        huisnummer_letter,
        huisnummer_toevoeging,
        huisnummer_van,
        huisnummer_tot,
      },
    ) => [
      ...acc,
      ...nummeraanduidingen.reduce<Array<AddressResult>>(
        (acc2, nummeraanduiding, i) => [
          ...acc2,
          { id: nummeraanduiding, type: 'nummeraanduiding', label: nummeraanduidingen_label[i] },
        ],
        [],
      ),
      ...verblijfsobjecten.reduce<Array<AddressResult>>(
        (acc2, verblijfsobject, i) => [
          ...acc2,
          {
            id: verblijfsobject,
            type: 'verblijfsobject',
            label:
              verblijfsobjecten_label[i] ||
              formatAddress(
                locatie_aanduiding,
                straat,
                huisnummer_letter,
                huisnummer_toevoeging,
                huisnummer_van,
                huisnummer_tot,
              ),
          },
        ],
        [],
      ),
    ],
    [],
  )
}
