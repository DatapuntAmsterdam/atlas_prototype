import { MapPanelContent } from '@amsterdam/arm-core'
import { Alert, Button, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import { Enlarge, Minimise } from '@amsterdam/asc-assets'
import React, { Fragment, useContext, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import {
  fetchDetailData,
  getServiceDefinition,
  MapDetails,
  parseDetailPath,
  toMapDetails,
} from '../../../../map/services/map'
import {
  DetailResultItem,
  DetailResultItemPaginatedData,
  DetailResultItemType,
} from '../../../../map/types/details'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import useParam from '../../../utils/useParam'
import usePromise, { PromiseResult, PromiseStatus } from '../../../utils/usePromise'
import PanoramaPreview, { PreviewContainer } from '../map-search/PanoramaPreview'
import MapContext from '../MapContext'
import { detailUrlParam } from '../query-params'
import DetailTable from './DetailTable'
import DetailHeading from './DetailHeading'
import DetailDefinitionList from './DetailDefinitionList'
import DetailLinkList from './DetailLinkList'
import DetailInfoBox from './DetailInfoBox'
import DetailSpacer from './DetailSpacer'

interface DetailPanelProps {
  detailUrl: string
}

const StyledLoadingSpinner = styled(LoadingSpinner)`
  margin: ${themeSpacing(4)} 0;
`

const Message = styled(Paragraph)`
  margin: ${themeSpacing(4)} 0;
`

const ShowMoreButton = styled(Button)`
  margin-top: ${themeSpacing(1)};
`

// Todo: remove gridArea when legacy map is removed
const ItemWrapper = styled.div<{ gridArea?: string }>`
  display: flex;
  flex-direction: column;
  ${({ gridArea }) =>
    gridArea &&
    css`
      grid-area: ${gridArea} !important;
    `}
`
export const HeadingWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`

export const InfoBoxWrapper = styled.div``

// Todo AfterBeta: legacyLayout can be removed
const Wrapper = styled.div<LegacyLayout>`
  ${({ legacyLayout }) =>
    legacyLayout &&
    css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-auto-rows: auto;
      gap: ${themeSpacing(3, 2)};

      ${PreviewContainer} {
        grid-area: 2 / 2 / 3 / 3;

        & + ${DetailSpacer} {
          display: none;
        }
      }

      & > * {
        grid-column: 1 / span 2;
      }
    `}
`

type LegacyLayout = {
  legacyLayout?: boolean
}

export const PanelContents: React.FC<
  { result: PromiseResult<MapDetails | null> } & LegacyLayout
> = ({ result, legacyLayout }) => {
  if (result.status === PromiseStatus.Pending) {
    return <StyledLoadingSpinner />
  }

  if (result.status === PromiseStatus.Rejected) {
    return <Message>Details konden niet geladen worden.</Message>
  }
  return <RenderDetails legacyLayout={legacyLayout} details={result.value} />
}

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
      <PanelContents result={result} />
    </MapPanelContent>
  )
}

const Item: React.FC<{ item: DetailResultItem }> = ({ item }) => {
  let component = null
  switch (item.type) {
    case DetailResultItemType.DefinitionList:
      component = <DetailDefinitionList entries={item.entries} />
      break
    case DetailResultItemType.Heading:
      component = <DetailHeading>{item.title}</DetailHeading>
      break
    case DetailResultItemType.Table:
      component = <DetailTable item={item} />
      break
    case DetailResultItemType.LinkList:
      component = <DetailLinkList item={item} />
      break
    case DetailResultItemType.PaginatedData:
      component = <PaginatedData item={item} />
      break
    default:
      throw new Error('Unable to render map detail pane, encountered unknown item type.')
  }

  // Todo: remove Heading type
  return component && item.type !== DetailResultItemType.Heading ? (
    <div>
      {item.title && (
        <HeadingWrapper>
          {/*
          // @ts-ignore */}
          <DetailHeading styleAs="h4">{item.title}</DetailHeading>
          {item.infoBox && <DetailInfoBox {...item.infoBox} />}
        </HeadingWrapper>
      )}

      {component}
    </div>
  ) : null
}

function PaginatedData({
  item,
}: {
  item: DetailResultItemPaginatedData
}): React.ReactElement | null {
  // Unfortunately we cannot use "-1", as apparently wont work for some API's
  const INFINITE_PAGE_SIZE = 999

  const [pageSize, setPaginatedUrl] = useState(item.pageSize)
  const promiseResult = usePromise(
    useMemo(async () => item.getData(undefined, pageSize), [pageSize]),
  )

  if (promiseResult.status === PromiseStatus.Fulfilled && promiseResult.value) {
    const result = item.toView(promiseResult?.value.data)

    const showMoreButton =
      promiseResult?.value?.count > promiseResult?.value?.data?.length ||
      pageSize === INFINITE_PAGE_SIZE
    const showMoreText = `Toon alle ${
      promiseResult?.value?.count
    } ${result.title?.toLocaleLowerCase()}`
    const showLessText = 'Toon minder'

    const showMore = pageSize !== INFINITE_PAGE_SIZE

    return (
      <>
        <Item item={result} />
        {showMoreButton && (
          <ShowMoreButton
            variant="textButton"
            iconSize={12}
            iconLeft={showMore ? <Enlarge /> : <Minimise />}
            onClick={() => {
              setPaginatedUrl(showMore ? INFINITE_PAGE_SIZE : item.pageSize)
            }}
          >
            {showMore ? showMoreText : showLessText}
          </ShowMoreButton>
        )}
      </>
    )
  }

  if (promiseResult.status === PromiseStatus.Pending) {
    return <StyledLoadingSpinner />
  }
  if (promiseResult.status === PromiseStatus.Rejected) {
    return <Message>Details konden niet geladen worden.</Message>
  }

  return null
}

const RenderDetails: React.FC<{ details: MapDetails | null } & LegacyLayout> = ({
  details,
  legacyLayout,
}) => {
  if (!details) {
    return <Message>Geen detailweergave beschikbaar.</Message>
  }
  return (
    <Wrapper legacyLayout={legacyLayout}>
      <PanoramaPreview location={details.location} radius={180} aspect={2.5} />
      <DetailSpacer />
      {details.data.notifications?.map((notification) => (
        <Fragment key={notification.value}>
          <Alert level={notification.level} dismissible={notification.canClose}>
            {notification.value}
          </Alert>
          <DetailSpacer />
        </Fragment>
      ))}
      {details.data.items.map((item, index) => (
        <ItemWrapper
          // eslint-disable-next-line react/no-array-index-key
          key={item.type + index}
          className={item.type}
          // @ts-ignore
          gridArea={item.gridArea}
        >
          <Item item={item} />
          <DetailSpacer />
        </ItemWrapper>
      ))}
    </Wrapper>
  )
}

export function getPanelTitle(result: PromiseResult<MapDetails | null>) {
  if (result.status === PromiseStatus.Fulfilled && result.value) {
    return result.value.data.subTitle
  }

  return 'Detailweergave'
}

export default DetailPanel
