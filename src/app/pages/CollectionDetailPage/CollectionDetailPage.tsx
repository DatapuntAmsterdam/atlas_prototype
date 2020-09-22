/* eslint-disable camelcase */
import { Link, Row, themeSpacing } from '@amsterdam/asc-ui'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { cmsConfig } from '../../../shared/config/config'
import { getLocationPayload } from '../../../store/redux-first-router/selectors'
import CardListBlock, { CMSCollectionList } from '../../components/CardList/CardListBlock'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useFromCMS, { CMSResultItem } from '../../utils/useFromCMS'
import CollectionTileGrid from './CollectionTileGrid'

const StyledRow = styled(Row)`
  // To center the ErrorMessage
  justify-content: center;
`
const StyledCardListBlock = styled(CardListBlock)`
  margin-top: ${themeSpacing(12)};
  margin-bottom: ${themeSpacing(12)};
`

type CollectionResult = {
  title?: string
  field_intro?: string
  field_link?: {
    uri?: string
    title?: string
  }
  field_blocks: CMSCollectionList[]
  field_items: CMSResultItem[]
}

const CollectionDetailPage: React.FC = () => {
  const { id } = useSelector(getLocationPayload)
  const { setDocumentTitle } = useDocumentTitle()
  const { results, fetchData, loading, error } = useFromCMS<CollectionResult>(
    cmsConfig.CMS_COLLECTION_DETAIL,
    id,
  )

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (results?.title) {
      setDocumentTitle(`Dossier: ${results.title}`)
    }
  }, [results])

  const listResults = results?.field_blocks ?? []
  const tileResults = results?.field_items ?? []
  return (
    <ContentContainer>
      {error ? (
        <StyledRow>
          <ErrorMessage
            message="Er is een fout opgetreden bij het laden van dit blok."
            buttonLabel="Probeer opnieuw"
            buttonOnClick={fetchData}
          />
        </StyledRow>
      ) : (
        <Row>
          <CollectionTileGrid
            {...{
              results: tileResults,
              loading,
              title: results?.title,
              description: results?.field_intro,
            }}
          />
          <StyledCardListBlock {...{ results: listResults, loading }} />
          {results?.field_link?.uri && (
            <Link inList href={results?.field_link?.uri} title={results?.field_link?.title}>
              {results?.field_link?.title || `Meer over ${results?.title}`}
            </Link>
          )}
        </Row>
      )}
    </ContentContainer>
  )
}

export default CollectionDetailPage
