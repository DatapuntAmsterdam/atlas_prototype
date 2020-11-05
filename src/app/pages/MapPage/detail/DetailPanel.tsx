import { MapPanelContent } from '@amsterdam/arm-core'
import { Enlarge, Minimise } from '@amsterdam/asc-assets'
import { Alert, Button, List, ListItem, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import React, { Fragment, FunctionComponent, useContext, useMemo, useState } from 'react'
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
  DetailResultItemGroupedItems,
  DetailResultItemPaginatedData,
  DetailResultItemType,
  PaginatedData as PaginatedDataType,
} from '../../../../map/types/details'
import PromiseResult from '../../../components/PromiseResult/PromiseResult'
import useParam from '../../../utils/useParam'
import PanoramaPreview, { PreviewContainer } from '../map-search/PanoramaPreview'
import MapContext from '../MapContext'
import { detailUrlParam } from '../query-params'
import DetailDefinitionList from './DetailDefinitionList'
import DetailHeading from './DetailHeading'
import DetailInfoBox, { InfoBoxProps } from './DetailInfoBox'
import DetailLinkList from './DetailLinkList'
import DetailTable from './DetailTable'
import { AuthError } from '../../../../shared/services/api/errors'
import useAuthScope from '../../../utils/useAuthScope'
import AuthenticationWrapper from '../../../components/AuthenticationWrapper/AuthenticationWrapper'
import AuthAlert from '../../../components/Alerts/AuthAlert'
import Spacer from '../../../components/Spacer/Spacer'

interface DetailPanelProps {
  detailUrl: string
}

const Message = styled(Paragraph)`
  margin: ${themeSpacing(4)} 0;
`

const ShowMoreButton = styled(Button)`
  margin-top: ${themeSpacing(1)};
`

const StyledAuthAlert = styled(AuthAlert)`
  order: -1; // Make sure the alert is always on top and not pushed down because of grid
`

