import { Enlarge } from '@datapunt/asc-assets'
import styled from 'styled-components'
import { themeSpacing } from '@datapunt/asc-ui'
import React from 'react'
import { dcatdScopes } from '../../../shared/services/auth/auth'
import getState from '../../../shared/services/redux/get-state'
import { toDatasetDetail, toDatasetSearch } from '../../../store/redux-first-router/actions'
import ActionButton from '../../components/ActionButton/ActionButton'
import DatasetCard from '../../components/DatasetCard'
import { modificationDateFilter } from '../../components/Filters/Filters'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import NoSearchResults from '../../components/NoSearchResults'
import MoreResultsWhenLoggedIn from '../../components/Alerts/MoreResultsWhenLoggedIn'
import getErrorsForPath from '../../utils/getErrorsForPath'
import getLoadingErrors from '../../utils/getLoadingErrors'
import getUnauthorizedLabels from '../../utils/getUnauthorizedLabels'
import redirectToDcatd from '../../utils/redirectToDcatd'
import useSlug from '../../utils/useSlug'

const DatasetCardContainer = styled.div`
  margin-bottom: ${themeSpacing(8)};
`

const StyledDatasetCard = styled(DatasetCard)`
  margin: ${themeSpacing(2, 0)};
`

const StyledActionButton = styled(ActionButton)`
  margin-bottom: ${themeSpacing(8)};
`

const DatasetSearchResults = ({ query, label, results, errors, isOverviewPage }) => {
  // Check if user has the correct scopes to add or edit datasets
  const canEdit =
    getState().user && isOverviewPage
      ? getState().user.scopes.some((scope) => dcatdScopes.includes(scope))
      : false

  const matchingErrors = getErrorsForPath(errors, ['datasetSearch'])
  const hasLoadingError = getLoadingErrors(matchingErrors).length > 0

  // Get all the labels of the type that the user has no access to
  const unauthorizedLabels = getUnauthorizedLabels(matchingErrors)

  if (results.length > 0) {
    return (
      <DatasetCardContainer>
        {canEdit && (
          <StyledActionButton
            data-test="ActionButton"
            onClick={() => redirectToDcatd('_')}
            label="Toevoegen"
            iconLeft={<Enlarge />}
          />
        )}

        {results.map(({ header, id, teaser, modified, distributionTypes }) => (
          <StyledDatasetCard
            data-test="DatasetCard"
            {...{
              key: id,
              to: toDatasetDetail({
                id,
                slug: useSlug(header) || '',
              }),
              shortTitle: header,
              teaser,
              lastModified: modificationDateFilter(modified),
              modified,
              distributionTypes,
            }}
          />
        ))}

        {unauthorizedLabels.length > 0 && (
          <MoreResultsWhenLoggedIn excludedResults={unauthorizedLabels.join(', ')} />
        )}
      </DatasetCardContainer>
    )
  }

  return hasLoadingError ? (
    <ErrorMessage
      message="Er is een fout opgetreden bij het laden van dit blok."
      buttonLabel="Probeer opnieuw"
      buttonOnClick={() => window.location.reload()}
    />
  ) : (
    <NoSearchResults query={query} label={label} to={toDatasetSearch(null, false, false, false)} />
  )
}

export default DatasetSearchResults
