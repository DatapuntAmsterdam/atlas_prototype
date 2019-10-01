import normalize from 'json-api-normalize'

const cmsNormalizer = (data, fields) => {
  const normalizedData = normalize(data).get(['id', 'title', 'body', 'created', ...fields])

  // In case of a Drupal collection resource the returned data will include several objects that need to be normalized
  if (normalizedData.field_items) {
    return normalizedData.field_items.map(item => {
      const { url: teaserImageUrl } = item.field_teaser_image
        ? item.field_teaser_image.field_media_image.uri
        : {}

      // Make sure the correct fields have data here to be used by useNormalizedCMSResults()
      return {
        ...normalizedData,
        ...item,
        slug: item.field_slug,
        intro: item.field_intro,
        short_title: item.field_short_title,
        uuid: item.id,
        teaser_url: teaserImageUrl,
      }
    })
  }

  // When a single Drupal resource has been requested return different normalized results
  const { url: coverImageUrl } = normalizedData.field_cover_image
    ? normalizedData.field_cover_image.field_media_image.uri
    : {}

  return {
    ...normalizedData,
    uuid: normalizedData.id,
    slug: normalizedData.field_slug,
    media_image_url: coverImageUrl,
    intro: normalizedData.field_intro,
    body: normalizedData.body,
  }
}

export default cmsNormalizer
