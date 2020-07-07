import { ENVIRONMENTS } from '../environment'

const { HOMEPAGE: HOMEPAGE_LINKS } = require('./content-links.json')

const SHARED_FIELDS = ['field_intro', 'field_cover_image.field_media_image.uri']

export enum CmsType {
  Article = 'article',
  Publication = 'publication',
  Special = 'special',
  Collection = 'collection',
  Link = 'link',
}

export enum SpecialType {
  Animation = 'animatie',
  Dashboard = 'dashboard',
  Dataset = 'dataset',
  Story = 'dataverhaal',
}

const cmsConfig = {
  ARTICLE: {
    endpoint: (id?: string) =>
      `${process.env.CMS_ROOT}jsonapi/node/article/${id}?include=field_accordions,field_cover_image.field_media_image,field_related.field_teaser_image.field_media_image,field_downloads.field_file.field_media_file`,
    fields: [
      'field_downloads',
      'field_downloads.title',
      'field_downloads.drupal_internal__nid',
      'field_downloads.field_file_type',
      'field_downloads.field_file_size',
      'field_downloads.field_file.field_media_file.uri',
      'field_links',
      'field_byline',
      'field_publication_date',
      'field_related.id',
      'field_related.title',
      'field_related.field_intro',
      'field_related.field_byline',
      'field_related.field_publication_date',
      'field_related.field_teaser_image.field_media_image.uri',
      'field_related.field_cover_image.field_media_image.uri',
      'field_related.field_special_type',
      'field_related.field_short_title',
      'field_related.field_teaser',
      'field_related.field_type',
      'field_related.type',
      'field_accordions',
      'field_accordions.field_accordion_content',
      'field_accordions.field_accordion_intro',
      'field_accordions.field_accordion_label',
      'field_accordions.field_accordion_title',
      'field_type',
      ...SHARED_FIELDS,
    ],
  },
  ARTICLES: {
    endpoint: () => `${process.env.API_ROOT}cms_search/search/article`,
  },
  PUBLICATION: {
    endpoint: (id: string) =>
      `${process.env.CMS_ROOT}jsonapi/node/publication/${id}?include=field_cover_image.field_media_image,field_file.field_media_file`,
    fields: [
      'field_file.field_media_file.uri',
      'field_file_size',
      'field_file_type',
      'field_publication_source',
      'field_publication_year',
      'field_publication_month',
      'field_publication_day',
      ...SHARED_FIELDS,
    ],
  },
  PUBLICATIONS: {
    endpoint: () => `${process.env.API_ROOT}cms_search/search/publication`,
  },
  SPECIAL: {
    endpoint: (id: string) => `${process.env.CMS_ROOT}jsonapi/node/special/${id}`,
    fields: [
      'field_links',
      'field_content_link',
      'field_special_type',
      'field_subtitle_link',
      'field_subtitle_default',
      'field_publication_date',
      ...SHARED_FIELDS,
    ],
  },
  SPECIALS: {
    endpoint: () => `${process.env.API_ROOT}cms_search/search/special`,
  },
  CMS_COLLECTION_DETAIL: {
    endpoint: (id?: string) =>
      `${process.env.CMS_ROOT}jsonapi/node/list/${id}?fields[node--collection]=title,field_intro,field_slug,field_link,field_blocks,field_blocks.field_content,field_items&include=field_blocks,field_blocks.field_content,field_items,field_items.field_teaser_image.field_media_image,field_blocks.field_content.field_teaser_image.field_media_image,field_blocks.field_content.field_cover_image.field_media_image`,
    fields: [
      'title',
      'field_blocks.field_title',
      'field_blocks.field_content.title',
      'field_blocks.field_content.id',
      'field_blocks.field_content.field_title',
      'field_blocks.field_content.title',
      'field_blocks.field_content.intro',
      'field_blocks.field_content.field_link',
      'field_blocks.field_content.field_short_title',
      'field_blocks.field_content.field_teaser_image.field_media_image.uri',
      'field_blocks.field_content.field_cover_image.field_media_image.uri',
      'field_blocks.field_content.field_special_type',
      'field_blocks.field_content.field_teaser',
      'field_blocks.field_content.type',
      'field_link',
      'field_intro',
      'field_items.id',
      'field_items.field_title',
      'field_items.title',
      'field_items.intro',
      'field_items.field_link',
      'field_items.field_short_title',
      'field_items.field_teaser_image.field_media_image.uri',
      'field_items.field_special_type',
      'field_items.field_teaser',
      'field_items.type',
    ],
  },
  HOME_SPECIALS: {
    endpoint: () =>
      `${process.env.CMS_ROOT}jsonapi/node/list/${
        HOMEPAGE_LINKS.SPECIALS.id[process.env.NODE_ENV || ENVIRONMENTS.PRODUCTION]
      }?include=field_items.field_teaser_image.field_media_image&sort=-created`,
    fields: [
      'field_items.id',
      'field_items.field_title',
      'field_items.title',
      'field_items.intro',
      'field_items.field_link',
      'field_items.field_short_title',
      'field_items.field_teaser_image.field_media_image.uri',
      'field_items.field_special_type',
      'field_items.field_teaser',
      'field_items.type',
    ],
  },
  HOME_COLLECTIONS: {
    endpoint: () =>
      `${process.env.CMS_ROOT}jsonapi/node/list/${
        HOMEPAGE_LINKS.COLLECTIONS.id[process.env.NODE_ENV || ENVIRONMENTS.PRODUCTION]
      }?include=field_items.field_teaser_image.field_media_image&sort=-created`,
    fields: [
      'field_items.id',
      'field_items.title',
      'field_items.intro',
      'field_items.type',
      'field_items.field_short_title',
      'field_items.field_teaser_image.field_media_image.uri',
      'field_items.field_teaser',
    ],
  },
  HOME_ORGANIZATION: {
    endpoint: () =>
      `${process.env.CMS_ROOT}jsonapi/node/list/${
        HOMEPAGE_LINKS.ORGANIZATION.id[process.env.NODE_ENV || ENVIRONMENTS.PRODUCTION]
      }?include=field_items&sort=-created`,
    fields: [
      'field_items.id',
      'field_items.title',
      'field_items.intro',
      'field_items.field_short_title',
      'field_items.field_teaser',
      'field_items.field_link',
      'field_items.type',
    ],
  },
  HOME_ABOUT: {
    endpoint: () =>
      `${process.env.CMS_ROOT}jsonapi/node/list/${
        HOMEPAGE_LINKS.ABOUT.id[process.env.NODE_ENV || ENVIRONMENTS.PRODUCTION]
      }?include=field_items&sort=-created`,
    fields: [
      'field_items.id',
      'field_items.title',
      'field_items.intro',
      'field_items.field_short_title',
      'field_items.field_teaser',
      'field_items.type',
    ],
  },
  HOME_ABOUT_DATA: {
    endpoint: () =>
      `${process.env.CMS_ROOT}jsonapi/node/list/${
        HOMEPAGE_LINKS.ABOUT_DATA.id[process.env.NODE_ENV || ENVIRONMENTS.PRODUCTION]
      }?include=field_items&sort=-created`,
    fields: [
      'field_items.id',
      'field_items.title',
      'field_items.intro',
      'field_items.field_short_title',
      'field_items.field_teaser',
      'field_items.type',
    ],
  },
  HOME_HIGHLIGHT: {
    endpoint: () =>
      `${process.env.CMS_ROOT}jsonapi/node/list/${
        HOMEPAGE_LINKS.HIGHLIGHT.id[process.env.NODE_ENV || ENVIRONMENTS.PRODUCTION]
      }?include=field_items.field_teaser_image.field_media_image&sort=-created`,
    fields: [
      'field_items.id',
      'field_items.title',
      'field_items.intro',
      'field_items.field_link',
      'field_items.field_short_title',
      'field_items.field_teaser_image.field_media_image.uri',
      'field_items.field_special_type',
      'field_items.field_teaser',
      'field_items.type',
    ],
  },
}

export default cmsConfig
