import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { GraphQLFormattedError } from 'graphql'
import type { FunctionComponent } from 'react'
import AuthAlert from '../../components/Alerts/AuthAlert'
import DataCard, { DataList } from '../../components/DataCard'
import { NoDataSearchResults } from '../../components/NoSearchResults'
import type { ErrorExtensions } from '../../models/graphql'
import getErrorsForPath from '../../utils/getErrorsForPath'
import getLoadingErrors from '../../utils/getLoadingErrors'
import getUnauthorizedLabels from '../../utils/getUnauthorizedLabels'
import type { DataIconType } from '../../components/DataCard/DataIcon'
import type { DataResult } from './types'

const CardWrapper = styled.div<{ compact: boolean }>`
  width: 100%;
  margin-bottom: ${({ compact }) => (compact ? themeSpacing(2) : themeSpacing(8))};
`

interface CombinedDataResult {
  count: number
  label: string
  results: DataResult[]
  type: DataIconType
  __typename: 'CombinedDataResult'
}

export interface DataSearchResultsProps {
  page: string
  query: string
  results: CombinedDataResult[]
  errors: GraphQLFormattedError<ErrorExtensions>[]
  compact: boolean
  withPagination: boolean
}

const DataSearchResults: FunctionComponent<DataSearchResultsProps> = ({
  query,
  results,
  errors,
  compact,
  withPagination,
}) => {
  const Card = compact ? DataCard : DataList

  // Get the total count for all data types
  const totalCount = results.reduce((acc, { count }) => acc + count, 0)

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
            <Card {...{ ...result, withPagination, hasLoadingError }} />
          </CardWrapper>
        ) : null
      })}
      <>
        {unauthorizedLabels.length > 0 && (
          <AuthAlert excludedResults={unauthorizedLabels.join(', ')} />
        )}
      </>
    </>
  ) : (
    <NoDataSearchResults query={query} unauthorized={unauthorizedLabels} />
  )
}
export default DataSearchResults
