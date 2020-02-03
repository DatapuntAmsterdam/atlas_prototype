export enum FilterType {
  Checkbox = 'checkbox',
  Radio = 'radio',
  Select = 'select',
}

export interface Filter {
  type: string
  label: string
  filterType: FilterType
  options: FilterOption[]
}

export interface FilterOption {
  id: string
  label: string
  count: number
}
