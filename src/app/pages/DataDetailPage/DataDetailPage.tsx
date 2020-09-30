/* eslint-disable global-require */
import { connect, useDispatch } from 'react-redux'
import React, { useEffect, useMemo, useRef } from 'react'
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
import useCompare from '../../utils/useCompare'
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

const Detail: React.FC<Props> = ({
  isLoading,
  user,
  endpoint,
  previewPanorama,
  isPreviewPanoramaLoading,
  detailTemplateUrl,
  detailData,
  detailFilterSelection,
  subType,
  type,
  id,
}) => {
  // Todo: temp fix. React-router doesn't unmount and mount the component, where redux-first-router did
  const idIsUpdated = useCompare(id)
  const isFirstRun = useRef(true)
  const dispatch = useDispatch()

  useEffect(() => {
    if (idIsUpdated && !isFirstRun.current && !isGenericTemplate(detailTemplateUrl)) {
      window.location.reload()
    }
    if (isFirstRun.current) {
      isFirstRun.current = false
    }
  }, [idIsUpdated, id, detailTemplateUrl])

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
    }, [type, subType, id]),
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
  if (result.status === PromiseStatus.Fulfilled) {
    return (
      <DetailContainer isLoading={isLoading}>
        <DetailWrapper>
          <TypeHeading>{result.value?.data.title}</TypeHeading>
          <HeadingWrapper>
            <Heading as="h1">{getPanelTitle(result)}</Heading>
            {!!result?.value?.data?.infoBox && <DetailInfoBox {...result?.value?.data?.infoBox} />}
          </HeadingWrapper>
          <PanelContents legacyLayout result={result} />
        </DetailWrapper>
      </DetailContainer>
    )
  }

  return null
}

const mapStateToProps = (state: any) => ({
  isLoading: isDetailLoading(state),
  user: getUser(state),
  endpoint: getDetailEndpoint(state),
  subType: getSubType(state),
  type: getType(state),
  id: getID(state),
  previewPanorama: getPanoramaPreview(state),
  isPreviewPanoramaLoading: isPanoramaPreviewLoading(state),
  detailTemplateUrl: getDetailTemplateUrl(state),
  detailData: getDetailData(state),
  detailFilterSelection: getDetailFilterSelection(state),
})

// @ts-ignore
export default connect(mapStateToProps)(Detail)
