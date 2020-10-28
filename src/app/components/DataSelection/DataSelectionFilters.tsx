import React, { FunctionComponent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Heading, Link, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { addFilter as addFilterAction } from '../../../shared/ducks/filters/filters'
import DATA_SELECTION_CONFIG from '../../../shared/services/data-selection/data-selection-config'
import { DEFAULT_LOCALE } from '../../../shared/config/locale.config'
import { ReactComponent as Metadata } from '../../../shared/assets/icons/metadata.svg'

export type Filter = {
  options: Array<{ id: string; label: string; count: number }>
  slug: string
  label: string
  // eslint-disable-next-line camelcase
  info_url: string
  numberOfOptions: number
}

export type ActiveFilter = {
  // eslint-disable-next-line camelcase
  sbi_code?: string
}

type Props = {
  availableFilters: Filter[]
  activeFilters: ActiveFilter
  dataset: string
}

const StyledHeading = styled(Heading)`
  display: flex;
  justify-content: space-between;
  color: ${themeColor('tint', 'level7')};
`

const InfoButton = styled(Button)`
  border: 1px solid ${themeColor('tint', 'level4')};
`

// Note, this component has been migrated from legacy angularJS code
// Todo: this can be removed when we implement the new interactive table
const DataSelectionFilters: FunctionComponent<Props> = ({
  availableFilters,
  activeFilters,
  dataset,
}) => {
  const [expandedFilters, setExpandedFilters] = useState<string[]>([])
  const dispatch = useDispatch()

  const showMoreThreshold = 10

  const isFilterOptionActive = (filterSlug: string, id: string, label: string) => {
    return activeFilters[filterSlug] === label || activeFilters[filterSlug] === id
  }

  const hasInactiveFilterOptions = (filter: Filter) => {
    return (
      !filter.options.some((option) =>
        isFilterOptionActive(filter.slug, option.id, option.label),
      ) ||
      (!filter.slug.startsWith('sbi') && filter.options.length)
    )
  }

  const isExpandedFilter = (filterSlug: string) => {
    return expandedFilters.indexOf(filterSlug) !== -1
  }

  const showExpandButton = (filterSlug: string) => {
    return (
      !isExpandedFilter(filterSlug) && getAvailableOptions(filterSlug).length > showMoreThreshold
    )
  }

  const nrHiddenOptions = (filter: Filter) => {
    return filter.numberOfOptions - filter.options.length
  }

  const expandFilter = (filterSlug: string) => {
    setExpandedFilters((currentExpandedFilters) => [...currentExpandedFilters, filterSlug])
  }

  const implodeFilter = (filterSlug: string) => {
    setExpandedFilters((currentExpandedFilters) => [
      ...currentExpandedFilters.filter((val) => val !== filterSlug),
    ])
  }

  const canExpandImplode = (filterSlug: string) => {
    return getAvailableOptions(filterSlug).length > showMoreThreshold
  }

  function getAvailableOptions(filterSlug: string) {
    return getAvailableFilters(filterSlug)[0].options
  }

  function getAvailableFilters(filterSlug: string) {
    return availableFilters.filter((filter) => filter.slug === filterSlug)
  }

  const showOptionCounts = DATA_SELECTION_CONFIG.datasets[dataset].SHOW_FILTER_OPTION_COUNTS

  return (
    <div className="qa-available-filters c-data-selection-available-filters">
      <>
        {availableFilters.map(
          (filter) =>
            hasInactiveFilterOptions(filter) && (
              <div className="c-data-selection-available-filters__category">
                <StyledHeading as="h3">
                  <span>{filter.label}</span>
                  {filter.info_url && (
                    <InfoButton
                      type="button"
                      variant="blank"
                      data-testid="detail-infobox"
                      forwardedAs={Link}
                      size={28}
                      iconSize={18}
                      icon={<Metadata />}
                      title="Uitleg tonen"
                      href={filter.info_url}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      Uitleg tonen
                    </InfoButton>
                  )}
                </StyledHeading>

                <ul>
                  {[...filter.options]
                    .slice(
                      0,
                      isExpandedFilter(filter.slug) ? filter.options.length : showMoreThreshold,
                    )
                    .map((option) => (
                      <li className="c-data-selection-available-filters__item">
                        <button
                          type="button"
                          className={`o-btn o-btn--link o-btn--inline-block ${
                            !option.label &&
                            'c-data-selection-available-filters__item-label--empty-value'
                          }`}
                          onClick={() =>
                            dispatch(
                              addFilterAction({
                                [filter.slug]: option.id,
                              }),
                            )
                          }
                        >
                          <span className="c-data-selection-available-filters__item-label">
                            <span className="qa-option-label">{option.label || '(geen)'}</span>
                            {showOptionCounts && <span>({option.count})</span>}
                          </span>
                        </button>
                      </li>
                    ))}
                </ul>

                {canExpandImplode(filter.slug) && showExpandButton(filter.slug) && (
                  <div className="c-data-selection-available-filters__show-more">
                    <button
                      type="button"
                      className="
                        c-data-selection-available-filters__show-more-button
                        c-show-more
                        c-show-more--gray
                        qa-show-more-button"
                      onClick={() => expandFilter(filter.slug)}
                    >
                      Toon meer
                    </button>
                  </div>
                )}

                {canExpandImplode(filter.slug) && isExpandedFilter(filter.slug) && (
                  <div className="c-data-selection-available-filters__show-more">
                    {nrHiddenOptions(filter) > 0 && (
                      <div className="c-data-selection-available-filters__hidden-options qa-hidden-options">
                        ...nog {nrHiddenOptions(filter).toLocaleString(DEFAULT_LOCALE)} waarden
                      </div>
                    )}
                    <button
                      type="button"
                      className="c-show-more c-show-more--less c-show-more--gray qa-show-more-button"
                      onClick={() => implodeFilter(filter.slug)}
                    >
                      Toon minder
                    </button>
                  </div>
                )}
              </div>
            ),
        )}
      </>
    </div>
  )
}

export default DataSelectionFilters
