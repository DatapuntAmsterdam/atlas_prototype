import styled from '@datapunt/asc-core'
import { CardContainer } from '@datapunt/asc-ui'
import RouterLink from 'redux-first-router-link'
import React, { memo } from 'react'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'
import { CmsType } from '../../../shared/config/cms.config'
import {
  toArticleSearch,
  toPublicationSearch,
  toSpecialSearch,
} from '../../../store/redux-first-router/actions'
import getErrorsForPath from '../../utils/getErrorsForPath'
import getLoadingErrors from '../../utils/getLoadingErrors'
import getUnauthorizedLabels from '../../utils/getUnauthorizedLabels'
import EditorialCard from '../EditorialCard'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import NoSearchResults from '../NoSearchResults'
import MoreResultsWhenLoggedIn from '../PanelMessages/MoreResultsWhenLoggedIn'
import { EDITORIAL_DETAIL_ACTIONS } from '../../../normalizations/cms/useNormalizedCMSResults'

const EDITORIAL_OVERVIEW_ACTIONS = {
  [CmsType.Article]: toArticleSearch,
  [CmsType.Publication]: toPublicationSearch,
  [CmsType.Special]: toSpecialSearch,
}

export const IMAGE_SIZE = 144

const EditorialCardContainer = styled(CardContainer)`
  padding: 0;
`

// TODO: Add results for 'collection' CMS content.
const EditorialResults = ({ query, results, errors, label, loading, type, className }) => {
  const matchingErrors = getErrorsForPath(errors, ['articleSearch'])
  const hasLoadingError = getLoadingErrors(matchingErrors).length > 0

  // Get all the labels of the type that the user has no access to
  const unauthorizedLabels = getUnauthorizedLabels(matchingErrors)

  return (
    <EditorialCardContainer className={className}>
      {loading ? (
        <LoadingIndicator style={{ position: 'inherit' }} />
      ) : (
        <>
          {!hasLoadingError &&
            results.length > 0 &&
            results.map(result => {
              const {
                id,
                specialType,
                slug,
                coverImage,
                teaserImage,
                dateLocale,
                label: cardLabel,
                teaser,
              } = result

              // The type SPECIALS has a different url structure
              const to = specialType
                ? EDITORIAL_DETAIL_ACTIONS[type](id, specialType, slug)
                : EDITORIAL_DETAIL_ACTIONS[type](id, slug)

              return (
                <EditorialCard
                  forwardedAs={RouterLink}
                  specialType={specialType}
                  key={id}
                  image={type === CmsType.Publication ? coverImage : teaserImage}
                  imageDimensions={[
                    type === CmsType.Publication ? IMAGE_SIZE * 0.7 : IMAGE_SIZE, // Publications have different image dimensions
                    IMAGE_SIZE,
                  ]}
                  to={to}
                  title={cardLabel}
                  description={teaser}
                  date={!specialType && dateLocale}
                />
              )
            })}
          {!hasLoadingError && results.length === 0 && (
            <NoSearchResults
              query={query}
              label={label}
              to={EDITORIAL_OVERVIEW_ACTIONS[type](null, false, false, false)}
            />
          )}
          {!hasLoadingError && unauthorizedLabels.length > 0 && (
            <MoreResultsWhenLoggedIn excludedResults={unauthorizedLabels.join(', ')} />
          )}
          {hasLoadingError && <ErrorMessage />}
        </>
      )}
    </EditorialCardContainer>
  )
}

export default memo(EditorialResults, () => false)
