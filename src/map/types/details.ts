import { ReactNode } from 'react'
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
  value: string | ReactNode
  id: string | number
  level: NotificationLevel
  canClose?: boolean
}

export enum DetailResultItemType {
  DefinitionList = 'definition-list',
  Table = 'table',
  LinkList = 'link-list',
  PaginatedData = 'paginated-data',
  GroupedItems = 'grouped-items',
}

export type DetailResultItem =
  | DetailResultItemDefinitionList
  | DetailResultItemLinkList
  | DetailResultItemTable
  | DetailResultItemPaginatedData
  | DetailResultItemGroupedItems

export interface ExternalLink {
  title: string
  url: string
}

export interface DetailInfo {
  id: string
  subType: string
  type: string
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

export interface DetailResultItemDefinitionList extends DefaultDetailResultItem {
  type: DetailResultItemType.DefinitionList
  entries?: DetailResultItemDefinitionListEntry[]
}

export interface DetailResultItemGroupedItems extends DefaultDetailResultItem {
  type: DetailResultItemType.GroupedItems
  entries: DetailResultItem[]
}

export interface DetailResultItemPaginatedData extends DefaultDetailResultItem {
  type: DetailResultItemType.PaginatedData
  getData: (url?: string, pageSize?: number) => Promise<PaginatedData<any> | null>
  pageSize: number
  toView: (data?: any[]) => DetailResultItem
}

export interface DetailResultItemLinkList extends DefaultDetailResultItem {
  type: DetailResultItemType.LinkList
  links?: Link[]
}

export interface DetailResultItemDefinitionListEntry {
  term: string
  description?: string
  link?: To
  alert?: string
}

export interface DetailResultItemTable extends DefaultDetailResultItem {
  type: DetailResultItemType.Table
  headings: DetailResultItemTableHeading[]
  values?: DetailResultItemTableValue[]
}

export interface DetailResultItemTableHeading extends DefaultDetailResultItem {
  key: string
}

export type DetailResultItemTableValue = { [key: string]: any }
