function formatAddress(
  locationLabel,
  street,
  houseNumberLetter,
  houseNumberAddition,
  houseNumberStarting,
  houseNumberEnd,
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
    label += ` ${houseNumberStarting || ''}${houseNumberAddition || ''}${houseNumberLetter || ''}`
  }

  return label
}

export default (results) =>
  results.reduce(
    (
      acc,
      {
        nummeraanduidingen,
        nummeraanduidingen_label: nummeraanduidingenLabel,
        verblijfsobjecten,
        verblijfsobjecten_label: verblijfsobjectenLabel,
        locatie_aanduiding: locationLabel,
        straat: street,
        huisnummer_letter: houseNumberLetter,
        huisnummer_toevoeging: houseNumberAddition,
        huisnummer_van: houseNumberStarting,
        huisnummer_tot: houseNumberEnd,
      },
    ) => [
      ...acc,
      ...nummeraanduidingen.reduce(
        (acc2, nummeraanduiding, i) => [
          ...acc2,
          { id: nummeraanduiding, type: 'nummeraanduiding', label: nummeraanduidingenLabel[i] },
        ],
        [],
      ),
      ...verblijfsobjecten.reduce(
        (acc2, verblijfsobject, i) => [
          ...acc2,
          {
            id: verblijfsobject,
            type: 'verblijfsobject',
            label:
              verblijfsobjectenLabel[i] ||
              formatAddress(
                locationLabel,
                street,
                houseNumberLetter,
                houseNumberAddition,
                houseNumberStarting,
                houseNumberEnd,
              ),
          },
        ],
        [],
      ),
    ],
    [],
  )
