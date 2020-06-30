import { FilterOption } from '../../models/filter'
import formatCount from '../../utils/formatCount'

export function formatOptionLabel({ count, label }: FilterOption, hideCount: boolean) {
  return count && count !== 0 && !hideCount ? `${label} (${formatCount(count)})` : label
}

export function formatAllOptionLabel(totalCount: number, hideCount: boolean) {
  return totalCount !== 0 && !hideCount ? `Alles (${formatCount(totalCount)})` : 'Alles'
}
