import NotificationLevel from '../../app/models/notification'

export interface DetailResult {
  title: string
  subTitle?: string
  authScope?: string
  items: DetailResultItem[]
  notifications?: DetailResultNotification[]
}

export interface DetailResultNotification {
  value: string | boolean
  level: NotificationLevel
  canClose?: boolean
}

export enum DetailResultItemType {
  Default = 'default',
  Table = 'table',
}

export type DetailResultItem = DetailResultItemDefault | DetailResultItemTable

export interface DetailResultItemDefault {
  type: DetailResultItemType.Default
  label: string
  value?: string | number | boolean | Date | DetailResultItemDefault[]
  link?: string
  multiLine?: boolean
  status?: string
}

export interface DetailResultItemTable {
  type: DetailResultItemType.Table
  label?: string
  headings: DetailResultItemTableHeading[]
  values: DetailResultItemTableValue[]
}

export interface DetailResultItemTableHeading {
  label: string
  key: string
}

export type DetailResultItemTableValue = { [key: string]: any }
