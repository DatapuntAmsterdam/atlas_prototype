import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { Container, Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { DetailInfo } from '../../../map/types/details'
import PromiseResult from '../../components/PromiseTemplate/PromiseResult'
import ShareBar from '../../components/ShareBar/ShareBar'
import { getPanelTitle, HeadingWrapper, PanelContents } from '../MapPage/detail/DetailPanel'
import DetailInfoBox from '../MapPage/detail/DetailInfoBox'
import useDataDetail from './useDataDetail'

type Props = {
  isLoading: boolean
  user: object
  endpoint: string
  id: string
  type: string
  subType: string
  previewPanorama?: object
  isPreviewPanoramaLoading?: boolean
  detailTemplateUrl?: string
  detailData?: object
  detailFilterSelection?: object
}

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

interface Params extends DetailInfo {
  subtype: string
}

const Detail: React.FC<Props> = () => {
  const { id: rawId, subtype: subType, type } = useParams<Params>()
  const id = rawId.includes('id') ? rawId.substr(2) : rawId

  const { result: promise, onRetry } = useDataDetail(id, subType, type)

  return (
    <PromiseResult<any> promise={promise} onRetry={onRetry}>
      {(result) => (
        <DetailWrapper>
          <DetailType>{result.value?.data.title}</DetailType>
          <HeadingWrapper>
            <Heading>{getPanelTitle(result)}</Heading>
            {result?.value?.data?.infoBox && <DetailInfoBox {...result?.value?.data?.infoBox} />}
          </HeadingWrapper>
          <PanelContents legacyLayout result={result} />
          <ShareBar />
        </DetailWrapper>
      )}
    </PromiseResult>
  )
}

export default Detail
