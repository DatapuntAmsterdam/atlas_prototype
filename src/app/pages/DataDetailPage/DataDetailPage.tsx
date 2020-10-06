/* eslint-disable global-require */
import { useDispatch, useSelector } from 'react-redux'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Container, Heading, themeSpacing } from '@amsterdam/asc-ui'
// @ts-ignore
import { AngularWrapper } from 'react-angular'
import ShareBar from '../../components/ShareBar/ShareBar'
import { getUser } from '../../../shared/ducks/user/user'
import {
  getPanoramaPreview,
  isPanoramaPreviewLoading,
} from '../../../panorama/ducks/preview/panorama-preview'
import {
  getDetailData,
  getDetailEndpoint,
  getDetailFilterSelection,
  getDetailTemplateUrl,
  getID,
  getSubType,
  getType,
  isDetailLoading,
} from '../../../shared/ducks/detail/selectors'
import { isGenericTemplate } from '../../../map/services/map-services.config'
import usePromise, { PromiseStatus } from '../../utils/usePromise'
import {
  fetchDetailData,
  getDetailUrl,
  getServiceDefinition,
  toMapDetails,
} from '../../../map/services/map'
import { getPanelTitle, HeadingWrapper, PanelContents } from '../MapPage/detail/DetailPanel'
import DetailHeading from '../MapPage/detail/DetailHeading'
import DetailInfoBox from '../MapPage/detail/DetailInfoBox'
import { getMapDetail } from '../../../map/ducks/detail/actions'
import PageTemplate from '../../components/PageTemplate/PageTemplate'

let angularInstance: any = null

if (typeof window !== 'undefined') {
  require('../../angularModules')
  angularInstance = require('angular')
}

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

const DetailContainer: React.FC<{ isLoading: boolean }> = ({ isLoading, children }) => (
  <div className="qa-detail">
    {children}
    {!isLoading && (
      <div className="u-row">
        <div className="u-col-sm--12">
          <div className="u-margin__left--2 u-margin__bottom--1 qa-share-bar">
            <ShareBar />
          </div>
        </div>
      </div>
    )}
  </div>
)

const Detail: React.FC<Props> = () => {
  const dispatch = useDispatch()
  const [retryCount, setRetryCount] = useState(0)

  const isLoading = useSelector(isDetailLoading)
  const user = useSelector(getUser)
  const endpoint = useSelector(getDetailEndpoint)
  const subType = useSelector(getSubType)
  const type = useSelector(getType)
  const id = useSelector(getID)
  const previewPanorama = useSelector(getPanoramaPreview)
  const isPreviewPanoramaLoading = useSelector(isPanoramaPreviewLoading)
  const detailTemplateUrl = useSelector(getDetailTemplateUrl)
  const detailData = useSelector(getDetailData)
  const detailFilterSelection = useSelector(getDetailFilterSelection)

  const result = usePromise(
    useMemo(async () => {
      const serviceDefinition = getServiceDefinition(`${type}/${subType}`)

      if (!serviceDefinition) {
        return Promise.resolve(null)
      }

      const detailUrl = getDetailUrl(serviceDefinition, id)
      const data = await fetchDetailData(serviceDefinition, id)

      // Legacy, needed to, for example, update the GeoJSON's on the map
      dispatch(getMapDetail(detailUrl))
      return toMapDetails(serviceDefinition, data)
    }, [type, subType, id, retryCount]),
  )

  if (!isGenericTemplate(detailTemplateUrl) && angularInstance) {
    return (
      <DetailContainer isLoading={isLoading}>
        <AngularWrapper
          moduleName="dpDetailWrapper"
          component="dpDetail"
          dependencies={['atlas']}
          angularInstance={angularInstance}
          bindings={{
            isLoading,
            user,
            previewPanorama,
            isPreviewPanoramaLoading,
            detailTemplateUrl,
            detailData,
            detailFilterSelection,
            subType,
            id,
          }}
          interpolateBindings={{
            endpoint,
          }}
        />
      </DetailContainer>
    )
  }
  return (
    <PageTemplate result={result} onRetry={() => setRetryCount(retryCount + 1)}>
      {result.status === PromiseStatus.Fulfilled && (
        <DetailContainer isLoading={isLoading}>
          <DetailWrapper>
            <TypeHeading>{result.value?.data.title}</TypeHeading>
            <HeadingWrapper>
              <Heading as="h1">{getPanelTitle(result)}</Heading>
              {!!result?.value?.data?.infoBox && (
                <DetailInfoBox {...result?.value?.data?.infoBox} />
              )}
            </HeadingWrapper>
            <PanelContents legacyLayout result={result} />
          </DetailWrapper>
        </DetailContainer>
      )}
    </PageTemplate>
  )
}

export default Detail
