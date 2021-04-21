import { Container, Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import PromiseResult from '../../components/PromiseResult/PromiseResult'
import ShareBar from '../../components/ShareBar/ShareBar'
import { DataDetailParams } from '../../links'
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

const DataDetailPage: FunctionComponent = () => {
  const getDetailData = useDataDetail()
  const { id: rawId, subtype: subType, type } = useParams<DataDetailParams>()

  if (!rawId || !subType || !type) {
    return null
  }

  const id = rawId.includes('id') ? rawId.substr(2) : rawId

  return (
    <PromiseResult factory={() => getDetailData(id, subType, type)} deps={[id, subType, type]}>
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
