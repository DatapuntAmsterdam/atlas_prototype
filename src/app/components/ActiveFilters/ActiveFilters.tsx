import { FunctionComponent } from 'react'

// TODO: Replace this interface with one that is shared with other components.
interface Filter {
  slug: string
  label: string
  option: string
}

export interface ActiveFiltersProps {
  removeFilter: (slug: string) => void
  filters: Filter[]
}

const ActiveFilters: FunctionComponent<ActiveFiltersProps> = ({ removeFilter, filters }) =>
  filters && filters.length ? (
    <div className="qa-active-filters c-data-selection-active-filters">
      <ul className="c-data-selection-active-filters__list">
        {filters.map(({ slug, label, option }) => (
          <li key={slug} className="c-data-selection-active-filters__listitem">
            <span>
              {label}:{option}
            </span>

            <button
              type="button"
              onClick={() => removeFilter(slug)}
              className="c-data-selection-active-filters--remove-filter o-btn"
              title="Filter verwijderen"
            >
              <span className="u-sr-only">Filter verwijderen</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : null

export default ActiveFilters
