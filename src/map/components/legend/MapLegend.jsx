import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from '../../../shared/components/checkbox';
import MAP_CONFIG from '../../services/map-config';

import './_map-legend.scss';

const isAuthorised = (layer, user) => (
  !layer.authScope || (user.authenticated && user.scopes.includes(layer.authScope))
);

const isInsideZoomLevel = (layer, zoomLevel) => (
  zoomLevel >= layer.minZoom && zoomLevel <= layer.maxZoom
);

class MapLegend extends React.Component {
  static constructLegendIconUrl(mapLayer, legendItem) {
    if (legendItem.iconUrl) {
      return legendItem.iconUrl;
    }

    return [
      MAP_CONFIG.OVERLAY_ROOT,
      `${mapLayer.url}?`,
      `version=${MAP_CONFIG.VERSION_NUMBER}&`,
      'service=WMS&',
      'request=GetLegendGraphic&',
      `sld_version=${MAP_CONFIG.SLD_VERSION}&`,
      `layer=${(legendItem.layers && legendItem.layers[0]) || (mapLayer.layers && mapLayer.layers[0])}&`,
      'format=image/svg%2Bxml&',
      `rule=${encodeURIComponent(legendItem.imageRule || legendItem.title)}`
    ].join('');
  }

  determineLayerVisibility(mapLayer) {
    return this.props.overlays.some((overlay) => [
      { id: mapLayer.id },
      ...mapLayer.legendItems
    ].some((legendItem) => overlay.id === legendItem.id && overlay.isVisible));
  }

  determineLegendItemVisibility(legendItem) {
    return this.props.overlays.some((overlay) =>
      (overlay.id === legendItem.id && overlay.isVisible) || !legendItem.selectable
    );
  }

  toggleLayerVisibility(mapLayer, isVisible) {
    return (mapLayer.id) ? this.props.onLayerVisibilityToggle(mapLayer.id, isVisible) :
      mapLayer.legendItems.map(
        (legendItem) => this.props.onLayerVisibilityToggle(legendItem.id, isVisible)
      );
  }

  render() {
    const {
      activeMapLayers, onLayerVisibilityToggle, user, zoomLevel, isPrint
    } = this.props;

    return (
      <div>
        <h3 className="u-sr-only">Actieve kaartlagen</h3>
        <ul className="map-legend">
          {activeMapLayers.map((mapLayer, mapLayerIndex) => {
            const layerIsVisible = this.determineLayerVisibility(mapLayer);
            return (
              <li
                className="map-legend__map-layer"
                // eslint-disable-next-line react/no-array-index-key
                key={mapLayerIndex}
              >
                <div
                  className={`
                    map-legend__category
                    map-legend__category--${mapLayer.legendItems.some((legendItem) => legendItem.selectable) ? '' : 'un'}selectable-legend
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
                  {!mapLayer.notClosable && <button
                    className="map-legend__toggle map-legend__toggle--remove"
                    onClick={() => this.props.onLayerToggle(mapLayer)}
                  />}
                </div>
                {!isAuthorised(mapLayer, user) && (
                  <div className="map-legend__notification">
                    <span>Zichtbaar na inloggen</span>
                  </div>
                )}
                {isAuthorised(mapLayer, user) && !isInsideZoomLevel(mapLayer, zoomLevel) && (
                  <div className="map-legend__notification">
                    <span>Zichtbaar bij verder {zoomLevel < mapLayer.minZoom ? 'inzoomen' : 'uitzoomen'}</span>
                  </div>
                )}
                {isAuthorised(mapLayer, user) &&
                isInsideZoomLevel(mapLayer, zoomLevel) &&
                !mapLayer.disabled && (
                  <ul className="map-legend__items">
                    {mapLayer.legendItems.map((legendItem, legendItemIndex) => {
                      const legendItemIsVisible = this.determineLegendItemVisibility(legendItem);
                      return (!legendItemIsVisible && isPrint) ? null : (
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
                          <div className={`
                            map-legend__image
                            map-legend__image--${legendItem.selectable ? 'selectable' : 'not-selectable'}
                          `}
                          >
                            <img
                              alt=""
                              src={MapLegend.constructLegendIconUrl(mapLayer, legendItem)}
                            />
                          </div>
                          <span className="map-legend__title">{legendItem.title}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

MapLegend.propTypes = {
  activeMapLayers: PropTypes.array, // eslint-disable-line
  onLayerToggle: PropTypes.func, // eslint-disable-line
  isPrint: PropTypes.bool.isRequired,
  onLayerVisibilityToggle: PropTypes.func, // eslint-disable-line
  overlays: PropTypes.array, // eslint-disable-line
  user: PropTypes.object, // eslint-disable-line
  zoomLevel: PropTypes.number.isRequired
};

export default MapLegend;
