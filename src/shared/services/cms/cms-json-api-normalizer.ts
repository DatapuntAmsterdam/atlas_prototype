/* eslint-disable camelcase */
// @ts-ignore
import normalize from 'json-api-normalize'
import type { Single } from '../../../api/cms/article'
import type { NormalizedResult } from '../../../normalizations/cms/types'
import type { CmsType } from '../../config/cms.config'

export const getType = (type?: string) => type && type.replace('node--', '')

const getNormalizedItem = (item: NormalizedResult, extraData = {}): NormalizedResult => {
  // Make sure the correct fields have data here to be used by normalizeCMSResults()
  return {
    ...extraData,
    ...item,
    type: getType(item.type) as CmsType,
    intro: item.field_intro,
    short_title: item.field_short_title,
    media_image_url: item.field_cover_image
      ? item.field_cover_image.field_media_image.uri.url
      : item.media_image_url,
    teaser_url: item.field_teaser_image
      ? item.field_teaser_image.field_media_image.uri.url
      : item.teaser_url,
  }
}

export const reformatJSONApiResults = (normalizedData: NormalizedResult) => {
  // In case of a Drupal collection resource the returned data will include several objects that need to be normalized
  if (normalizedData.field_items && !normalizedData.field_blocks) {
    return normalizedData.field_items.map((item) => getNormalizedItem(item, normalizedData))
  }

  // Todo: Need to refactor this when we really know what types and fields to expect from the CMS
  // This if-statement is an "exeption" for the CollectionDetail pages.
  if (normalizedData.field_items && normalizedData.field_blocks) {
    return {
      ...normalizedData,
      field_blocks: normalizedData.field_blocks.map((fieldBlock) => ({
        ...fieldBlock,
        field_content:
          fieldBlock.field_content instanceof Array
            ? fieldBlock.field_content.map((item) => getNormalizedItem(item))
            : fieldBlock.field_content,
      })),
      field_items: normalizedData.field_items.map((item) => getNormalizedItem(item)),
    }
  }

  // When a single Drupal resource has been requested return different normalized results
  return getNormalizedItem(normalizedData)
}

const cmsJsonApiNormalizer = (data: Single, fields: string[]) => {
  const normalizedData = removeEmptyContent(
    normalize(data).get(['id', 'title', 'body', 'created', 'type', ...fields]),
  )
  /**
   * Nasty hack because json-api-normalize can sometimes mess up the order of the related fields
   * Todo: https://datapunt.atlassian.net/browse/DI-406
   */
  const sortedItems = data?.data?.relationships?.field_items?.data ?? []

  if (normalizedData?.field_items?.length && sortedItems instanceof Array) {
    const fieldItems = [...normalizedData.field_items].sort(
      (a, b) =>
        sortedItems.indexOf(sortedItems.filter(({ id }) => a.id === id)[0]) -
        sortedItems.indexOf(sortedItems.filter(({ id }) => b.id === id)[0]),
    )

    return reformatJSONApiResults({
      ...normalizedData,
      field_items: fieldItems,
    })
  }

  return reformatJSONApiResults(normalizedData)
}

function removeEmptyContent(data: NormalizedResult) {
  return {
    ...data,
    ...(data.field_blocks
      ? { field_blocks: data.field_blocks.filter((block) => !!block.field_content) }
      : {}),
  }
}

export default cmsJsonApiNormalizer
