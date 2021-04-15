/* eslint-disable @typescript-eslint/naming-convention */
import { Link as RouterLink } from 'react-router-dom'
import {
  toArticleDetail,
  toCollectionDetail,
  toPublicationDetail,
  toSpecialDetail,
} from '../../app/links'
import formatDate from '../../app/utils/formatDate'
import toSlug from '../../app/utils/toSlug'
import { CmsType, SpecialType } from '../../shared/config/cms.config'
import { FieldLink, NormalizedFieldItems, NormalizedResult } from './types'

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
const cleanupDrupalUri = (uri: string) => uri.replace(/&amp;/g, '&')

export const getLocaleFormattedDate = ({
  field_publication_date,
  field_publication_day,
  field_publication_year,
  field_publication_month,
}: Partial<NormalizedResult> = {}) => {
  const year = field_publication_year && parseInt(field_publication_year, 10)
  const yearIsValidNumber = year && !Number.isNaN(year)
  const hasPossibleValidDate =
    (field_publication_date && field_publication_date?.length > 0) ?? yearIsValidNumber

  if (!hasPossibleValidDate) {
    return {
      localeDate: '',
      localeDateFormatted: '',
    }
  }

  if (field_publication_date) {
    return {
      localeDate: field_publication_date,
      localeDateFormatted: formatDate(new Date(field_publication_date)),
    }
  }

  const day = field_publication_day && parseInt(field_publication_day, 10)
  const monthIndex = field_publication_month && parseInt(field_publication_month, 10)
  const dayIsValidNumber = !Number.isNaN(day)

  const dateParts = [
    year,
    monthIndex && !Number.isNaN(monthIndex) && Math.max(0, monthIndex - 1),
    dayIsValidNumber && day,
  ].filter(Number.isFinite)

  // @ts-ignore
  const localeDate = new Date(Date.UTC(...dateParts))

  return {
    localeDate,
    // @ts-ignore
    localeDateFormatted: formatDate(localeDate, false),
  }
}

export const getLinkProps = (
  { type, id, field_link, field_special_type, title }: NormalizedResult,
  slug: string,
) => {
  let to = {}

  if (type && EDITORIAL_DETAIL_ACTIONS[type]) {
    const nodeAnchorPropsFn = EDITORIAL_DETAIL_ACTIONS[type]

    if (type === CmsType.Special) {
      to = nodeAnchorPropsFn(id, field_special_type, slug)
    } else {
      to = nodeAnchorPropsFn(id, slug)
    }
  }

  let linkProps = { to, forwardedAs: RouterLink }
  const externalUrl = field_link?.uri ? cleanupDrupalUri(field_link?.uri) : null

  // @ts-ignore
  linkProps = externalUrl ? { href: externalUrl, forwardedAs: 'a' } : linkProps
  // @ts-ignore
  linkProps = { ...linkProps, title } // Add the title attribute by default

  return {
    linkProps,
    to,
  }
}

export const normalizeObject = (data: NormalizedResult): NormalizedFieldItems => {
  const {
    id,
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
    field_links,
    ...otherFields
  } = data

  const slug = toSlug(title)

  const { linkProps, to } = getLinkProps(data, slug)
  const { localeDate, localeDateFormatted } = getLocaleFormattedDate(otherFields)

  const isPublicationType = type === CmsType.Publication

  const teaserImage = teaser_url && teaser_url
  const coverImage = media_image_url && media_image_url

  // Construct the file url when the type is PUBLICATION
  let fileUrl
  if (isPublicationType) {
    fileUrl = field_file?.field_media_file?.uri?.url
  }

  let links: FieldLink[] = []
  if (field_links) {
    links = field_links.map((link) => ({ ...link, uri: cleanupDrupalUri(link.uri) } as FieldLink))
  }

  return {
    key: id,
    id,
    title,
    type,
    body: body && body.value,
    teaserImage,
    coverImage,
    imageIsVertical: isPublicationType,
    shortTitle: short_title,
    teaser: field_teaser,
    intro,
    specialType: field_special_type as SpecialType,
    fileUrl,
    localeDate,
    localeDateFormatted,
    slug,
    to,
    linkProps,
    links,
    ...otherFields,
  }
}

const normalizeCMSResults = (data: NormalizedResult | NormalizedResult[]) => {
  return data instanceof Array
    ? // The data can be in the form of an array when used on the homepage or an overview page
      data.map((dataItem) => normalizeObject(dataItem))
    : // Format just a single data object
      normalizeObject(data)
}

export default normalizeCMSResults
