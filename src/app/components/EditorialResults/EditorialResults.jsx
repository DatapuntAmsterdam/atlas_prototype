import React, { memo } from 'react'
import styled from '@datapunt/asc-core'
import { CardContainer } from '@datapunt/asc-ui'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'
import EditorialCard from '../EditorialCard'
import NoSearchResults from '../NoSearchResults'
import { EDITORIAL_OVERVIEW_ACTIONS } from '../../../normalizations/cms/useNormalizedCMSResults'

const EditorialCardContainer = styled(CardContainer)`
  padding: 0;
`

const EditorialResults = ({ query, results, label, loading, type, className }) => (
  <EditorialCardContainer className={className}>
    {!results && loading ? (
      <LoadingIndicator style={{ position: 'inherit' }} />
    ) : (
      <>
        {results && results.length ? (
          results.map(result => <EditorialCard {...result} key={result.id} type={type} />)
        ) : (
          <NoSearchResults query={query} label={label} to={EDITORIAL_OVERVIEW_ACTIONS[type]()} />
        )}
      </>
    )}
  </EditorialCardContainer>
)

export default memo(EditorialResults, () => false)
