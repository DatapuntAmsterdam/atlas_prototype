/* eslint-disable camelcase */
import React, { useContext } from 'react'
import NoResultsForSearchType from '../Messages/NoResultsForSearchType'
import PAGES from '../../pages'
import EditorialOverviewPage from '../../pages/EditorialOverviewPage/EditorialOverviewPage'
import { getByUrl } from '../../../shared/services/api/api'
import { ArticleSearchContext, PublicationSearchContext } from './editorialSearchContexts'
import { useArticleSearchDuck, usePublicationSearchDuck } from './editorialSearchHooks'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import { EDITORIAL_DETAIL_ACTIONS } from '../../pages/EditorialOverviewPage/constants'
import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'

const contextMapping = {
  [PAGES.ARTICLES]: ArticleSearchContext,
  [PAGES.PUBLICATIONS]: PublicationSearchContext,
}

const ducksMapping = {
  [PAGES.ARTICLES]: useArticleSearchDuck,
  [PAGES.PUBLICATIONS]: usePublicationSearchDuck,
}

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

  if (results && results.count === 0) {
    return <NoResultsForSearchType message="Tip: maak de zoekcriteria minder specifiek." />
  }

  const searchData = selectors
    .results({ results })
    .map(({ title, slug, nid, intro, teaser_url }) => {
      const { href } = linkAttributesFromAction(EDITORIAL_DETAIL_ACTIONS[type](nid, slug))
      return {
        href,
        key: nid,
        id: nid,
        title,
        intro,
        teaserImageUrl: teaser_url && `${SHARED_CONFIG.CMS_ROOT}${teaser_url}`,
      }
    })

  return (
    <EditorialOverviewPage
      type={type}
      loading={loading}
      results={searchData}
      onClickMore={loadMore}
      links={results._links}
    />
  )
}

export default EditorialSearch
