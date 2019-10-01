/* eslint-disable camelcase */
import { EDITORIAL_DETAIL_ACTIONS } from '../../app/pages/EditorialOverviewPage/constants'
import SHARED_CONFIG from '../../shared/services/shared-config/shared-config'
import useSlug from '../../app/utils/useSlug'
import formatDate from '../../shared/services/date-formatter/date-formatter'
import PAGES from '../../app/pages'

const normalizeObject = (data, type) => {
  const {
    uuid,
    slug,
    title,
    body,
    teaser_url,
    short_title,
    field_teaser,
    intro,
    field_special_type,
    field_publication_date,
    field_publication_year,
    field_publication_month,
    field_file,
    media_image_url,
    ...otherFields
  } = data

  // The type SPECIALS has a different url structure
  const to =
    type === PAGES.SPECIALS
      ? EDITORIAL_DETAIL_ACTIONS[type](uuid, field_special_type, slug)
      : EDITORIAL_DETAIL_ACTIONS[type](uuid, slug || useSlug(title))

  let localeDate = field_publication_date

  let localeDateFormatted = field_publication_date && formatDate(new Date(field_publication_date))

  /**
   * Sometimes we don't get a field_publication_date, but only a field_publication_year and / or field_publication_month
   * Then we need to convert it to a locale date that only shows the year or year and month
   */
  if (!field_publication_date && (field_publication_year || field_publication_month)) {
    localeDate = new Date(
      Date.UTC(field_publication_year, field_publication_month || 1, 1, 0, 0, 0),
    )

    localeDateFormatted = formatDate(
      localeDate,
      false,
      !!field_publication_month,
      !!field_publication_year,
    )
  }

  const buildImageUrl = url => `${SHARED_CONFIG.CMS_ROOT}${url}`

  const imageIsVertical = type === PAGES.PUBLICATIONS

  const teaserImage = teaser_url && buildImageUrl(teaser_url)
  const coverImage = media_image_url && buildImageUrl(media_image_url)

  // Construct the file url when the type is PUBLICATION
  let fileUrl
  if (type === PAGES.PUBLICATIONS) {
    const { url } = field_file ? field_file.field_media_file.uri : {}
    fileUrl = url
  }

  return {
    key: uuid,
    id: uuid,
    title,
    body: body && body.value,
    teaserImage,
    coverImage,
    imageIsVertical,
    shortTitle: short_title,
    teaser: field_teaser,
    intro,
    specialType: field_special_type,
    fileUrl,
    localeDate,
    localeDateFormatted,
    to,
    ...otherFields,
  }
}

const useNormalizedCMSResults = (data, type) => {
  // The data can be in the form of an array when used on the homepage or an overview page
  if (data.results || (data && data.length)) {
    const dataArray = data.results || data

    // Return different format when the data include links to other endpoints
    return data._links
      ? {
          data: dataArray.map(dataItem => normalizeObject(dataItem, type)),
          links: data._links,
        }
      : dataArray.map(dataItem => normalizeObject(dataItem, type))
  }

  // Format just a single data object
  return normalizeObject(data, type)
}

export default useNormalizedCMSResults
