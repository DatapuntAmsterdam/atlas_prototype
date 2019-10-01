/* eslint-disable camelcase */
import React, { useContext } from 'react'
import RouterLink from 'redux-first-router-link'
import { Link } from '@datapunt/asc-ui'
import styled from '@datapunt/asc-core'
import NoResultsForSearchType from '../Messages/NoResultsForSearchType'
import PAGES from '../../pages'
import { getByUrl } from '../../../shared/services/api/api'
import { ArticleSearchContext, PublicationSearchContext } from './editorialSearchContexts'
import { useArticleSearchDuck, usePublicationSearchDuck } from './editorialSearchHooks'
import useNormalizedCMSResults from '../../../normalizations/cms/useNormalizedCMSResults'
import EditorialResults from '../EditorialResults'
import ShareBar from '../ShareBar/ShareBar'
import { toArticleOverview, toPublicationOverview } from '../../../store/redux-first-router/actions'
import { EDITORIAL_TITLES } from '../../pages/EditorialOverviewPage/constants'

const contextMapping = {
  [PAGES.ARTICLES]: ArticleSearchContext,
  [PAGES.PUBLICATIONS]: PublicationSearchContext,
}

const ducksMapping = {
  [PAGES.ARTICLES]: useArticleSearchDuck,
  [PAGES.PUBLICATIONS]: usePublicationSearchDuck,
}

const routeMapping = {
  [PAGES.ARTICLES]: toArticleOverview,
  [PAGES.PUBLICATIONS]: toPublicationOverview,
}

const StyledEditorialSearch = styled.div`
  margin-bottom: 24px;
  max-width: 792px; // Image width + 600px (design system rule)
`

const EditorialSearch = ({ type }) => {
  const [{ results, loading }, dispatch] = useContext(contextMapping[type])
  const { actions, selectors } = ducksMapping[type]()

  const loadMore = async endpoint => {
    dispatch(actions.request())
    try {
      const payload = await getByUrl(endpoint)
      dispatch(actions.accumulateResults(payload))
    } catch (e) {
      dispatch(actions.failure(e))
    }
  }

  if (results && !results.results) {
    return (
      <>
        <NoResultsForSearchType
          message={
            <p>
              Tip: maak de zoekcriteria minder specifiek. Of bekijk de lijst{' '}
              <Link
                variant="inline"
                $as={RouterLink}
                to={routeMapping[type]()}
                title={`Overzicht van ${EDITORIAL_TITLES[type]}`}
              >
                {EDITORIAL_TITLES[type]}
              </Link>
              .
            </p>
          }
          hideLoginLink
        />
        <ShareBar topSpacing={6} />
      </>
    )
  }

  const searchData = useNormalizedCMSResults(selectors.results({ results }), type)

  return (
    <StyledEditorialSearch>
      <EditorialResults
        type={type}
        loading={loading}
        results={searchData}
        onClickMore={loadMore}
        links={results._links}
        showTitle={false}
      />
      <ShareBar topSpacing={6} />
    </StyledEditorialSearch>
  )
}

export default EditorialSearch
