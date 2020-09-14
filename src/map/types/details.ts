import NotificationLevel from '../../app/models/notification'

// TODO: Revisit the type information here once the map services have been made type safe (also come up with shorter names).

export interface DetailResult {
  title: string
  subTitle: string
  authScope?: string
  items: DetailResultItem[]
  notifications?: DetailResultNotification[]
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
  Heading = 'heading',
}

export type DetailResultItem =
  | DetailResultItemDefault
  | DetailResultItemDefinitionList
  | DetailResultItemTable
  | DetailResultItemHeading

// TODO: Drop 'DetailResultItemDefault' in favor of 'DetailResultItemDefinitionList'
export interface DetailResultItemDefault {
  type: DetailResultItemType.Default
  label: string
  value?: string | number | boolean | Date | DetailResultItemDefault[]
  link?: string
  status?: string
}

export interface DetailResultItemDefinitionList {
  type: DetailResultItemType.DefinitionList
  title?: string
  entries: DetailResultItemDefinitionListEntry[]
}

export interface DetailResultItemDefinitionListEntry {
  term: string
  description: string
  link?: string
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

export interface DetailResultItemHeading {
  type: DetailResultItemType.Heading
  value: string
}
