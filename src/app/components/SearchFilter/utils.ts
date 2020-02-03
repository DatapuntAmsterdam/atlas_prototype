import { FilterOption } from '../../models'
import { DEFAULT_LOCALE } from '../../../shared/config/locale.config'

export function formatOptionLabel({ count, label }: FilterOption, hideCount: boolean) {
  return count !== 0 && !hideCount ? `${label} (${count.toLocaleString(DEFAULT_LOCALE)})` : label
}

export function formatAllOptionLabel(totalCount: number, hideCount: boolean) {
  return totalCount !== 0 && !hideCount
    ? `Alles (${totalCount.toLocaleString(DEFAULT_LOCALE)})`
    : 'Alles'
}
