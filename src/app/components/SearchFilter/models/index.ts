import { FilterOption } from '../../../models'

export interface FilterProps {
  type: string
  options: FilterOption[]
  totalCount: number
  hideCount: boolean
  selection: string[]
  onSelectionChange: (values: string[]) => void
}
