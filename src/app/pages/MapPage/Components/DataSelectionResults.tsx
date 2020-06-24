import React, { useContext, useState, useMemo, useCallback, useEffect } from 'react'
import {
  Accordion,
  AccordionWrapper,
  Alert,
  breakpoint,
  Button,
  CompactPager,
  hooks,
  Label,
  Link,
  Paragraph,
  Select,
  Spinner,
  svgFill,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import { Table } from '@datapunt/asc-assets'
import RouterLink from 'redux-first-router-link'
import styled, { createGlobalStyle } from 'styled-components'
import L, { LatLng } from 'leaflet'
import { mapPanelComponents, Marker } from '@datapunt/arm-core'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { useSelector } from 'react-redux'
import { Overlay } from '../types'
import DataSelectionContext from '../DataSelectionContext'
import NotificationLevel from '../../../models/notification'
import config, { AuthScope, DataSelectionType } from './config'
import { getUserScopes } from '../../../../shared/ducks/user/user'
import LoginLinkContainer from '../../../components/Links/LoginLink/LoginLinkContainer'
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage'
import { DEFAULT_LOCALE } from '../../../../shared/config/locale.config'

const { MapPanelContent } = mapPanelComponents

const ResultLink = styled(RouterLink)`
  width: 100%;
  margin-bottom: ${themeSpacing(2)};
`

const StyledMapPanelContent = styled(MapPanelContent)`
  width: 100%;
  height: 100%;
`

const StyledMarker = styled(Marker)`
  z-index: 999 !important;
`

const highlightIcon = L.icon({
  iconUrl:
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 24.1.3, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 16 16' style='enable-background:new 0 0 16 16;' xml:space='preserve'%3E%3Ccircle cx='8' cy='8' r='8'/%3E%3Ccircle style='fill:%23FFFFFF;' cx='7.9' cy='7.9' r='4'/%3E%3C/svg%3E%0A",
  iconSize: [15, 15],
  className: 'arm-highlight-icon',
})

const GlobalStyle = createGlobalStyle`
.arm-highlight-icon {
  z-index: 999 !important;
}
`

const StyledCompactPager = styled(CompactPager)`
  margin-top: ${themeSpacing(5)};
  width: 100%;
`

const AccordionContent = styled.div`
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const StyledAccordion = styled(Accordion)`
  margin-top: ${themeSpacing(2)};
  & + * {
    margin-bottom: ${themeSpacing(5)};
  }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
const StyledLabel = styled(Label)`
  display: none;
  & + * {
    margin-right: 10px;
  }
`

const TableRouterLink = styled(RouterLink)`
  flex-shrink: 0;
`

const StyledAlert = styled(Alert)`
  margin-top: ${themeSpacing(2)};
`

const StyledSelect = styled(Select)`
  @media screen and ${breakpoint('min-width', 'tabletS')} {
    min-height: 44px;
  }
`

const StyledSpinner = styled(Spinner)`
  ${svgFill(themeColor('secondary'))}
  &,
  & span,
  & svg {
    width: 30px;
    height: 30px;
  }
`

type Props = {
  currentOverlay: Overlay
}

const DataSelectionResults: React.FC<Props> = ({ currentOverlay, setShowDrawTool }) => {
  const [delayedLoadingIds, setDelayedLoadingIds] = useState<string[]>([])
  const [highlightMarker, setHighlightMarker] = useState<LatLng | null>(null)
  const {
    dataSelection,
    mapVisualization,
    fetchData,
    type,
    setType,
    forbidden,
    loadingIds,
    errorIds,
  } = useContext(DataSelectionContext)
  const userScopes = useSelector(getUserScopes)
  const { trackEvent } = useMatomo()
  const [showDesktopVariant] = hooks.useMatchMedia({ minBreakpoint: 'tabletM' })
  const memoHighlightMaker = useMemo(() => highlightMarker || [0, 0], [highlightMarker])

  // Effect to delay the loading states, this is to prevent the results block to collapse and re-open in a short time
  useEffect(() => {
    let timeOutId: number
    if (loadingIds.length) {
      timeOutId = setTimeout(() => {
        setDelayedLoadingIds(loadingIds)
      }, 400)
    } else {
      setDelayedLoadingIds([])
    }
    return () => {
      clearTimeout(timeOutId)
    }
  }, [loadingIds, setDelayedLoadingIds])

  // Populate the dataSelection with markers from the mapVisualization object.
  // By doing this, we can highlight markers on the map when hovering on the link
  const dataSelectionWithMarkers = useMemo(
    () =>
      dataSelection.map(({ result, id, ...other }) => ({
        ...other,
        id,
        result: result.map((location) => ({
          ...location,
          marker:
            type !== DataSelectionType.BRK && mapVisualization
              ? mapVisualization
                  .find(({ id: markerGroupId }) => markerGroupId === id)
                  ?.data?.find(({ id: markerId }: { id: string }) => markerId === location.id)
              : null,
        })),
      })),
    [dataSelection, mapVisualization],
  )

  const handleOnChangeType = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value as DataSelectionType
    trackEvent({
      category: 'dataselection',
      action: 'dropdown',
      name: config[selectedOption].title,
    })
    setType(selectedOption)
  }, [])

  const totalNumberOfResults = useMemo(
    () =>
      dataSelectionWithMarkers
        .reduce((acc, { totalCount }) => acc + totalCount, 0)
        .toLocaleString(DEFAULT_LOCALE),
    [dataSelectionWithMarkers],
  )

  const handleFetchData = useCallback(
    (id: string, page?: number) => {
      const selection = dataSelectionWithMarkers.find(({ id: dataId }) => id === dataId)
      if (selection) {
        ;(async () => {
          await fetchData(
            selection?.mapData?.layer?.getLatLngs() as LatLng[][],
            selection?.mapData?.layer?.id,
            {
              size: selection.size,
              page: page || selection.page,
            },
            {
              layer: selection?.mapData?.layer,
              distanceText: selection?.mapData?.distanceText,
            },
          )
        })()
      }
    },
    [dataSelection],
  )

  return (
    <StyledMapPanelContent
      title={`Resultaten${totalNumberOfResults && `: ${totalNumberOfResults}`}`}
      animate
      stackOrder={currentOverlay === Overlay.Results ? 2 : 1}
      onClose={() => {
        setShowDrawTool(false)
      }}
    >
      <GlobalStyle />
      <StyledMarker latLng={memoHighlightMaker} options={{ icon: highlightIcon }} />

      <Wrapper>
        <StyledLabel htmlFor="sort-select" label="Type:" position="left" />
        <StyledSelect
          id="sort-select"
          data-testid="sort-select"
          value={type}
          onChange={handleOnChangeType}
        >
          {Object.entries(config).map(([dataSelectionType, { title }]) => (
            <option value={dataSelectionType}>{title}</option>
          ))}
        </StyledSelect>
        {showDesktopVariant ? (
          <Button
            as={TableRouterLink}
            variant="primaryInverted"
            title="Resultaten in tabel weergeven"
            type="button"
            to={config[type].toTableAction}
            iconLeft={<Table />}
          >
            Tabel weergeven
          </Button>
        ) : (
          <Button
            as={TableRouterLink}
            type="button"
            variant="primaryInverted"
            title="Resultaten in tabel weergeven"
            size={40}
            icon={<Table />}
            iconSize={25}
            to={config[type].toTableAction}
          />
        )}
      </Wrapper>
      {forbidden ? (
        <StyledAlert level={NotificationLevel.Attention} compact dismissible>
          <Paragraph>
            {userScopes.includes(AuthScope.BRK)
              ? `Medewerkers met speciale bevoegdheden kunnen inloggen om kadastrale objecten met
            zakelijk rechthebbenden te bekijken. `
              : `Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken. `}
          </Paragraph>
          <LoginLinkContainer />
        </StyledAlert>
      ) : (
        <AccordionWrapper>
          {dataSelectionWithMarkers.map(({ id, result, size, page, totalCount, mapData }, i) => (
            <React.Fragment key={id}>
              <StyledAccordion
                {...(dataSelectionWithMarkers.length === 1
                  ? {
                      isOpen: true,
                    }
                  : {})}
                title={`Selectie ${i + 1}: ${mapData?.distanceText}`}
                onMouseEnter={() => {
                  if (mapData?.layer) {
                    mapData.layer.setStyle({
                      weight: 6,
                      fillOpacity: 0.7,
                    })
                  }
                }}
                onMouseLeave={() => {
                  if (mapData?.layer) {
                    mapData.layer.setStyle({
                      weight: 4,
                      fillOpacity: 0.4,
                    })
                  }
                }}
              >
                <AccordionContent>
                  {!delayedLoadingIds.includes(id) && !errorIds.includes(id) && (
                    <>
                      {result.map(({ id: locationId, name: locationName, marker }) => (
                        <Link
                          to={config[type].toDetailAction(locationId)}
                          as={ResultLink}
                          variant="with-chevron"
                          key={locationId}
                          onMouseEnter={() => {
                            if (marker) {
                              setHighlightMarker(marker.latLng)
                            }
                          }}
                          onMouseLeave={() => {
                            setHighlightMarker(null)
                          }}
                        >
                          {locationName}
                        </Link>
                      ))}
                      {totalCount > size && (
                        <StyledCompactPager
                          page={page}
                          pageSize={size}
                          collectionSize={totalCount}
                          onPageChange={async (pageNumber) => {
                            await handleFetchData(mapData?.layer?.id, pageNumber)
                          }}
                        />
                      )}
                    </>
                  )}
                  {delayedLoadingIds.includes(id) && !errorIds.includes(id) && <StyledSpinner />}
                  {!delayedLoadingIds.length && errorIds.includes(id) && (
                    <ErrorMessage
                      onClick={async () => {
                        await handleFetchData(mapData?.layer?.id)
                      }}
                    />
                  )}
                </AccordionContent>
                {totalCount === 0 && (
                  <StyledAlert level={NotificationLevel.Attention} compact>
                    Er zijn geen resultaten
                  </StyledAlert>
                )}
              </StyledAccordion>
            </React.Fragment>
          ))}
        </AccordionWrapper>
      )}
    </StyledMapPanelContent>
  )
}

export default DataSelectionResults
