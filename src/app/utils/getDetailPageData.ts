const URL_SUBTYPES_MAPPING = {
  openbareruimtes: 'openbareruimte',
  woonplaatsen: 'woonplaats',
  ligplaatsen: 'ligplaats',
}

const getDetailPageData = (endpoint: string) => {
  // TODO: Add endpoint mapping when new router is introduced
  const url = endpoint
    .split('?')[0] // Remove query
    .replace('bag/v1.1/', 'bag/') // Clean URL if this is using the new BAG v1.1 API
    .replace('iiif-metadata/', 'bouwdossiers/') // Clean URL if this is using the new IIIF Metadata API
  // eslint-disable-next-line no-useless-escape
  const matches = /(\w+)\/([\w-]+)\/([\w\.-]+)\/?$/.exec(url)

  if (matches === null) {
    throw Error(
      `Type, subtype and id from the given endpoint to getDetailPageData could not be extracted`,
    )
  }
  return {
    type: matches[1],
    subtype: URL_SUBTYPES_MAPPING[matches[2]] ?? matches[2],
    id: matches[3],
  }
}

export default getDetailPageData