const StyledImage = styled.img`
  width: 100%;
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
  margin-bottom: ${themeSpacing(7)};
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
      margin-bottom: ${themeSpacing(8)};

      ${PreviewContainer} {
        grid-area: 2 / auto / 3 / auto;

        & + ${Spacer} {
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

const DetailPanel: FunctionComponent<DetailPanelProps> = ({ detailUrl }) => {
  const [, setDetailUrl] = useParam(detailUrlParam)
  const { setDetailFeature } = useContext(MapContext)
  const { isUserAuthorized } = useAuthScope()
  const promise = useMemo(async () => {
    const detailParams = parseDetailPath(detailUrl)
    const serviceDefinition = getServiceDefinition(`${detailParams.type}/${detailParams.subType}`)

    // Todo: Redirect to 404?
    if (!serviceDefinition) {
      return Promise.resolve(null)
    }

    const userIsAuthorized = isUserAuthorized(serviceDefinition.authScopes)

    if (!userIsAuthorized && serviceDefinition.authScopeRequired) {
      const error = new AuthError(401, serviceDefinition.authExcludedInfo || '')
      return Promise.reject(error)
    }

    const data = await fetchDetailData(serviceDefinition, detailParams.id as string)
    const details = await toMapDetails(serviceDefinition, data, detailParams)

    if (details.geometry) {
      setDetailFeature({
        id: detailParams.id,
        type: 'Feature',
        geometry: details.geometry,
        properties: null,
      })
    } else {
      setDetailFeature(null)
    }

    return {
      ...details,
      showAuthAlert: !userIsAuthorized,
      authExcludedInfo: serviceDefinition.authExcludedInfo,
    }
  }, [detailUrl])

  return (
    <PromiseResult promise={promise}>
      {({ value }) => (
        <MapPanelContent
          title={value?.data.subTitle || 'Detailweergave'}
          subTitle={value?.data.title || ''}
          onClose={() => setDetailUrl(null)}
        >
          <RenderDetails details={value} />
        </MapPanelContent>
      )}
    </PromiseResult>
  )
}

interface GroupedItemsProps {
  item: DetailResultItemGroupedItems
}

const GroupedItems: FunctionComponent<GroupedItemsProps> = ({ item }) => (
  <>
    {item.entries.map((groupedItem) => (
      <Fragment key={groupedItem?.title}>
        <Item item={groupedItem} subItem />
        <Spacer />
      </Fragment>
    ))}
  </>
)

interface HeaderProps {
  subItem?: boolean
  title: string
  infoBox?: InfoBoxProps
}

const Header: FunctionComponent<HeaderProps> = ({ title, subItem, infoBox }) => (
  <HeadingWrapper>
    <DetailHeading styleAs={subItem ? 'h6' : 'h4'}>{title}</DetailHeading>
    {infoBox && <DetailInfoBox {...infoBox} />}
  </HeadingWrapper>
)

export interface ItemProps {
  item: DetailResultItem
  /**
   * Indicate if the Item to render is inside of an other component and thus the header should be lower in hierarchy
   */
  subItem?: boolean
  /**
   * In case of rendering an Item from PaginatedData component, we want to hide the header otherwise
   * it will render 2 times
   */
  hideHeader?: boolean
}

const Item: FunctionComponent<ItemProps> = ({ item, subItem, hideHeader }) => {
  const component = (() => {
    switch (item?.type) {
      case DetailResultItemType.DefinitionList:
        return <DetailDefinitionList entries={item.entries} />
      case DetailResultItemType.Table:
        return <DetailTable item={item} />
      case DetailResultItemType.LinkList:
        return <DetailLinkList item={item} />
      case DetailResultItemType.PaginatedData:
        return <PaginatedData item={item} />
      case DetailResultItemType.GroupedItems:
        return <GroupedItems item={item} />
      case DetailResultItemType.Image:
        return item.src ? (
          <StyledImage alt={item.title} src={item.src} />
        ) : (
          <Paragraph>Geen rollaag beschikbaar</Paragraph>
        )
      case DetailResultItemType.BulletList:
        return item?.entries?.length ? (
          <List variant="bullet">
            {item.entries.map((entry) => (
              <ListItem key={entry}>{entry}</ListItem>
            ))}
          </List>
        ) : (
          <Paragraph>Geen resultaat gevonden</Paragraph>
        )
      default:
        throw new Error('Unable to render map detail pane, encountered unknown item type.')
    }
  })()

  return (
    <>
      {item.title && !hideHeader && (
        <Header title={item.title} infoBox={item.infoBox} subItem={subItem} />
      )}
      <AuthenticationWrapper
        authScopes={item?.authScopes}
        excludedResults={item?.authExcludedInfo || item.title}
        authScopeRequired={item.authScopeRequired}
        specialAuthLevel={item.specialAuthLevel}
      >
        {() => component}
      </AuthenticationWrapper>
    </>
  )
}

interface PaginatedResultProps {
  result: PaginatedDataType<any>
  pageSize: number
  setPaginatedUrl: (number: number) => void
  item: DetailResultItemPaginatedData
}

// Unfortunately we cannot use "-1", as apparently wont work for some API's
const INFINITE_PAGE_SIZE = 999

const PaginatedResult: FunctionComponent<PaginatedResultProps> = ({
  result,
  pageSize,
  setPaginatedUrl,
  item,
}) => {
  const resultItem = item.toView(result.data)
  const showMoreButton = result.count > result.data?.length ?? pageSize === INFINITE_PAGE_SIZE
  const showMoreText = `Toon alle ${result.count} ${
    resultItem?.title ? resultItem.title.toLocaleLowerCase() : 'resultaten'
  }`
  const showLessText = 'Toon minder'
  const showMore = pageSize !== INFINITE_PAGE_SIZE

  return (
    <>
      <Item item={resultItem} hideHeader />
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

interface PaginatedDataProps {
  item: DetailResultItemPaginatedData
}

const PaginatedData: FunctionComponent<PaginatedDataProps> = ({ item }) => {
  const [pageSize, setPaginatedUrl] = useState(item.pageSize)
  const promise = useMemo(() => item.getData(undefined, pageSize), [pageSize])

  return (
    <PromiseResult promise={promise}>
      {(result) => {
        if (!result.value) {
          return null
        }

        return (
          <PaginatedResult
            result={result.value}
            pageSize={pageSize}
            item={item}
            setPaginatedUrl={setPaginatedUrl}
          />
        )
      }}
    </PromiseResult>
  )
}

export interface RenderDetailsProps extends LegacyLayout {
  details: (MapDetails & { showAuthAlert: boolean; authExcludedInfo?: string }) | null
}

export const RenderDetails: FunctionComponent<RenderDetailsProps> = ({ details, legacyLayout }) => {
  if (!details) {
    // Todo: redirect to 404?
    return <Message>Geen detailweergave beschikbaar.</Message>
  }
  return (
    <Wrapper legacyLayout={legacyLayout} data-testid="data-detail">
      {details.showAuthAlert && <StyledAuthAlert excludedResults={details.authExcludedInfo} />}
      {details.location && !details.data.noPanorama && (
        <PanoramaPreview location={details.location} radius={180} aspect={2.5} />
      )}
      <Spacer />
      {details.data.notifications?.map((notification) => (
        <Fragment key={notification.id}>
          <Alert level={notification.level} dismissible={notification.canClose}>
            {notification.value}
          </Alert>
          <Spacer />
        </Fragment>
      ))}
      {details.data.items.map((item) => {
        if (!item) {
          return null
        }

        return (
          <ItemWrapper key={item.title} className={item.type} gridArea={item.gridArea}>
            <Item item={item} />
            <Spacer />
          </ItemWrapper>
        )
      })}
    </Wrapper>
  )
}

export default DetailPanel
