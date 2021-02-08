/* eslint-disable camelcase */
import { toArticleDetail, toPublicationDetail } from '../../app/links'
import formatDate from '../../app/utils/formatDate'
import pickLinkComponent from '../../app/utils/pickLinkComponent'
import toSlug from '../../app/utils/toSlug'
import { CmsType } from '../../shared/config/cms.config'
import { reformatJSONApiResults } from '../../shared/services/cms/cms-json-api-normalizer'
import { toCollectionDetail, toSpecialDetail } from '../../store/redux-first-router/actions'

export const EDITORIAL_DETAIL_ACTIONS = {
  [CmsType.Article]: toArticleDetail,
  [CmsType.Publication]: toPublicationDetail,
  [CmsType.Special]: toSpecialDetail,
  [CmsType.Collection]: toCollectionDetail,
}

// Logic is that we don't show metadata in an editorial detail page
export const EDITORIAL_FIELD_TYPE_VALUES = {
  CONTENT: 'content',
}

// Drupal JSONapi encodes `&` in URLs, which React can't handle https://github.com/facebook/react/issues/6873#issuecomment-227906893
const cleanupDrupalUri = (uri) => uri.replace(/&amp;/g, '&')

export const getLocaleFormattedDate = ({
  field_publication_date,
  field_publication_day,
  field_publication_year,
  field_publication_month,
} = {}) => {
  const year = parseInt(field_publication_year, 10)
  const yearIsValidNumber = Number.isNaN(year) === false
  const hasPossibleValidDate = field_publication_date?.length > 0 || yearIsValidNumber

  if (!hasPossibleValidDate) {
    return {
      localeDate: '',
      localeDateFormatted: '',
    }
  }

  if (field_publication_date) {
    return {
      localeDate: field_publication_date,
      localeDateFormatted: formatDate(new Date(field_publication_date.replace(' ', 'T'))),
    }
  }

  const day = parseInt(field_publication_day, 10)
  const monthIndex = parseInt(field_publication_month, 10)

  const dateParts = [
    year,
    !Number.isNaN(monthIndex) && monthIndex - 1,
    !Number.isNaN(day) && day,
  ].filter(Boolean)

  const localeDate = new Date(Date.UTC(...dateParts))

  return {
    localeDate,
    localeDateFormatted: formatDate(localeDate, false),
  }
}

export const normalizeObject = (data) => {
  const {
    uuid,
    title,
    type,
    body,
    teaser_url,
    short_title,
    field_teaser,
    intro,
    field_special_type,
    field_file,
    media_image_url,
    field_link,
    field_links,
    field_related,
    ...otherFields
  } = data

  const slug = toSlug(title)

  // The type SPECIALS has a different url structure
  // eslint-disable-next-line no-nested-ternary
  const to = EDITORIAL_DETAIL_ACTIONS[type]
    ? type === CmsType.Special
      ? EDITORIAL_DETAIL_ACTIONS[type](uuid, field_special_type, slug)
      : EDITORIAL_DETAIL_ACTIONS[type](uuid, slug)
    : {}

  // By default use the internal router, fallback on a div if there's no link.
  // If there's an externalUrl set, override the linkProps.
  let linkProps = to ? { to, forwardedAs: pickLinkComponent(to) } : { forwardedAs: 'div' }
  const externalUrl = field_link?.uri ? cleanupDrupalUri(field_link?.uri) : null

  linkProps = externalUrl ? { href: externalUrl, forwardedAs: 'a' } : linkProps
  linkProps = { ...linkProps, title } // Add the title attribute by default

  const { localeDate, localeDateFormatted } = getLocaleFormattedDate(otherFields)

  const imageIsVertical = type === CmsType.Publication

  const teaserImage = teaser_url && teaser_url
  const coverImage = media_image_url && media_image_url

  // Construct the file url when the type is PUBLICATION
  let fileUrl
  if (type === CmsType.Publication) {
    const { url } = field_file ? field_file.field_media_file.uri : {}
    fileUrl = url
  }

  let related = []
  if (field_related) {
    const reformattedRelatedResults = reformatJSONApiResults({ field_items: field_related })

    related = reformattedRelatedResults.map((dataItem) => normalizeObject(dataItem, type))
  }

  let links = []
  if (field_links) {
    links = field_links.map((link) => ({ ...link, uri: cleanupDrupalUri(link.uri) }))
  }

  return {
    key: uuid,
    id: uuid,
    title,
    type,
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
    slug,
    to,
    linkProps,
    related,
    links,
    ...otherFields,
  }
}

const useNormalizedCMSResults = (data) => {
  // The data can be in the form of an array when used on the homepage or an overview page
  if (data.results || (data && data.length)) {
    const dataArray = data.results || data

    // Return different format when the data include links to other endpoints
    return data._links
      ? {
          data: dataArray.map((dataItem) => normalizeObject(dataItem)),
          links: data._links,
        }
      : dataArray.map((dataItem) => normalizeObject(dataItem))
  }

  // Format just a single data object
  return normalizeObject(data)
}

export default useNormalizedCMSResults
