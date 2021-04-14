import { Link } from '../../types'

export interface Single {
  jsonapi: Jsonapi
  data: Data
  included: Data[]
  links: Links
}

interface Jsonapi {
  version: string
  meta: {
    links: Links
  }
}

interface Data {
  type: string
  id: string
  links?: Links
  attributes?: Attributes
  relationships?: Relationships
}

interface Body {
  value: string
  format?: string
  processed?: string
  summary?: string
}

interface FieldLink {
  uri: string
  title: string
  options: any[]
}

interface Field {
  data: Data | never[] | null | Data[]
  links: Links
}

interface Daum2 {
  type: string
  id: string
}

export interface Attributes {
  drupal_internal__id?: number
  drupal_internal__revision_id?: number
  langcode: string
  status: boolean
  created: string
  parent_id?: string
  parent_type?: string
  parent_field_name?: string
  behavior_settings?: string
  default_langcode?: boolean
  revision_translation_affected?: boolean
  field_accordion_content?: any
  field_accordion_intro?: any
  field_accordion_label?: any
  field_accordion_title?: any
  drupal_internal__mid?: number
  drupal_internal__vid?: number
  revision_created?: string
  revision_log_message?: any
  name?: string
  changed?: string
  path?: Path
  field_credit?: any
  drupal_internal__fid?: number
  filename?: string
  uri?: Uri
  filemime?: string
  filesize?: number

  drupal_internal__nid?: number
  revision_timestamp?: string
  revision_log?: any
  title?: string
  promote?: boolean
  sticky?: boolean
  body?: Body
  field_byline?: string
  field_intro?: string
  field_language?: string
  field_links?: FieldLink[]
  field_publication_date?: string
  field_short_title?: string | null
  field_slug?: string
  field_teaser?: string
  field_type?: string
}

interface Path {
  alias: string
  pid: any
  langcode: string
}

interface Uri {
  value: string
  url: string
}

export interface Relationships {
  paragraph_type?: Field
  bundle?: Field
  revision_user?: Field
  uid?: Field
  thumbnail?: Thumbnail
  feeds_item?: Field
  field_media_image?: FieldMediaImage

  node_type?: Field
  field_items?: Field
  revision_uid?: Field
  field_accordions?: {
    data: Array<
      Data & {
        meta: {
          target_revision_id: number
        }
      }
    >
    links: Links
  }
  field_cover_image?: Field
  field_downloads?: Field
  field_related?: Field
  field_tags?: Field
  field_teaser_image?: Field
  field_themes?: {
    data: Daum2[]
    links: Links
  }
}

interface Thumbnail {
  data: DataImage
  links: Links
}

interface DataImage {
  type: string
  id: string
  meta: MetaImage
}

interface MetaImage {
  alt: string
  title: string
  width: number
  height: number
}

interface FieldMediaImage {
  data: DataImage
  links: Links
}

interface Links {
  related?: Link
  self: Link
}
