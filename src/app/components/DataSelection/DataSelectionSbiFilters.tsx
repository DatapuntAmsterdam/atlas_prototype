import { Enlarge, Minimise } from '@amsterdam/asc-assets'
import { Button, Link, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { DEFAULT_LOCALE } from '../../../shared/config/locale.config'
import { useDataSelection } from './DataSelectionContext'

const StyledLink = styled(Link)`
  background-color: transparent;
  text-align: left;
`

const ShowMoreButton = styled(Button)`
  margin-top: ${themeSpacing(2)};
`

// Note, this component has been migrated from legacy angularJS code
// Todo: this can be removed when we implement the new interactive table
const DataSelectionSbiFilters: FunctionComponent = () => {
  const { removeFilter, addFilter, availableFilters } = useDataSelection()
  const [isExpanded, setIsExpanded] = useState(false)
  const [sbiCodeInput, setSbiCodeInput] = useState('')
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
        removeFilter(filterSlug)
      } else {
        addFilter({
          [filterSlug]: `[${formattedValue}]`,
        })
      }
    },
    [addFilter, sbiCodeInput],
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

        <form
          className="c-sbi-filter__form"
          onSubmit={(e) => {
            e.preventDefault()
            addFilter({
              sbi_code: sbiCodeInput,
            })
          }}
        >
          <input
            className="c-sbi-filter__input qa-sbi-filter-form-input"
            value={sbiCodeInput}
            onChange={(e) => {
              setSbiCodeInput(e.target.value)
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
                <li
                  key={option.slug}
                  className={`c-sbi-filter__item c-sbi-filter__item--${option.slug}`}
                >
                  <StyledLink
                    inList
                    type="button"
                    forwardedAs="button"
                    onClick={() => clickFilter(option.id)}
                  >
                    <span
                      className={`c-sbi-filter__item-label ${
                        !option.label ? 'c-sbi-filter__item-label--empty-value' : ''
                      }`}
                    >
                      <span className="qa-option-label">{option.label}</span>
                    </span>
                  </StyledLink>
                </li>
              ))}
          </ul>
          {showExpandButton() && (
            <div className="c-sbi-filter__show-more">
              <ShowMoreButton
                type="button"
                onClick={expandFilter}
                variant="textButton"
                className="qa-show-more-button"
                iconSize={14}
                iconLeft={<Enlarge />}
              >
                Toon meer
              </ShowMoreButton>
            </div>
          )}

          {isExpanded && (
            <div className="c-sbi-filter__show-more">
              {nrHiddenOptions > 0 && (
                <div className="c-sbi-filter__hidden-options qa-hidden-options">
                  ...nog {nrHiddenOptions.toLocaleString(DEFAULT_LOCALE)} waarden
                </div>
              )}
              <ShowMoreButton
                type="button"
                className="qa-show-more-button"
                onClick={implodeFilter}
                variant="textButton"
                iconSize={14}
                iconLeft={<Minimise />}
              >
                Toon minder
              </ShowMoreButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DataSelectionSbiFilters
