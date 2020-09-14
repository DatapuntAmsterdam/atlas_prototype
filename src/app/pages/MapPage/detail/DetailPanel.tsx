import { MapPanelContent } from '@datapunt/arm-core'
import { Alert, Heading, Link, Paragraph, themeColor, themeSpacing } from '@datapunt/asc-ui'
import React, { Fragment, useContext, useMemo } from 'react'
import styled from 'styled-components'
import {
  fetchDetailData,
  getServiceDefinition,
  MapDetails,
  parseDetailPath,
  toMapDetails,
} from '../../../../map/services/map'
import {
  DetailResultItem,
  DetailResultItemDefinitionList,
  DetailResultItemHeading,
  DetailResultItemType,
} from '../../../../map/types/details'
import DefinitionList, { DefinitionListItem } from '../../../components/DefinitionList'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import useParam from '../../../utils/useParam'
import usePromise, { PromiseResult, PromiseStatus } from '../../../utils/usePromise'
import PanoramaPreview from '../map-search/PanoramaPreview'
import MapContext from '../MapContext'
import { detailUrlParam } from '../query-params'

export interface DetailPanelProps {
  detailUrl: string
}

const StyledLoadingSpinner = styled(LoadingSpinner)`
  margin: ${themeSpacing(4)} 0;
`

const Message = styled(Paragraph)`
  margin: ${themeSpacing(4)} 0;
`

const Spacer = styled.div`
  width: 100%;
  height: ${themeSpacing(4)};
`

const DetailPanel: React.FC<DetailPanelProps> = ({ detailUrl }) => {
  const [, setDetailUrl] = useParam(detailUrlParam)
  const { setDetailFeature } = useContext(MapContext)
  const result = usePromise(
    useMemo(async () => {
      const detailParams = parseDetailPath(detailUrl)
      const serviceDefinition = getServiceDefinition(detailParams.type)

      if (!serviceDefinition) {
        return Promise.resolve(null)
      }

      const data = await fetchDetailData(serviceDefinition, detailParams.id)
      const details = await toMapDetails(serviceDefinition, data)

      setDetailFeature({
        id: detailParams.id,
        type: 'Feature',
        geometry: details.geometry,
        properties: null,
      })

      return details
    }, [detailUrl]),
  )

  const subTitle = (result.status === PromiseStatus.Fulfilled && result.value?.data.title) || ''

  return (
    <MapPanelContent
      title={getPanelTitle(result)}
      subTitle={subTitle}
      onClose={() => setDetailUrl(null)}
    >
      {renderPanelContents(result)}
    </MapPanelContent>
  )
}

function renderPanelContents(result: PromiseResult<MapDetails | null>) {
  if (result.status === PromiseStatus.Pending) {
    return <StyledLoadingSpinner />
  }

  if (result.status === PromiseStatus.Rejected) {
    return <Message>Details konden niet geladen worden.</Message>
  }

  return renderDetails(result.value)
}

function renderDetails(details: MapDetails | null) {
  if (!details) {
    return <Message>Geen detailweergave beschikbaar.</Message>
  }

  return (
    <>
      <PanoramaPreview location={details.location} radius={180} aspect={2.5} />
      <Spacer />
      {details.data.notifications?.map((notification) => (
        <Fragment key={notification.value}>
          <Alert level={notification.level} dismissible={notification.canClose}>
            {notification.value}
          </Alert>
          <Spacer />
        </Fragment>
      ))}
      {details.data.items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={item.type + index}>
          {renderItem(item)}
          <Spacer />
        </Fragment>
      ))}
    </>
  )
}

function renderItem(item: DetailResultItem) {
  switch (item.type) {
    case DetailResultItemType.DefinitionList:
      return renderDefinitionListItem(item)
    case DetailResultItemType.Heading:
      return renderHeadingItem(item)
    default:
      throw new Error('Unable to render map detail pane, encountered unknown item type.')
  }
}

function renderDefinitionListItem(item: DetailResultItemDefinitionList) {
  return (
    <>
      {item.title && <Heading forwardedAs="h4">{item.title}</Heading>}
      <DefinitionList>
        {item.entries.map(({ term, description, link }) => (
          <DefinitionListItem term={term}>
            {link ? (
              <Link href={link} inList target="_blank">
                {description}
              </Link>
            ) : (
              description
            )}
          </DefinitionListItem>
        ))}
      </DefinitionList>
    </>
  )
}

const StyledHeading = styled(Heading)`
  color: ${themeColor('secondary')};
  margin: 0;
`

function renderHeadingItem(item: DetailResultItemHeading) {
  return <StyledHeading forwardedAs="h3">{item.value}</StyledHeading>
}

function getPanelTitle(result: PromiseResult<MapDetails | null>) {
  if (result.status === PromiseStatus.Fulfilled && result.value) {
    return result.value.data.subTitle
  }

  return 'Detailweergave'
}

export default DetailPanel
