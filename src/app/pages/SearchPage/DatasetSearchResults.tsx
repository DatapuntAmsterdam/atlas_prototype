import { FunctionComponent } from 'react'
import { Enlarge } from '@amsterdam/asc-assets'
import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { dcatdScopes } from '../../../shared/services/auth/auth'
import getState from '../../../shared/services/redux/get-state'
import { toDatasetDetail, toDatasetSearch } from '../../../store/redux-first-router/actions'
import ActionButton from '../../components/ActionButton/ActionButton'
import AuthAlert from '../../components/Alerts/AuthAlert'
import DatasetCard from '../../components/DatasetCard'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import { modificationDateFilter } from '../../components/Filters/Filters'
import NoSearchResults from '../../components/NoSearchResults'
import getErrorsForPath from '../../utils/getErrorsForPath'
import getLoadingErrors from '../../utils/getLoadingErrors'
import getUnauthorizedLabels from '../../utils/getUnauthorizedLabels'
import redirectToDcatd from '../../utils/redirectToDcatd'
import toSlug from '../../utils/toSlug'

const DatasetCardContainer = styled.div`
  margin-bottom: ${themeSpacing(8)};
`

const StyledDatasetCard = styled(DatasetCard)`
  margin: ${themeSpacing(2, 0)};
`

const StyledActionButton = styled(ActionButton)`
  margin-bottom: ${themeSpacing(8)};
`

export interface Result {
  header: string
  teaser: string
  modified: string
  id: string
  tags: string[]
  distributionTypes: string[]
  __typename: string
}

export type DatasetSearchResultsProps = {
  query?: string
  label?: string
  results?: Result[]
  errors?: any
  isOverviewPage?: boolean
}

const DatasetSearchResults: FunctionComponent<DatasetSearchResultsProps> = ({
  query = '',
  label,
  results,
  errors = [],
  isOverviewPage,
}) => {
  // Check if user has the correct scopes to add or edit datasets
  const canEdit =
    getState().user && isOverviewPage
      ? getState().user.scopes.some((scope) => dcatdScopes.includes(scope))
      : false

  const matchingErrors: any = getErrorsForPath(errors, ['datasetSearch'])
  const hasLoadingError = getLoadingErrors(matchingErrors).length > 0

  // Get all the labels of the type that the user has no access to
  const unauthorizedLabels = getUnauthorizedLabels(matchingErrors)

  if (results && results.length > 0) {
    return (
      <DatasetCardContainer>
        {canEdit && (
          <StyledActionButton
            data-testid="actionButton"
            fetching={false}
            onClick={() => redirectToDcatd('_')}
            label="Toevoegen"
            iconLeft={<Enlarge />}
          />
        )}

        {results.map(({ header, id, teaser, modified, distributionTypes }) => (
          <StyledDatasetCard
            data-testid="datasetCard"
            key={id}
            to={toDatasetDetail({
              id,
              slug: toSlug(header) || '',
            })}
            shortTitle={header}
            teaser={teaser}
            lastModified={modificationDateFilter(modified)}
            modified={modified}
            distributionTypes={distributionTypes}
          />
        ))}

        {unauthorizedLabels.length > 0 && (
          <AuthAlert excludedResults={unauthorizedLabels.join(', ')} />
        )}
      </DatasetCardContainer>
    )
  }

  return hasLoadingError ? (
    <ErrorMessage
      data-testid="errorMessage"
      message="Er is een fout opgetreden bij het laden van dit blok."
      buttonLabel="Probeer opnieuw"
      buttonOnClick={() => window.location.reload()}
    />
  ) : (
    <NoSearchResults query={query} label={label} to={toDatasetSearch(null, false, false, false)} />
  )
}

export default DatasetSearchResults
