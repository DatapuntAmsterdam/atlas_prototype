import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { Container, Heading, themeSpacing } from '@amsterdam/asc-ui'
// @ts-ignore
import ShareBar from '../../components/ShareBar/ShareBar'
import { getPanelTitle, HeadingWrapper, PanelContents } from '../MapPage/detail/DetailPanel'
import DetailHeading from '../MapPage/detail/DetailHeading'
import DetailInfoBox from '../MapPage/detail/DetailInfoBox'
import PromiseResult from '../../components/PromiseTemplate/PromiseResult'
import useDataDetail from './useDataDetail'
import { DetailInfo } from '../../../map/types/details'

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

const TypeHeading = styled(DetailHeading)`
  margin-bottom: 0;
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
      {({ result }) => (
        <DetailWrapper>
          <TypeHeading>{result.value?.data.title}</TypeHeading>
          <HeadingWrapper>
            <Heading as="h1">{getPanelTitle(result)}</Heading>
            {!!result?.value?.data?.infoBox && <DetailInfoBox {...result?.value?.data?.infoBox} />}
          </HeadingWrapper>
          <PanelContents legacyLayout result={result} />
          <ShareBar />
        </DetailWrapper>
      )}
    </PromiseResult>
  )
}

export default Detail
