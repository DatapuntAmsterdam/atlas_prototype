/* eslint-disable camelcase */
export interface RootObject {
  data: Data
  included?: Data[]
}

export type Data = {
  type: string
  id: string
  attributes: Attributes
  relationships: Relationships
}

export type Attributes = {
  body?: Body | null
  changed?: string
  created?: string
  default_langcode?: boolean
  drupal_internal__fid?: number
  drupal_internal__mid?: number
  drupal_internal__nid?: number
  drupal_internal__vid?: number
  field_accordion_content?: Body
  field_accordion_intro?: Body
  field_accordion_label?: string
  field_accordion_title?: string
  field_accordions?: NodeType
  field_blocks?: NodeType
  field_byline?: string
  field_credit?: any
  field_file_size?: string
  field_file_type?: string
  field_intro?: string | null
  field_language?: string
  field_links?: string[]
  field_publication_date?: string
  field_publication_day?: number
  field_publication_month?: string
  field_publication_source?: string
  field_publication_year?: string
  field_short_title?: any
  field_slug?: string
  field_teaser?: string | null
  field_type?: string
  filemime?: string
  filename?: string
  filesize?: number
  langcode?: string
  name?: string
  parent_id?: number
  parent_type?: string
  path?: Path
  promote?: boolean
  revision_created?: string
  revision_log_message?: any
  revision_log?: any
  revision_timestamp?: string
  revision_translation_affected?: boolean
  status?: boolean
  sticky?: boolean
  title?: string
  uri?: Uri
}

type Path = {
  alias: string
  pid: any
  langcode: string
}

type Body = {
  value: string
  format: string
  processed: string
  summary: string
}

type NodeType = {
  data: NodeData[] | NodeData | null
  links?: any
}

export type NodeData = {
  type: string
  id: string
  meta?: any
}

interface Uri {
  value: string
  url: string
}

type Relationships = {
  bundle?: NodeType
  feeds_item?: NodeType
  field_accordions?: NodeType
  field_cover_image?: NodeType
  field_downloads?: NodeType
  field_file?: NodeType
  field_items?: NodeType
  field_media_file?: NodeType
  field_media_image?: NodeType
  field_related?: NodeType
  field_tags?: NodeType
  field_teaser_image?: NodeType
  field_themes?: NodeType
  node_type?: NodeType
  paragraph_type?: NodeType
  revision_user?: NodeType
  revision_uid?: NodeType
  thumbnail?: NodeType
  uid?: NodeType
}
