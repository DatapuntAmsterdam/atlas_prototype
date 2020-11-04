import { Container, Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { DetailInfo } from '../../../map/types/details'
import PromiseResult from '../../components/PromiseResult/PromiseResult'
import ShareBar from '../../components/ShareBar/ShareBar'
import DetailInfoBox from '../MapPage/detail/DetailInfoBox'
import { HeadingWrapper, RenderDetails } from '../MapPage/detail/DetailPanel'
import useDataDetail from './useDataDetail'

const DetailWrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  margin: ${themeSpacing(4, 0)};
  padding: ${themeSpacing(0, 4)};
`

const DetailType = styled.strong`
  margin-bottom: 0;
  color: ${themeColor('secondary')};
  font-size: 21px;
`

// TODO: 'subType' should be replaced with the 'subType' property on 'DetailInfo'
// This should happen when the old Angular and Redux Router code has been deleted.
interface DataDetailPageParams extends Omit<DetailInfo, 'subType'> {
  subtype: string
}

const DataDetailPage: FunctionComponent = () => {
  const { id: rawId, subtype: subType, type } = useParams<DataDetailPageParams>()
  if (!rawId || !subType || !type) {
    return null
  }
  const id = rawId.includes('id') ? rawId.substr(2) : rawId
  const { result: promise, onRetry } = useDataDetail(id, subType, type)

  return (
    <PromiseResult<any> promise={promise} onRetry={onRetry}>
      {(result) => (
        <DetailWrapper>
          <DetailType>{result.value?.data.title}</DetailType>
          <HeadingWrapper>
            <Heading data-testid="data-detail-heading">
              {result.value.data.subTitle || 'Detailweergave'}
            </Heading>
            {result?.value?.data?.infoBox && <DetailInfoBox {...result?.value?.data?.infoBox} />}
          </HeadingWrapper>
          <RenderDetails legacyLayout details={result.value} />
          <ShareBar />
        </DetailWrapper>
      )}
    </PromiseResult>
  )
}

export default DataDetailPage
