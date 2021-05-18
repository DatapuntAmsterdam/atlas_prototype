/* eslint-disable camelcase */
import { Link, Row, themeSpacing } from '@amsterdam/asc-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import usePromise, { isFulfilled, isPending, isRejected } from '@amsterdam/use-promise'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import cmsConfig from '../../../shared/config/cms.config'
import CardListBlock from './components/CardListBlock'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import useDocumentTitle from '../../utils/useDocumentTitle'
import CollectionTileGrid from './CollectionTileGrid'
import { fetchSingleFromCms } from '../../utils/fetchFromCms'

const StyledCardListBlock = styled(CardListBlock)`
  margin-top: ${themeSpacing(12)};
  margin-bottom: ${themeSpacing(12)};
`

const CollectionDetailPage: FunctionComponent = () => {
  const { id } =
    useParams<{
      id: string
    }>()
  const [retryCount, setRetryCount] = useState(0)

  const { setDocumentTitle } = useDocumentTitle()

  const result = usePromise(
    () =>
      fetchSingleFromCms(
        cmsConfig.CMS_COLLECTION_DETAIL.endpoint(id),
        cmsConfig.CMS_COLLECTION_DETAIL.fields,
      ),
    [id, retryCount],
  )

  useEffect(() => {
    if (isFulfilled(result)) {
      setDocumentTitle(`Dossier: ${result.value.title ?? ''}`)
    }
  }, [result])

  if (isRejected(result)) {
    return (
      <ErrorMessage
        absolute
        message="Er is een fout opgetreden bij het laden van deze pagina."
        buttonLabel="Probeer opnieuw"
        buttonOnClick={() => setRetryCount(retryCount + 1)}
      />
    )
  }

  const listResults = isFulfilled(result) ? result.value.field_blocks : []
  const tileResults = isFulfilled(result) ? result.value.field_items : []
  const loading = isPending(result)

  return (
    <ContentContainer>
      <Row>
        <CollectionTileGrid
          {...{
            results: tileResults,
            loading,
            title: isFulfilled(result) ? result.value.title : '',
            description: isFulfilled(result) ? result.value.field_intro : '',
          }}
        />
        <StyledCardListBlock
          results={isFulfilled(result) ? listResults : undefined}
          loading={loading}
        />
        {isFulfilled(result) && result.value.field_link?.uri && (
          <Link inList href={result.value.field_link?.uri} title={result.value.field_link?.title}>
            {result.value.field_link?.title ??
              (result.value.title ? `Meer over ${result.value.title}` : 'Lees meer')}
          </Link>
        )}
      </Row>
    </ContentContainer>
  )
}

export default CollectionDetailPage
