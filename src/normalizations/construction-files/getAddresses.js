export default (addresses) =>
  addresses.reduce(
    (acc, address) => [
      ...acc,
      ...address.nummeraanduidingen.reduce(
        (acc2, nummerAanduiding, i) => [
          ...acc2,
          { id: nummerAanduiding, label: address.nummeraanduidingen_label[i] },
        ],
        [],
      ),
    ],
    [],
  )
