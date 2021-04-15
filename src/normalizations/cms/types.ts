// @ts-ignore
import { CmsType, SpecialType } from '../../shared/config/cms.config'

// @ts-ignore
export interface DoubleNormalizedResults extends NormalizedFieldItems {
  field_blocks?: Array<{
    field_content: NormalizedFieldItems[]
    field_title: string
  }>
  field_items?: NormalizedFieldItems[]
}

export interface NormalizedResult {
  id: string
  title: string
  body?: CmsBody
  field_special_type?: string
  _links?: string
  field_file?: {
    field_media_file?: {
      uri?: {
        url: string
      }
    }
  }
  field_accordions?: Array<{
    field_accordion_title: string
    field_accordion_content: {
      processed: string
    }
    field_accordion_intro: {
      processed: string
    }
    field_accordion_label: string
  }>
  field_publication_day?: string
  field_downloads?: FieldDownload[]
  field_publication_year?: string
  field_publication_month?: string
  field_file_size?: string
  field_file_type?: string
  field_publication_source?: string
  field_subtitle_link?: {
    uri: string
  }
  field_subtitle_default?: string
  field_link?: FieldLink
  field_intro?: string
  field_short_title: any
  field_teaser_image?: FieldTeaserImage
  field_cover_image?: FieldTeaserImage
  field_teaser: string
  media_image_url?: string
  teaser_url?: string
  field_links?: FieldLink[]
  field_byline?: string
  field_blocks?: Array<{
    field_content: NormalizedResult[] | NormalizedResult
    field_title: string
  }>
  field_items?: NormalizedResult[]
  field_publication_date?: string
  field_related?: NormalizedResult[] | NormalizedResult
  field_type?: string
  field_language?: any
  short_title?: string
  field_content_link?: {
    uri: string
  }
  type?: string
  intro?: string
}

export interface NormalizedFieldItems extends Partial<NormalizedResult> {
  key: any
  body?: any
  teaserImage?: string
  coverImage?: string
  imageIsVertical?: boolean
  shortTitle?: string
  teaser?: string
  specialType?: SpecialType | null
  fileUrl?: string
  localeDate?: Date | string
  localeDateFormatted?: string
  slug?: string | null
  to?: any
  linkProps?: any
  related?: NormalizedFieldItems[]
  links?: FieldLink[]
  dateLocale?: string
  label?: string
}

interface FieldTeaserImage {
  field_media_image: FieldMediaImage
}

interface FieldMediaImage {
  uri: {
    value: string
    url: string
  }
}

export interface FieldDownload {
  title: string
  drupal_internal__nid: string
  field_file_type: string
  field_file_size: string
  field_file: {
    field_media_file: {
      uri: {
        url: string
      }
    }
  }
}

export interface CmsBody {
  value: string
  format?: string
  processed?: string
  summary?: string
}

export interface FieldLink {
  uri: string
  title?: string
  options?: any[]
}
