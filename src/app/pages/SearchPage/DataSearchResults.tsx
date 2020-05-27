import styled from 'styled-components'
import { themeSpacing } from '@datapunt/asc-ui'
import { GraphQLFormattedError } from 'graphql'
import React from 'react'
import DataCard, { DataList } from '../../components/DataCard'
import { NoDataSearchResults } from '../../components/NoSearchResults'
import MoreResultsWhenLoggedIn from '../../components/Alerts/MoreResultsWhenLoggedIn'
import { ErrorExtensions } from '../../models/graphql'
import getErrorsForPath from '../../utils/getErrorsForPath'
import getLoadingErrors from '../../utils/getLoadingErrors'
import getUnauthorizedLabels from '../../utils/getUnauthorizedLabels'

const CardWrapper = styled.div<{ compact: boolean }>`
  width: 100%;
  margin-bottom: ${({ compact }) => (compact ? themeSpacing(2) : themeSpacing(8))};
`

export interface DataSearchResultsProps {
  page: string
  query: string
  // TODO: Properly type the results
  results: any[]
  errors: GraphQLFormattedError<ErrorExtensions>[]
  compact: boolean
  withPagination: boolean
}

const DataSearchResults: React.FC<DataSearchResultsProps> = ({
  query,
  results,
  errors,
  compact,
  withPagination,
}) => {
  const Card = compact ? DataCard : DataList

  // Get the total count for all data types
  const totalCount = results.length ? [0, ...results].reduce((acc, cur) => acc + cur.count) : 0

  // Get the errors and labels for this page.
  const matchingErrors = getErrorsForPath(errors, ['dataSearch'])
  const loadingErrors = getLoadingErrors(matchingErrors)

  // Get all the labels of the type that the user has no access to
  const unauthorizedLabels = getUnauthorizedLabels(matchingErrors)

  return totalCount > 0 ? (
    <>
      {results.map((result) => {
        const hasLoadingError = loadingErrors.some(
          ({ extensions }) => extensions?.type === result.type,
        )

        return (result.results && result.results.length > 0) || hasLoadingError ? (
          <CardWrapper key={result.type} compact={compact}>
            <Card {...{ ...result, withPagination, hasLoadingError: !!hasLoadingError }} />
          </CardWrapper>
        ) : null
      })}
      <>
        {unauthorizedLabels.length > 0 && (
          <MoreResultsWhenLoggedIn excludedResults={unauthorizedLabels.join(', ')} />
        )}
      </>
    </>
  ) : (
    <NoDataSearchResults query={query} unauthorized={unauthorizedLabels} />
  )
}
export default DataSearchResults
