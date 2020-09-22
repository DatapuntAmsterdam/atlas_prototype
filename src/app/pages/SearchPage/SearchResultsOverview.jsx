import { themeSpacing } from '@amsterdam/asc-ui'
import React from 'react'
import styled from 'styled-components'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import SearchLink from '../../components/Links/SearchLink/SearchLink'
import NoSearchResults from '../../components/NoSearchResults'
import SearchHeading from '../../components/SearchHeading/SearchHeading'
import formatCount from '../../utils/formatCount'
import getErrorsForPath from '../../utils/getErrorsForPath'
import getLoadingErrors from '../../utils/getLoadingErrors'
import SEARCH_PAGE_CONFIG from './config'

const ResultsComponent = styled.div`
  margin-bottom: ${themeSpacing(8)};
`

const ResultItem = styled.div`
  margin-bottom: ${themeSpacing(18)};
`

function getSearchConfigByResolver(key) {
  return Object.values(SEARCH_PAGE_CONFIG).find(({ resolver }) => resolver === key)
}

const SearchResultsOverview = ({ query, totalCount, results, errors, loading }) => {
  return results.length > 0 && totalCount ? (
    results.map(({ key, results: resultItemResults, totalCount: resultItemTotalCount }) => {
      const resultItem = getSearchConfigByResolver(key)

      if (resultItem) {
        const {
          label,
          component: ResultComponent,
          to,
          type,
          resolver,
          hideOverviewHeading,
        } = resultItem

        // Get the loading errors only, as we do not want to show unauthorized messages on the overview page.
        const matchingErrors = getLoadingErrors(
          getErrorsForPath(errors, typeof resolver === 'string' ? [resolver] : resolver),
        )
        // TODO: This statement should match the error code instead, needs to be implemented in the API.
        const hasNoMatchingFilters = errors.some(
          (err) => err.message === 'The entered type(s) does not exist',
        )
        const hasErrors = matchingErrors.length > 0
        const hasResults = resultItemTotalCount > 0

        return hasResults || (hasErrors && !hasNoMatchingFilters) ? (
          <ResultItem key={type}>
            {!hideOverviewHeading && (
              <SearchHeading
                label={`${label}${
                  resultItemTotalCount > 0 ? ` (${formatCount(resultItemTotalCount)})` : ''
                }`}
              />
            )}
            <ResultsComponent>
              {hasResults ? (
                <ResultComponent
                  data-test={type}
                  {...{
                    type,
                    results: resultItemResults,
                    loading,
                    errors: matchingErrors,
                    compact: true, // Results in the search overview page are compact
                    isOverviewPage: true,
                  }}
                />
              ) : (
                <ErrorMessage
                  message="Er is een fout opgetreden bij het laden van dit blok."
                  buttonLabel="Probeer opnieuw"
                  buttonOnClick={() => window.location.reload()}
                />
              )}
            </ResultsComponent>
            {hasResults && (
              <SearchLink to={to()} label={`Resultaten tonen binnen de categorie '${label}'`} />
            )}
          </ResultItem>
        ) : null
      }
      return null
    })
  ) : (
    <NoSearchResults data-test="NoSearchResults" query={query} />
  )
}

export default SearchResultsOverview
