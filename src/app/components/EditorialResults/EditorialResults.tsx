import { CardContainer } from '@amsterdam/asc-ui'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import type { GraphQLFormattedError } from 'graphql'
import type { FunctionComponent } from 'react'
import { EDITORIAL_DETAIL_ACTIONS } from '../../../normalizations/cms/normalizeCMSResults'
import type { NormalizedFieldItems } from '../../../normalizations/cms/types'
import { CmsType } from '../../../shared/config/cms.config'
import {
  toArticleSearch,
  toCollectionSearch,
  toPublicationSearch,
  toSpecialSearch,
} from '../../links'
import getErrorsForPath from '../../utils/getErrorsForPath'
import getLoadingErrors from '../../utils/getLoadingErrors'
import getUnauthorizedLabels from '../../utils/getUnauthorizedLabels'
import AuthAlert from '../Alerts/AuthAlert'
import EditorialCard from '../EditorialCard'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import NoSearchResults from '../NoSearchResults'

const EDITORIAL_OVERVIEW_ACTIONS = {
  [CmsType.Article]: toArticleSearch,
  [CmsType.Publication]: toPublicationSearch,
  [CmsType.Special]: toSpecialSearch,
  [CmsType.Collection]: toCollectionSearch,
}

const IMAGE_SIZE = 144

const EditorialCardContainer = styled(CardContainer)`
  padding: 0;
`

export interface EditorialResultsProps {
  query: string
  results: NormalizedFieldItems[]
  loading: boolean
  label: string
  errors: GraphQLFormattedError<any>[]
  className?: string
  isOverviewPage: boolean
  type: CmsType
}

const EditorialResults: FunctionComponent<EditorialResultsProps> = ({
  query,
  results,
  errors,
  label,
  loading,
  className,
  isOverviewPage,
  type: overviewType,
}) => {
  const matchingErrors = getErrorsForPath(errors, ['articleSearch'])
  const hasLoadingError = getLoadingErrors(matchingErrors).length > 0

  // Get all the labels of the type that the user has no access to
  const unauthorizedLabels = getUnauthorizedLabels(matchingErrors)

  return (
    // @ts-ignore
    <EditorialCardContainer className={className}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {!hasLoadingError &&
            results &&
            results.length > 0 &&
            results.map((result) => {
              const {
                id,
                specialType,
                slug,
                coverImage,
                teaserImage,
                dateLocale,
                label: cardLabel,
                title, // For Drupal content
                shortTitle, // For Drupal content
                teaser,
                type,
              } = result

              // Since it's possible that a result might not have a slug, we have to skip that one
              if (!slug || !type) {
                return null
              }
              // The type SPECIALS has a different url structure
              const to = specialType
                ? EDITORIAL_DETAIL_ACTIONS[type](id, specialType, slug)
                : EDITORIAL_DETAIL_ACTIONS[type](id, slug)

              const showContentType = !!(isOverviewPage && specialType) || !!specialType
              const highlighted = isOverviewPage && type === CmsType.Collection

              return (
                <EditorialCard
                  // @ts-ignore
                  forwardedAs={RouterLink}
                  type={type}
                  specialType={specialType}
                  key={id}
                  image={type === CmsType.Publication ? coverImage || teaserImage : teaserImage}
                  imageDimensions={[
                    type === CmsType.Publication ? Math.ceil(IMAGE_SIZE * 0.7) : IMAGE_SIZE, // Publications have different image dimensions
                    IMAGE_SIZE,
                  ]}
                  to={to}
                  title={shortTitle || title || cardLabel}
                  teaser={teaser}
                  date={dateLocale}
                  showContentType={showContentType}
                  highlighted={highlighted}
                />
              )
            })}
          {!hasLoadingError && results?.length === 0 && (
            <NoSearchResults
              query={query}
              label={label}
              to={EDITORIAL_OVERVIEW_ACTIONS[overviewType]()}
            />
          )}
          {!hasLoadingError && unauthorizedLabels.length > 0 && (
            <AuthAlert excludedResults={unauthorizedLabels.join(', ')} />
          )}
          {hasLoadingError && (
            <ErrorMessage
              message="Er is een fout opgetreden bij het laden van dit blok."
              buttonLabel="Probeer opnieuw"
              buttonOnClick={() => window.location.reload()}
            />
          )}
        </>
      )}
    </EditorialCardContainer>
  )
}

export default EditorialResults
