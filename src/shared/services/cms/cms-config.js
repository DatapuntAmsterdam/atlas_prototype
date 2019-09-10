import SHARED_CONFIG from '../shared-config/shared-config'

const cmsConfig = {
  ARTICLE: {
    type: 'article',
    endpoint: id =>
      `${SHARED_CONFIG.CMS_ROOT}jsonapi/node/article?filter[drupal_internal__nid]=${id}&include=field_cover_image.field_media_image,field_downloads.field_file.field_media_file`,
    fields: [
      'field_cover_image.field_media_image.uri',
      'field_downloads',
      'field_downloads.title',
      'field_downloads.drupal_internal__nid',
      'field_downloads.field_file_type',
      'field_downloads.field_file_size',
      'field_downloads.field_file.field_media_file.uri',
      'field_links',
      'field_byline',
      'field_slug',
      'field_intro',
      'field_publication_date',
    ],
  },
  ARTICLES: {
    type: 'article',
    endpoint: () =>
      `${SHARED_CONFIG.CMS_ROOT}jsonapi/node/article?include=field_teaser_image.field_media_image&sort=-field_publication_date`,
    fields: [
      'field_teaser_image.field_media_image.uri',
      'field_teaser',
      'field_intro',
      'field_slug',
      'field_short_title',
      'field_publication_date',
    ],
  },
  PUBLICATION: {
    type: 'publication',
    endpoint: id =>
      `${SHARED_CONFIG.CMS_ROOT}jsonapi/node/publication?filter[drupal_internal__nid]=${id}&include=field_cover_image.field_media_image,field_file.field_media_file`,
    fields: [
      'field_cover_image.field_media_image.uri',
      'field_file.field_media_file.uri',
      'field_file_size',
      'field_file_type',
      'field_publication_source',
      'field_intro',
      'field_slug',
      'field_publication_year',
      'field_publication_month',
      'field_publication_day',
    ],
  },
  PUBLICATIONS: {
    type: 'publication',
    endpoint: () =>
      `${SHARED_CONFIG.CMS_ROOT}jsonapi/node/publication?include=field_teaser_image.field_media_image&sort=-field_publication_year,-field_publication_month,-field_publication_day`,
    fields: [
      'field_teaser_image.field_media_image.uri',
      'field_teaser',
      'field_intro',
      'field_slug',
      'field_short_title',
      'field_publication_year',
      'field_publication_month',
      'field_publication_day',
    ],
  },
  SPECIAL: {
    type: 'special',
    endpoint: id =>
      `${SHARED_CONFIG.CMS_ROOT}jsonapi/node/special?filter[drupal_internal__nid]=${id}`,
    fields: ['field_iframe_link', 'field_slug', 'field_special_type'],
  },
  SPECIALS: {
    type: 'special',
    endpoint: () =>
      `${SHARED_CONFIG.CMS_ROOT}jsonapi/node/special?include=field_teaser_image.field_media_image&sort=-created`,
    fields: [
      'field_teaser_image.field_media_image.uri',
      'field_slug',
      'field_special_type',
      'field_intro',
    ],
  },
}

export default cmsConfig
