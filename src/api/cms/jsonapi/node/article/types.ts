/* eslint-disable camelcase */
export interface Root {
  jsonapi: Jsonapi
  data: Data
  included: Included[]
  links: Links22
}

export interface Jsonapi {
  version: string
  meta: Meta
}

export interface Meta {
  links: Links
}

export interface Links {
  self: Self
}

export interface Self {
  href: string
}

export interface Data {
  type: string
  id: string
  links: Links2
  attributes: Attributes
  relationships: Relationships
}

export interface Links2 {
  self: Self2
}

export interface Self2 {
  href: string
}

export interface Attributes {
  drupal_internal__nid: number
  drupal_internal__vid: number
  langcode: string
  revision_timestamp: string
  revision_log: any
  status: boolean
  title: string
  created: string
  changed: string
  promote: boolean
  sticky: boolean
  default_langcode: boolean
  revision_translation_affected: boolean
  path: Path
  body: Body
  field_byline: string
  field_intro: string
  field_language: string
  field_links: FieldLink[]
  field_publication_date: string
  field_short_title: any
  field_slug: string
  field_teaser: string
  field_type: string
}

export interface Path {
  alias: string
  pid: any
  langcode: string
}

export interface Body {
  value: string
  format: string
  processed: string
  summary: string
}

export interface FieldLink {
  uri: string
  title: string
  options: any[]
}

export interface Relationships {
  node_type: NodeType
  revision_uid: RevisionUid
  uid: Uid
  feeds_item: FeedsItem
  field_accordions: FieldAccordions
  field_cover_image: FieldCoverImage
  field_downloads: FieldDownloads
  field_related: FieldRelated
  field_tags: FieldTags
  field_teaser_image: FieldTeaserImage
  field_themes: FieldThemes
}

export interface NodeType {
  data: Data2
  links: Links3
}

export interface Data2 {
  type: string
  id: string
}

export interface Links3 {
  related: Related
  self: Self3
}

export interface Related {
  href: string
}

export interface Self3 {
  href: string
}

export interface RevisionUid {
  data: Data3
  links: Links4
}

export interface Data3 {
  type: string
  id: string
}

export interface Links4 {
  related: Related2
  self: Self4
}

export interface Related2 {
  href: string
}

export interface Self4 {
  href: string
}

export interface Uid {
  data: Data4
  links: Links5
}

export interface Data4 {
  type: string
  id: string
}

export interface Links5 {
  related: Related3
  self: Self5
}

export interface Related3 {
  href: string
}

export interface Self5 {
  href: string
}

export interface FeedsItem {
  data: any
  links: Links6
}

export interface Links6 {
  related: Related4
  self: Self6
}

export interface Related4 {
  href: string
}

export interface Self6 {
  href: string
}

export interface FieldAccordions {
  data: Daum[]
  links: Links7
}

export interface Daum {
  type: string
  id: string
  meta: Meta2
}

export interface Meta2 {
  target_revision_id: number
}

export interface Links7 {
  related: Related5
  self: Self7
}

export interface Related5 {
  href: string
}

export interface Self7 {
  href: string
}

export interface FieldCoverImage {
  data: Data5
  links: Links8
}

export interface Data5 {
  type: string
  id: string
}

export interface Links8 {
  related: Related6
  self: Self8
}

export interface Related6 {
  href: string
}

export interface Self8 {
  href: string
}

export interface FieldDownloads {
  data: any[]
  links: Links9
}

export interface Links9 {
  related: Related7
  self: Self9
}

export interface Related7 {
  href: string
}

export interface Self9 {
  href: string
}

export interface FieldRelated {
  data: any[]
  links: Links10
}

export interface Links10 {
  related: Related8
  self: Self10
}

export interface Related8 {
  href: string
}

export interface Self10 {
  href: string
}

export interface FieldTags {
  data: any[]
  links: Links11
}

export interface Links11 {
  related: Related9
  self: Self11
}

export interface Related9 {
  href: string
}

export interface Self11 {
  href: string
}

export interface FieldTeaserImage {
  data: Data6
  links: Links12
}

export interface Data6 {
  type: string
  id: string
}

export interface Links12 {
  related: Related10
  self: Self12
}

export interface Related10 {
  href: string
}

export interface Self12 {
  href: string
}

export interface FieldThemes {
  data: Daum2[]
  links: Links13
}

export interface Daum2 {
  type: string
  id: string
}

export interface Links13 {
  related: Related11
  self: Self13
}

export interface Related11 {
  href: string
}

export interface Self13 {
  href: string
}

export interface Included {
  type: string
  id: string
  links: Links14
  attributes: Attributes2
  relationships: Relationships2
}

export interface Links14 {
  self: Self14
}

export interface Self14 {
  href: string
}

export interface Attributes2 {
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
  field_accordion_content: any
  field_accordion_intro: any
  field_accordion_label: any
  field_accordion_title: any
  drupal_internal__mid?: number
  drupal_internal__vid?: number
  revision_created?: string
  revision_log_message: any
  name?: string
  changed?: string
  path?: Path2
  field_credit: any
  drupal_internal__fid?: number
  filename?: string
  uri?: Uri
  filemime?: string
  filesize?: number
}

export interface Path2 {
  alias: string
  pid: any
  langcode: string
}

export interface Uri {
  value: string
  url: string
}

export interface Relationships2 {
  paragraph_type?: ParagraphType
  bundle?: Bundle
  revision_user?: RevisionUser
  uid?: Uid2
  thumbnail?: Thumbnail
  feeds_item?: FeedsItem2
  field_media_image?: FieldMediaImage
}

export interface ParagraphType {
  data: Data7
  links: Links15
}

export interface Data7 {
  type: string
  id: string
}

export interface Links15 {
  related: Related12
  self: Self15
}

export interface Related12 {
  href: string
}

export interface Self15 {
  href: string
}

export interface Bundle {
  data: Data8
  links: Links16
}

export interface Data8 {
  type: string
  id: string
}

export interface Links16 {
  related: Related13
  self: Self16
}

export interface Related13 {
  href: string
}

export interface Self16 {
  href: string
}

export interface RevisionUser {
  data: any
  links: Links17
}

export interface Links17 {
  related: Related14
  self: Self17
}

export interface Related14 {
  href: string
}

export interface Self17 {
  href: string
}

export interface Uid2 {
  data: Data9
  links: Links18
}

export interface Data9 {
  type: string
  id: string
}

export interface Links18 {
  related: Related15
  self: Self18
}

export interface Related15 {
  href: string
}

export interface Self18 {
  href: string
}

export interface Thumbnail {
  data: Data10
  links: Links19
}

export interface Data10 {
  type: string
  id: string
  meta: Meta3
}

export interface Meta3 {
  alt: string
  title: string
  width: number
  height: number
}

export interface Links19 {
  related: Related16
  self: Self19
}

export interface Related16 {
  href: string
}

export interface Self19 {
  href: string
}

export interface FeedsItem2 {
  data: any
  links: Links20
}

export interface Links20 {
  related: Related17
  self: Self20
}

export interface Related17 {
  href: string
}

export interface Self20 {
  href: string
}

export interface FieldMediaImage {
  data: Data11
  links: Links21
}

export interface Data11 {
  type: string
  id: string
  meta: Meta4
}

export interface Meta4 {
  alt: string
  title: string
  width: number
  height: number
}

export interface Links21 {
  related: Related18
  self: Self21
}

export interface Related18 {
  href: string
}

export interface Self21 {
  href: string
}

export interface Links22 {
  self: Self22
}

export interface Self22 {
  href: string
}
