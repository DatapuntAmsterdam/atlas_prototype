import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'querystring'

import { Checkbox } from '../../../shared/components/checkbox'
import MAP_CONFIG from '../../services/map.config'

import './_map-legend.scss'
import LoginLinkContainer from '../../../app/components/Links/LoginLink/LoginLinkContainer'

const isAuthorised = (layer, user) =>
  !layer.authScope || (user.authenticated && user.scopes.includes(layer.authScope))

const isInsideZoomLevel = (layer, zoomLevel) =>
  zoomLevel >= layer.minZoom && zoomLevel <= layer.maxZoom

class MapLegend extends React.Component {
  static constructLegendIconUrl(mapLayer, legendItem) {
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
      `layer=${(legendItem.layers && legendItem.layers[0]) ||
        (mapLayer.layers && mapLayer.layers[0])}&`,
      'format=image/svg%2Bxml&',
      legendItem.params ? `${queryString.stringify(legendItem.params)}&` : '',
      `rule=${encodeURIComponent(legendItem.imageRule || legendItem.title)}`,
    ].join('')
  }

  determineLayerVisibility(mapLayer) {
    const { overlays } = this.props
    return overlays.some(overlay =>
      [{ id: mapLayer.id }, ...mapLayer.legendItems].some(
        legendItem => overlay.id === legendItem.id && overlay.isVisible,
      ),
    )
  }

  determineLegendItemVisibility(legendItem) {
    const { overlays } = this.props
    return overlays.some(
      overlay => (overlay.id === legendItem.id && overlay.isVisible) || !legendItem.selectable,
    )
  }

  toggleLayerVisibility(mapLayer, isVisible) {
    const { onLayerVisibilityToggle } = this.props
    return mapLayer.id
      ? onLayerVisibilityToggle(mapLayer.id, isVisible)
      : mapLayer.legendItems.map(legendItem => onLayerVisibilityToggle(legendItem.id, isVisible))
  }

  render() {
    const {
      activeMapLayers,
      onLayerVisibilityToggle,
      user,
      zoomLevel,
      printMode,
      onLayerToggle,
    } = this.props

    return (
      <div>
        <h3 className="u-sr-only">Actieve kaartlagen</h3>
        <ul className="map-legend">
          {activeMapLayers.map((mapLayer, mapLayerIndex) => {
            const layerIsVisible = this.determineLayerVisibility(mapLayer)
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
                      mapLayer.legendItems.some(legendItem => legendItem.selectable) ? '' : 'un'
                    }selectable-legend
                  `}
                >
                  <Checkbox
                    checked={layerIsVisible}
                    name={mapLayer.title}
                    onChange={
                      /* istanbul ignore next */
                      () => this.toggleLayerVisibility(mapLayer, layerIsVisible)
                    }
                  />
                  <h4 className="map-legend__category-title">{mapLayer.title}</h4>
                  {!mapLayer.notClosable && (
                    <button
                      type="button"
                      className="map-legend__toggle map-legend__toggle--remove"
                      onClick={() => onLayerToggle(mapLayer)}
                    />
                  )}
                </div>
                {!isAuthorised(mapLayer, user) && (
                  <div className="map-legend__notification">
                    <span>
                      <LoginLinkContainer linkType="blank">
                        Zichtbaar na inloggen
                      </LoginLinkContainer>
                    </span>
                  </div>
                )}
                {isAuthorised(mapLayer, user) && !isInsideZoomLevel(mapLayer, zoomLevel) && (
                  <div className="map-legend__notification">
                    <span>
                      {`Zichtbaar bij verder ${
                        zoomLevel < mapLayer.minZoom ? 'inzoomen' : 'uitzoomen'
                      }`}
                    </span>
                  </div>
                )}
                {isAuthorised(mapLayer, user) &&
                  isInsideZoomLevel(mapLayer, zoomLevel) &&
                  !mapLayer.disabled && (
                    <ul className="map-legend__items">
                      {mapLayer.legendItems.map((legendItem, legendItemIndex) => {
                        const legendItemIsVisible = this.determineLegendItemVisibility(legendItem)
                        return !legendItemIsVisible && printMode ? null : (
                          <li
                            className="map-legend__item"
                            // eslint-disable-next-line react/no-array-index-key
                            key={legendItemIndex}
                          >
                            {legendItem.selectable && (
                              <Checkbox
                                checked={legendItemIsVisible}
                                name={legendItem.title}
                                onChange={
                                  /* istanbul ignore next */
                                  () => onLayerVisibilityToggle(legendItem.id, legendItemIsVisible)
                                }
                              />
                            )}
                            <div
                              className={`
                            map-legend__image
                            map-legend__image--${
                              legendItem.selectable ? 'selectable' : 'not-selectable'
                            }
                          `}
                            >
                              <img
                                alt=""
                                src={MapLegend.constructLegendIconUrl(mapLayer, legendItem)}
                              />
                            </div>
                            <span className="map-legend__title">{legendItem.title}</span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

MapLegend.propTypes = {
  activeMapLayers: PropTypes.array, // eslint-disable-line
  onLayerToggle: PropTypes.func, // eslint-disable-line
  printMode: PropTypes.bool.isRequired,
  onLayerVisibilityToggle: PropTypes.func, // eslint-disable-line
  overlays: PropTypes.array, // eslint-disable-line
  user: PropTypes.object, // eslint-disable-line
  zoomLevel: PropTypes.number.isRequired,
}

export default MapLegend
