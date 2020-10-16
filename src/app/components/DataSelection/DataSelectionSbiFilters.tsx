import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addFilter, removeFilter } from '../../../shared/ducks/filters/filters'
import { ActiveFilter, Filter } from './DataSelectionFilters'
import { DEFAULT_LOCALE } from '../../../shared/config/locale.config'

type Props = {
  availableFilters: Filter[]
  activeFilters: ActiveFilter
}

// Note, this component has been migrated from legacy angularJS code
// Todo: this can be removed when we implement the new interactive table
const DataSelectionSbiFilters: FunctionComponent<Props> = ({ availableFilters, activeFilters }) => {
  const dispatch = useDispatch()
  const [isExpanded, setIsExpanded] = useState(false)
  const [sbiCode, setSbiCode] = useState(
    activeFilters && activeFilters.sbi_code && activeFilters.sbi_code.replace(/['[\]]/g, ''),
  )
  const sbiLevelFilters = availableFilters.filter((filter) => filter.slug.startsWith('sbi_l'))
  const numberOfOptions = sbiLevelFilters.reduce(
    (total, amount) => total + amount.numberOfOptions,
    0,
  )
  const options = sbiLevelFilters
    .map((filter) => {
      return filter.options.map((option) => ({
        ...option,
        slug: filter.slug,
      }))
    })
    .reduce((a, b) => a.concat(b), [])
    .slice(0, 100)

  const showMoreThreshold = 10
  const filterSlug = 'sbi_code'

  const currentFilter = useMemo(
    () => ({
      ...availableFilters.find((filter) => filter.slug === 'sbi_code'),
      options,
      numberOfOptions,
    }),
    [availableFilters, options, numberOfOptions],
  )

  const addOrRemoveFilter = useCallback(
    (value?: string) => {
      if (!value) {
        return
      }
      const formattedValue = value
        .split(',')
        .map((data) => `'${data.trim()}'`)
        .join(', ')

      if (value === '') {
        dispatch(removeFilter(filterSlug))
      } else {
        dispatch(
          addFilter({
            [filterSlug]: `[${formattedValue}]`,
          }),
        )
      }
    },
    [dispatch, addFilter, sbiCode],
  )

  const clickFilter = (string: string) => {
    addOrRemoveFilter(string.replace(/: .*$/g, ''))
  }

  const nrHiddenOptions = currentFilter.numberOfOptions - currentFilter.options.length

  const expandFilter = () => {
    setIsExpanded(true)
  }

  const implodeFilter = () => {
    setIsExpanded(false)
  }

  const canExpandImplode = () => {
    return currentFilter.options.length > showMoreThreshold
  }

  const showExpandButton = () => {
    return !isExpanded && canExpandImplode()
  }
  return (
    <div className="qa-sbi-filter c-sbi-filter">
      <div className="c-sbi-filter__category">
        <h2 className="c-sbi-filter__category-label qa-category-header">SBI-code</h2>

        <form className="c-sbi-filter__form" onSubmit={() => addOrRemoveFilter(sbiCode)}>
          <input
            className="c-sbi-filter__input qa-sbi-filter-form-input"
            value={sbiCode}
            onChange={(e) => {
              setSbiCode(e.target.value)
            }}
            placeholder="Codes bijv.: 221, 01, 38211"
          />
          <button className="c-sbi-filter__submit qa-sbi-filter-form-sumbit" type="submit">
            Selecteer
          </button>
        </form>

        <div>
          <ul>
            {[...currentFilter.options]
              .slice(0, isExpanded ? currentFilter.options.length : showMoreThreshold)
              .map((option) => (
                <li className={`c-sbi-filter__item c-sbi-filter__item--${option.slug}`}>
                  <button
                    type="button"
                    className="c-sbi-filter__button o-btn o-btn--link o-btn--inline-block"
                    onClick={() => clickFilter(option.id)}
                    title="{{option.label}}"
                  >
                    <span
                      className={`c-sbi-filter__item-label ${
                        !option.label && 'c-sbi-filter__item-label--empty-value'
                      }`}
                    >
                      <span className="qa-option-label">{option.label}</span>
                    </span>
                  </button>
                </li>
              ))}
          </ul>
          {showExpandButton() && (
            <div className="c-sbi-filter__show-more">
              <button
                type="button"
                className="
                            c-sbi-filter__show-more-button
                            c-show-more
                            c-show-more--gray
                            qa-show-more-button"
                onClick={expandFilter}
              >
                Toon meer
              </button>
            </div>
          )}

          {isExpanded && (
            <div className="c-sbi-filter__show-more">
              {nrHiddenOptions > 0 && (
                <div className="c-sbi-filter__hidden-options qa-hidden-options">
                  ...nog {nrHiddenOptions.toLocaleString(DEFAULT_LOCALE)} waarden
                </div>
              )}
              <button
                type="button"
                className="c-show-more c-show-more--less c-show-more--gray qa-show-more-button"
                onClick={implodeFilter}
              >
                Toon minder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DataSelectionSbiFilters
