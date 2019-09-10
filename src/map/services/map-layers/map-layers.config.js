/* eslint-disable max-len */
/**

 const mapLayers = [
 {
    (X) "id": {String} "Unique identifier for this layer, only required when other layers in group are NOT selectable",
    (X) "layers": {Array} "Layer names as defined in MapServer, only required layer has own MapServer definition",
    (X) "url": {String} "Url to MapServer",
    "params": {Object} "Object containing extra parameters that should be added to the url for MapServer",
    "external": {Boolean} "Should be set to TRUE when the url refers to an external source",
    (*) "title": {String} "Title for group in the MapPanel component",
    (*) "legendItems": [  // Used to define legenda layers that are eithers labels or specific layers with an own MapServer definition. Fields will overwrite the parent object.
      {
        (X) "id": {String} "Unique identifier for this layer, only required layer has own MapServer definition",
        (X) "layers": {Array} "Layer names as defined in MapServer, only required layer has own MapServer definition",
        (X) "url": {String} "Url to MapServer",
        "params": {Object} "Object containing extra parameters that should be added to the url for MapServer",
        "external": {Boolean} "Should be set to TRUE when the url refers to an external source",
        (*) "title": {String} "Title for layer to display, will also be used as label for MapServer",
        "imageRule": {String} "Overrides the label for MapServer",
        "detailUrl": {String} "Relative endpoint for GeoSearch",
        "detailItem": {String} "Identifier for GeoSearch",
        "detailIsShape": {Boolean} "True when GeoSearch is a GeoJSON and not a location point (Default: false)",
        "noDetail": {Boolean} "True when the GeoSearch result has no a Detail Page (Default: false)"
      }
    ],
    "disabled": {Boolean} "Hides the legenda for this layer when set to TRUE",
    "bounds": {Array} "Array of a GEO location, only use this when the bounds are predefined",
    "notClosable": {Boolean} "Hides the close button for this layer when set to TRUE",
    "minZoom": {Number} "Can be used to overwrite the default value for MIN_ZOOM in MAP_CONFIG",
    "maxZoom": {Number} "Can be used to overwrite the default value for MAX_ZOOM in MAP_CONFIG",
    "detailUrl": {String} "Relative endpoint for GeoSearch",
    "detailItem": {String} "Identifier for GeoSearch",
    "detailIsShape": {Boolean} "True when GeoSearch is a GeoJSON and not a location point (Default: false)",
    "noDetail": {Boolean} "True when the GeoSearch result has no a Detail Page (Default: false)"
    "meta": { // Describes more detailed information about a map layer
      "description": {String} "Detailed description of a map layer"
      "theme": {Number} "Theme ID matching with content type from the CMS"
      "datasetId": {Number} "Dataset ID matching the dataset catalogue"
      "date": {Date} "Date that can be used to sort the map layer"
    }
  }
 ]

 (*) Are required fields
 (X) Are required fields for either the mapLayer objects or legendaItem objects

 */

import MAP_CONFIG from '../map-config'

const mapLayers = require('../../../../public/static/map/map-layers.config.json')
const mapThemes = require('../../../../public/static/map/map-themes.config.json')
const mapBaseLayers = require('../../../../public/static/map/map-base-layers.config.json')
const mapLayerTypes = require('../../../../public/static/map/map-layer-types.config.json')

const mapPanelLayers = [
  ...mapLayers.map(
    ({
      authScope,
      category,
      disabled,
      id = false,
      layers = [],
      legendItems,
      maxZoom = MAP_CONFIG.MAX_ZOOM,
      minZoom = MAP_CONFIG.MIN_ZOOM,
      noDetail,
      title,
      url,
    }) => ({
      authScope,
      category: category ? mapThemes[category] : null,
      disabled,
      id,
      layers,
      legendItems: [
        ...legendItems.map(legendItem => ({
          ...legendItem,
          selectable: !!legendItem.id,
          noDetail: !!noDetail || !!legendItem.noDetail,
        })),
      ],
      maxZoom,
      minZoom,
      noDetail,
      title,
      url,
    }),
  ),
]

export { mapBaseLayers, mapPanelLayers, mapLayerTypes }

export default [
  ...mapLayers.map(mapLayer =>
    Object.prototype.hasOwnProperty.call(mapLayer, 'id')
      ? {
          ...mapLayer,
          ...(mapLayer.type ? { type: mapLayerTypes[mapLayer.type] } : {}),
        }
      : mapLayer.legendItems.map(legendItem =>
          Object.prototype.hasOwnProperty.call(legendItem, 'id')
            ? {
                layers: mapLayer.layers,
                url: mapLayer.url,
                detailUrl: mapLayer.detailUrl,
                detailItem: mapLayer.detailItem,
                detailIsShape: mapLayer.detailIsShape,
                minZoom: mapLayer.minZoom,
                ...(mapLayer.type ? { type: mapLayerTypes[mapLayer.type] } : {}),
                ...legendItem,
              }
            : null,
        ),
  ),
].reduce((acc, val) => acc.concat(val), []) // Alternative to .flat()
/* eslint-enable max-len */
