import { ChevronDown } from '@amsterdam/asc-assets'
import { Alert, Checkbox, Icon, Label, styles, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import classNames from 'classnames'
import queryString from 'querystring'
import type { ParsedUrlQueryInput } from 'querystring'
import type { FunctionComponent } from 'react'
import { createRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import LoginLink from '../../../../components/Links/LoginLink/LoginLink'
import { useIsEmbedded } from '../../../../contexts/ui'
import SearchPlus from '../../../../../shared/assets/icons/search-plus.svg'
import MAP_CONFIG from '../services/map.config'
import { isAuthorised } from '../utils/map-layer'
import type { MapLayer } from '../services'
import type { MapPanelOverlay } from './MapPanel'

const TitleWrapper = styled.div`
  display: flex;
`

const StyledLabel = styled(Label)`
  width: 100%;
`

const CollectionLabel = styled(StyledLabel)`
  font-weight: 700;
`

const StyledCheckbox = styled(Checkbox)`
  margin-left: ${themeSpacing(-1)};
`

const NonSelectableLegendParagraph = styled.p`
  margin-bottom: ${themeSpacing(2)};
`

const StyledAlert = styled(Alert)`
  margin: ${themeSpacing(3, 0)};
  padding: ${themeSpacing(3)};

  & * {
    margin: 0 auto;
  }
`

// We cannot use a button because of IE11
const LayerButton = styled.div.attrs({
  role: 'button',
})<{ isOpen?: boolean }>`
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 12px;
  background-color: ${themeColor('tint', 'level2')};

  & > ${styles.IconStyle} {
    margin-right: 3px;
    transition: transform 0.2s ease-in-out;
    ${({ isOpen }) =>
      isOpen &&
      `
        transform: rotate(180deg);
      `}
  }
`

const constructLegendIconUrl = (mapLayer: MapLayer, legendItem: MapLayer) => {
  if (legendItem.iconUrl) {
    return legendItem.iconUrl
  }

  const legendIconUrl = mapLayer.url || legendItem.url
  const layerParam =
    (legendItem.layers && legendItem.layers[0]) || (mapLayer.layers && mapLayer.layers[0])
  return [
    MAP_CONFIG.OVERLAY_ROOT,
    `${legendIconUrl as string}?`,
    `version=${MAP_CONFIG.VERSION_NUMBER}&`,
    'service=WMS&',
    'request=GetLegendGraphic&',
    `sld_version=${MAP_CONFIG.SLD_VERSION}&`,
    `layer=${layerParam as string}&`,
    'format=image/svg%2Bxml&',
    legendItem.params
      ? `${queryString.stringify(legendItem.params as unknown as ParsedUrlQueryInput)}&` // not sure this is necessary as params is `id=1234`
      : '', // this stringify arg works?
    `rule=${encodeURIComponent(legendItem.imageRule || legendItem.title)}`,
  ].join('')
}

export interface MapLegendProps {
  activeMapLayers: MapLayer[]
  zoomLevel: number
  printMode: boolean | null // where/when is this prop passed?
  title: string
  overlays: MapPanelOverlay[]
  onAddLayers: (layers: string[]) => void
  onRemoveLayers: (layers: string[]) => void
}

const MapLegend: FunctionComponent<MapLegendProps> = ({
  activeMapLayers,
  zoomLevel,
  printMode,
  title,
  overlays,
  onRemoveLayers,
  onAddLayers,
}) => {
  const ref = createRef<HTMLDivElement>()
  const { trackEvent } = useMatomo()
  const isEmbedView = useIsEmbedded()
  const testId = title
    .split(' ')
    .map((word: string) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`)
    .join('')

  function trackLayerEnabled(mapLayer: MapLayer) {
    // Sanitize the collection title to use it as action
    const action = mapLayer.title.toLowerCase().replace(/[: ][ ]*/g, '_')

    if (!mapLayer.legendItems || mapLayer.legendItems.length === 0) {
      trackEvent({
        category: 'kaartlaag',
        action,
        name: mapLayer.title,
      })
    } else {
      mapLayer.legendItems.forEach(({ title: legendItemTitle }) =>
        trackEvent({
          category: 'kaartlaag',
          action,
          name: legendItemTitle,
        }),
      )
    }
  }

  // Todo: This need to be refactored on redux level, so MapLayers and LegendItems will get a isVisible option there.
  const mapLayers = useMemo(
    () =>
      activeMapLayers.map((mapLayer) => ({
        ...mapLayer,
        legendItems: [
          ...(mapLayer.legendItems?.map((legendItem) => ({
            ...legendItem,
            isVisible: overlays.some(
              (overlay) =>
                (overlay.id === legendItem.id && overlay.isVisible) || legendItem.notSelectable,
            ),
          })) || []),
        ],
        isVisible: overlays.some((overlay) =>
          [{ id: mapLayer.id }, ...(mapLayer.legendItems || [])].some(
            (legendItem) => overlay.id === legendItem.id && overlay.isVisible,
          ),
        ),
        isEmbedded: overlays.some((overlay) =>
          [{ id: mapLayer.id }, ...(mapLayer.legendItems || [])].some(
            (legendItem) => overlay.id === legendItem.id && isEmbedView,
          ),
        ),
      })),
    [overlays, activeMapLayers],
  )

  const [isOpen, setOpen] = useState(isEmbedView ?? false)

  const allVisible = mapLayers.every(({ isVisible }) => isVisible)
  const someVisible = mapLayers.some(({ isVisible }) => isVisible)
  const collectionIndeterminate =
    mapLayers.some(
      ({ isVisible, legendItems }) =>
        !isVisible || legendItems.some(({ isVisible: legendVisibility }) => !legendVisibility),
    ) && someVisible

  const handleLayerToggle = (checked: boolean, mapLayer: MapLayer) => {
    // Only track the event when the mapLayer gets checked
    if (checked) {
      trackLayerEnabled(mapLayer)
    }
  }

  useEffect(() => {
    if (isOpen && ref.current) {
      // Since our application can be embedded on other sites as a iFrame, we cannot use `scrollIntoView`, as this will cause the parent's document to scroll too
      const scrollWrapper = document.querySelector('.scroll-wrapper')

      if (scrollWrapper) {
        scrollWrapper.scrollTop = ref.current.offsetTop
      }
    }
  }, [ref.current, isOpen])

  // Check if some of the maplayers are opened on first render
  const hasOpenMapLayers = useMemo(
    () =>
      mapLayers.some(
        ({ isVisible, legendItems }) =>
          isVisible === true ||
          (isVisible !== false &&
            legendItems.some(({ isVisible: legendItemIsVisible }) => legendItemIsVisible === true)), // legenditems could be visible in another MapLegend
      ),
    [mapLayers],
  )

  // Open the maplegend if some of the maplayers are opened
  useEffect(() => {
    if (hasOpenMapLayers) setOpen(true)
  }, [hasOpenMapLayers])

  const addOrRemoveLayer = (checked: boolean, layers: MapLayer[], onlyInvisible = false) => {
    // @ts-ignore
    const layersToFilter = onlyInvisible ? layers.filter(({ isVisible }) => !isVisible) : layers
    const filteredMapLayers = layersToFilter
      .map((mapLayer) => {
        if (mapLayer?.legendItems?.length && mapLayer?.legendItems?.every(({ id }) => id)) {
          return mapLayer?.legendItems?.map((legendItem) => legendItem.id)
        }
        return mapLayer.id
      })
      .flat()
      .filter((id) => id)

    if (checked) {
      if (onAddLayers) {
        onAddLayers(filteredMapLayers)
      }
    } else if (onRemoveLayers) {
      onRemoveLayers(filteredMapLayers)
    }
  }

  const handleOnChangeCollection = (e: React.ChangeEvent<HTMLInputElement>) => {
    // We want to check all the layers when user clicks on an indeterminate checkbox
    if (collectionIndeterminate) {
      addOrRemoveLayer(e.currentTarget.checked, mapLayers, true)
      mapLayers
        .filter(({ isVisible }) => !isVisible)
        .forEach((mapLayer) => {
          handleLayerToggle(e.currentTarget.checked, mapLayer)
        })
      setOpen(true)
    } else {
      activeMapLayers.forEach((mapLayer) => {
        handleLayerToggle(e.currentTarget.checked, mapLayer)
      })
      setOpen(e.currentTarget.checked)
      addOrRemoveLayer(e.currentTarget.checked, activeMapLayers)
    }
  }

  return (
    <>
      {(!isEmbedView || (isEmbedView && mapLayers.some(({ isEmbedded }) => isEmbedded))) && ( // Also display the collection title when maplayer is embedded
        <LayerButton
          data-testid={`mapLegendLayerButton${testId}`}
          ref={ref}
          onClick={() => setOpen(!isOpen)}
          isOpen={isOpen}
        >
          <TitleWrapper>
            {!isEmbedView ? (
              <StyledCheckbox
                className="checkbox"
                // @ts-ignore
                name={title}
                indeterminate={collectionIndeterminate}
                checked={allVisible}
                onChange={handleOnChangeCollection}
                aria-label={title}
              />
            ) : null}
            <CollectionLabel key={title} label={title} />
          </TitleWrapper>
          <Icon size={15}>
            <ChevronDown />
          </Icon>
        </LayerButton>
      )}
      {isOpen && (
        <ul className="map-legend">
          {mapLayers &&
            mapLayers
              .filter(({ isEmbedded }) => (isEmbedView ? isEmbedded : true)) // Only include the embedded layers when in certain views
              .map((mapLayer, mapLayerIndex) => {
                const layerIsChecked = mapLayer.isVisible
                const layerIsIndeterminate =
                  mapLayer.legendItems.some(({ isVisible }) => !isVisible) && layerIsChecked

                const hasLegendItems = mapLayer.legendItems.length > 0

                return (
                  <li
                    className="map-legend__map-layer"
                    // eslint-disable-next-line react/no-array-index-key
                    key={mapLayerIndex}
                  >
                    <div
                      className={`
                    map-legend__category
                    map-legend__category--${
                      !hasLegendItems &&
                      mapLayer.legendItems.some((legendItem) => legendItem.notSelectable)
                        ? 'un'
                        : ''
                    }selectable-legend
                  `}
                    >
                      <StyledLabel
                        className="map-legend__label"
                        key={mapLayer.id}
                        htmlFor={mapLayer.id}
                        label={mapLayer.title}
                      >
                        <StyledCheckbox
                          id={mapLayer.id}
                          className="checkbox"
                          // @ts-ignore
                          variant="tertiary"
                          checked={layerIsChecked && !layerIsIndeterminate}
                          indeterminate={layerIsIndeterminate}
                          name={mapLayer.title}
                          onChange={
                            /* istanbul ignore next */
                            (e) => {
                              addOrRemoveLayer(e.currentTarget.checked, [mapLayer])
                              // Sometimes we dont want the active maplayers to be deleted from the query parameters in the url
                              if (isEmbedView || layerIsIndeterminate) {
                                return (
                                  mapLayer.legendItems.length > 0 &&
                                  mapLayer.legendItems.some(({ id }) => id !== null) &&
                                  mapLayer.legendItems.filter(({ isVisible }) =>
                                    layerIsIndeterminate ? !isVisible : true,
                                  )
                                )
                              }
                              return handleLayerToggle(e.currentTarget.checked, mapLayer)
                            }
                          }
                        />
                      </StyledLabel>
                      {isAuthorised(mapLayer) && layerIsChecked && zoomLevel < mapLayer.minZoom && (
                        <div
                          className={classNames('map-legend__visibility', {
                            'map-legend__visibility--no-legend-image': hasLegendItems,
                          })}
                          title="Kaartlaag zichtbaar bij verder inzoomen"
                        >
                          {/* @ts-ignore */}
                          <Icon size={16} color={themeColor('primary', 'main')}>
                            <SearchPlus />
                          </Icon>
                        </div>
                      )}
                      {!hasLegendItems ? (
                        <div className="map-legend__image">
                          <img
                            alt={mapLayer.title}
                            src={constructLegendIconUrl(mapLayer, mapLayer)}
                          />
                        </div>
                      ) : null}
                    </div>
                    {!isAuthorised(mapLayer) && (
                      <StyledAlert level="info">
                        <LoginLink showChevron={false}>Zichtbaar na inloggen</LoginLink>
                      </StyledAlert>
                    )}
                    {/* mapLayer.disabled is not a prop on MapLayer */}
                    {/* @ts-ignore */}
                    {isAuthorised(mapLayer) && layerIsChecked && !mapLayer.disabled && (
                      <ul className="map-legend__items">
                        {hasLegendItems
                          ? mapLayer.legendItems.map((legendItem) => {
                              const legendItemIsVisible = legendItem.isVisible
                              const LegendLabel = !legendItem.notSelectable
                                ? (StyledLabel as React.ElementType)
                                : (NonSelectableLegendParagraph as React.ElementType)
                              return !legendItemIsVisible && printMode ? null : (
                                <li className="map-legend__item" key={legendItem.id}>
                                  <LegendLabel
                                    className="map-legend__label"
                                    htmlFor={legendItem.id}
                                    label={legendItem.title}
                                  >
                                    {!legendItem.notSelectable ? (
                                      <StyledCheckbox
                                        id={legendItem.id}
                                        className="checkbox"
                                        // @ts-ignore
                                        variant="tertiary"
                                        checked={legendItemIsVisible}
                                        name={legendItem.title}
                                        onChange={
                                          /* istanbul ignore next */
                                          () => {
                                            if (!legendItemIsVisible) {
                                              if (onAddLayers) {
                                                onAddLayers([legendItem.id])
                                              }
                                            } else if (onRemoveLayers) {
                                              onRemoveLayers([legendItem.id])
                                            }
                                          }
                                        }
                                      />
                                    ) : (
                                      legendItem.title
                                    )}
                                  </LegendLabel>
                                  <div className="map-legend__image">
                                    <img
                                      alt={legendItem.title}
                                      // @ts-ignore
                                      src={constructLegendIconUrl(mapLayer, legendItem)}
                                    />
                                  </div>
                                </li>
                              )
                            })
                          : null}
                      </ul>
                    )}
                  </li>
                )
              })}
        </ul>
      )}
    </>
  )
}

export default MapLegend
