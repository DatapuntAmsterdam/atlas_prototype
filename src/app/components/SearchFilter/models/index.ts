import { FilterOption } from '../../../models/filter'

export interface FilterProps {
  type: string
  label: string
  options: FilterOption[]
  totalCount: number
  hideCount: boolean
  selection: string[]
  onSelectionChange: (values: string[]) => void
}
