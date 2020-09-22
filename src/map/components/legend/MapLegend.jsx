import { ChevronDown } from '@amsterdam/asc-assets'
import {
  Checkbox,
  Icon,
  Label,
  Paragraph,
  styles,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import classNames from 'classnames'
import queryString from 'querystring'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import LoginLink from '../../../app/components/Links/LoginLink/LoginLink'
import { ReactComponent as SearchPlus } from '../../../shared/assets/icons/search-plus.svg'
import { isPrintOrEmbedMode } from '../../../shared/ducks/ui/ui'
import MAP_CONFIG from '../../services/map.config'
import { isAuthorised } from '../../utils/map-layer'

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

const NonSelectableLegendParagraph = styled(Paragraph)`
  margin-bottom: ${themeSpacing(2)};
`

// We cannot use a button because of IE11
const LayerButton = styled.div.attrs({
  role: 'button',
})`
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
      css`
        transform: rotate(180deg);
      `}
  }
`

const constructLegendIconUrl = (mapLayer, legendItem) => {
  if (legendItem.iconUrl) {
    return legendItem.iconUrl
  }

  return [
    MAP_CONFIG.OVERLAY_ROOT,
    `${mapLayer.url || legendItem.url}?`,
    `version=${MAP_CONFIG.VERSION_NUMBER}&`,
    'service=WMS&',
    'request=GetLegendGraphic&',
    `sld_version=${MAP_CONFIG.SLD_VERSION}&`,
    `layer=${
      (legendItem.layers && legendItem.layers[0]) || (mapLayer.layers && mapLayer.layers[0])
    }&`,
    'format=image/svg%2Bxml&',
    legendItem.params ? `${queryString.stringify(legendItem.params)}&` : '',
    `rule=${encodeURIComponent(legendItem.imageRule || legendItem.title)}`,
  ].join('')
}

const MapLegend = ({
  activeMapLayers,
  onLayerVisibilityToggle,
  user,
  zoomLevel,
  printMode,
  onLayerToggle,
  title,
  overlays,
  onRemoveLayers,
  onAddLayers,
}) => {
  const ref = React.createRef()
  const { trackEvent } = useMatomo()
  const isPrintOrEmbedView = useSelector(isPrintOrEmbedMode)

  function trackLayerEnabled(mapLayer) {
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
            (legendItem) => overlay.id === legendItem.id && isPrintOrEmbedView,
          ),
        ),
      })),
    [overlays, activeMapLayers],
  )

  const [isOpen, setOpen] = useState(isPrintOrEmbedView ?? false)

  const allVisible = mapLayers.every(({ isVisible }) => isVisible)
  const someVisible = mapLayers.some(({ isVisible }) => isVisible)
  const collectionIndeterminate =
    mapLayers.some(
      ({ isVisible, legendItems }) =>
        !isVisible || legendItems.some(({ isVisible: legendVisibility }) => !legendVisibility),
    ) && someVisible

  const handleLayerToggle = (checked, mapLayer) => {
    onLayerToggle(mapLayer)

    // Only track the event when the mapLayer gets checked
    if (checked) {
      trackLayerEnabled(mapLayer)
    }
  }

  useEffect(() => {
    if (isOpen && ref.current) {
      // Since our application can be embedded on other sites as a iFrame, we cannot use `scrollIntoView`, as this will cause the parent's document to scroll too
      document.querySelector('.scroll-wrapper').scrollTop = ref.current.offsetTop
    }
  }, [ref.current, isOpen])

  // Check if some of the maplayers are opened on first render
  const hasOpenMapLayers = useMemo(
    () =>
      mapLayers.some(
        ({ isVisible, legendItems }) =>
          isVisible === true ||
          (isVisible === true &&
            legendItems.some(({ isVisible: legendItemIsVisible }) => legendItemIsVisible === true)), // legenditems could be visible in another MapLegend
      ),
    [mapLayers],
  )

  // Open the maplegend if some of the maplayers are opened
  useEffect(() => {
    if (hasOpenMapLayers) setOpen(true)
  }, [hasOpenMapLayers])

  const addOrRemoveLayer = (checked, layers, onlyInvisible = false) => {
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

  const handleOnChangeCollection = (e) => {
    // We want to check all the layers when user clicks on an indeterminate checkbox
    if (collectionIndeterminate) {
      addOrRemoveLayer(e.currentTarget.checked, mapLayers, true)
      mapLayers
        .filter(({ isVisible }) => !isVisible)
        .forEach((mapLayer) => {
          handleLayerToggle(e.currentTarget.checked, mapLayer)
        })

      mapLayers.forEach((mapLayer) => {
        // eslint-disable-next-line no-unused-expressions
        mapLayer.legendItems?.length > 0
          ? mapLayer.legendItems
              .filter(({ isVisible }) => !isVisible)
              .forEach((legendItem) => onLayerVisibilityToggle(legendItem.id, false))
          : null
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
      {(!isPrintOrEmbedView ||
        (isPrintOrEmbedView && mapLayers.some(({ isEmbedded }) => isEmbedded))) && ( // Also display the collection title when maplayer is embedded
        <LayerButton ref={ref} onClick={() => setOpen(!isOpen)} isOpen={isOpen}>
          <TitleWrapper>
            {!isPrintOrEmbedView ? (
              <StyledCheckbox
                className="checkbox"
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
              .filter(({ isEmbedded }) => (isPrintOrEmbedView ? isEmbedded : true)) // Only include the embedded layers when in certain views
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
                          variant="tertiary"
                          checked={layerIsChecked && !layerIsIndeterminate}
                          indeterminate={layerIsIndeterminate}
                          name={mapLayer.title}
                          onChange={
                            /* istanbul ignore next */
                            (e) => {
                              addOrRemoveLayer(e.currentTarget.checked, [mapLayer])
                              // Sometimes we dont want the active maplayers to be deleted from the query parameters in the url
                              if (isPrintOrEmbedView || layerIsIndeterminate) {
                                return mapLayer.legendItems.length > 0 &&
                                  mapLayer.legendItems.some(({ id }) => id !== null)
                                  ? mapLayer.legendItems
                                      .filter(({ isVisible }) =>
                                        layerIsIndeterminate ? !isVisible : true,
                                      )
                                      .forEach(({ id }) => {
                                        onLayerVisibilityToggle(
                                          id,
                                          layerIsIndeterminate ? false : !e.currentTarget.checked,
                                        )
                                      })
                                  : onLayerVisibilityToggle(mapLayer.id, !e.currentTarget.checked)
                              }
                              return handleLayerToggle(e.currentTarget.checked, mapLayer)
                            }
                          }
                        />
                      </StyledLabel>
                      {isAuthorised(mapLayer, user) &&
                        layerIsChecked &&
                        zoomLevel < mapLayer.minZoom && (
                          <div
                            className={classNames('map-legend__visibility', {
                              'map-legend__visibility--no-legend-image': hasLegendItems,
                            })}
                            title="Kaartlaag zichtbaar bij verder inzoomen"
                          >
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
                    {!isAuthorised(mapLayer, user) && (
                      <div className="map-legend__notification">
                        <span>
                          <LoginLink inList={false}>Zichtbaar na inloggen</LoginLink>
                        </span>
                      </div>
                    )}
                    {isAuthorised(mapLayer, user) && layerIsChecked && !mapLayer.disabled && (
                      <ul className="map-legend__items">
                        {hasLegendItems
                          ? mapLayer.legendItems.map((legendItem) => {
                              const legendItemIsVisible = legendItem.isVisible
                              const LegendLabel = !legendItem.notSelectable
                                ? StyledLabel
                                : NonSelectableLegendParagraph
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
                                        variant="tertiary"
                                        checked={legendItemIsVisible}
                                        name={legendItem.title}
                                        onChange={
                                          /* istanbul ignore next */
                                          () => {
                                            onLayerVisibilityToggle(
                                              legendItem.id,
                                              legendItemIsVisible,
                                            )

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
