import NotificationLevel from '../../app/models/notification'
import { InfoBoxProps } from '../../app/pages/MapPage/detail/DetailInfoBox'

// TODO: Revisit the type information here once the map services have been made type safe (also come up with shorter names).

export interface DetailResult {
  title: string
  subTitle?: string
  authScope?: string
  items: DetailResultItem[]
  notifications?: DetailResultNotification[]
  infoBox?: InfoBoxProps
}

export interface DetailResultNotification {
  value: string
  level: NotificationLevel
  canClose?: boolean
}

export enum DetailResultItemType {
  Default = 'default',
  DefinitionList = 'definition-list',
  Table = 'table',
  LinkList = 'link-list',
  Heading = 'heading',
  PaginatedData = 'paginated-data',
}

export type DetailResultItem =
  | DetailResultItemDefault
  | DetailResultItemDefinitionList
  | DetailResultItemLinkList
  | DetailResultItemTable
  | DetailResultItemHeading
  | DetailResultItemPaginatedData

export interface ExternalLink {
  title: string
  url: string
}

type To = { pathname: string; search?: string } | string

export interface InternalLink {
  title: string
  // TODO: when types are fixed in @types/react-router-dom, use Pick<LinkProps> instead
  to: To
}

export type Link = ExternalLink | InternalLink

export interface PaginatedData<T> {
  data: T
  count: number
  next: string | null
  previous: string | null
}

export interface DefaultDetailResultItem {
  infoBox?: InfoBoxProps
  // Todo: remove gridArea when legacy map is removed
  gridArea?: string
  title?: string | null
}

// TODO: Drop 'DetailResultItemDefault' in favor of 'DetailResultItemDefinitionList'
export interface DetailResultItemDefault {
  type: DetailResultItemType.Default
  title?: string | null
  value?: string | number | boolean | Date | DetailResultItemDefault[]
  link?: string
  status?: string
}

export interface DetailResultItemDefinitionList extends DefaultDetailResultItem {
  type: DetailResultItemType.DefinitionList
  entries: DetailResultItemDefinitionListEntry[]
}

export interface DetailResultItemPaginatedData extends DefaultDetailResultItem {
  type: DetailResultItemType.PaginatedData
  getData: (url?: string, pageSize?: number) => Promise<PaginatedData<any> | null>
  pageSize: number
  toView: (data: any) => DetailResultItem
}

export interface DetailResultItemLinkList extends DefaultDetailResultItem {
  type: DetailResultItemType.LinkList
  links: Link[]
  skipRouter?: boolean
}

export interface DetailResultItemDefinitionListEntry {
  term: string
  description: string
  link?: To
}

export interface DetailResultItemTable extends DefaultDetailResultItem {
  type: DetailResultItemType.Table
  headings: DetailResultItemTableHeading[]
  values: DetailResultItemTableValue[]
}

export interface DetailResultItemTableHeading extends DefaultDetailResultItem {
  key: string
}

export type DetailResultItemTableValue = { [key: string]: any }

export interface DetailResultItemHeading extends DefaultDetailResultItem {
  type: DetailResultItemType.Heading
}
