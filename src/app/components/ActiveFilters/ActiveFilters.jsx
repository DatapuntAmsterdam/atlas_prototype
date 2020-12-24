import PropTypes from 'prop-types'

const ActiveFilters = ({ removeFilter, filters }) =>
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
  ) : (
    ''
  )

ActiveFilters.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeFilter: PropTypes.func.isRequired,
}

export default ActiveFilters
