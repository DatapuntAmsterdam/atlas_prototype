import React from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import 'leaflet' // Required to define window.L before leaflet plugins are imported
import 'leaflet.markercluster'
import 'leaflet-draw'
import 'leaflet-rotatedmarker'
import { GeoJSON, Map, ScaleControl, TileLayer, ZoomControl } from 'react-leaflet'

import CustomMarker from './custom/marker/CustomMarker'
import ClusterGroup from './custom/cluster-group/ClusterGroup'
import NonTiledLayer from './custom/non-tiled-layer'
import geoJsonConfig from './services/geo-json-config.constant'
import markerConfig from './services/marker-config.constant'
import createClusterIcon from './services/cluster-icon'
import { boundsToString, getBounds, isBoundsAPoint, isValidBounds } from './services/bounds'
import LoadingIndicator from '../loading-indicator/LoadingIndicator'
import {
  dataSelectionType,
  DEFAULT_LAT,
  DEFAULT_LNG,
  detailPointType,
  geoSearchType,
  markerPointType,
  panoramaOrientationType,
  panoramaPersonType,
} from '../../ducks/map/constants'
import RdGeoJson from './custom/geo-json/RdGeoJson'
import MAP_CONFIG from '../../services/map.config'
import searchIcon from './services/search-icon'
import dataSelectionIcon from './services/data-selection-icon'
import detailIcon from './services/detail-icon'
import { panoramaOrientationIcon, panoramaPersonIcon } from './services/panorama-icon'
import locationIcon from './services/location-icon'

const isIE = false || !!window.document.documentMode
if (isIE) {
  // This solves inconsistency in the leaflet draw for IE11
  window.L.Browser.touch = false
}

const visibleToOpacity = (isVisible) => (isVisible ? 100 : 0)

const convertBounds = (map) => {
  const leafletBounds = map.getBounds()
  return {
    northEast: [leafletBounds._northEast.lat, leafletBounds._northEast.lng],
    southWest: [leafletBounds._southWest.lat, leafletBounds._southWest.lng],
  }
}

const ICONS = {
  [geoSearchType]: searchIcon,
  [dataSelectionType]: dataSelectionIcon,
  [detailPointType]: detailIcon,
  [panoramaPersonType]: panoramaPersonIcon,
  [panoramaOrientationType]: panoramaOrientationIcon,
  [markerPointType]: ({ type }) => locationIcon(type),
}

class MapLeaflet extends React.Component {
  constructor(props) {
    super(props)
    this.onZoomEnd = this.onZoomEnd.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.handleLoading = this.handleLoading.bind(this)
    this.handleLoaded = this.handleLoaded.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.onClusterGroupBounds = this.onClusterGroupBounds.bind(this)
    this.state = {
      pendingLayers: [],
      previousFitBoundsId: '',
    }

    const { getLeafletInstance } = this.props

    this.setMapElement = (element) => {
      if (element && element.leafletElement) {
        this.MapElement = element.leafletElement
        getLeafletInstance(this.MapElement)
      }
    }

    this.setActiveElement = (element) => {
      if (element) {
        this.activeElement = element.leafletElement
        this.checkIfActiveElementNeedsUpdate(this.activeElement)
      }
    }
  }

  onZoomEnd(event) {
    const { onZoomEnd } = this.props
    onZoomEnd({
      zoom: event.target.getZoom(),
      maxZoom: event.target.getMaxZoom(),
      minZoom: event.target.getMinZoom(),
      center: event.target.getCenter(),
      boundingBox: convertBounds(this.MapElement),
    })
  }

  onClick(event) {
    const { latlng, containerPoint, layerPoint } = event
    const { onClick } = this.props
    onClick({
      latlng,
      containerPoint,
      layerPoint,
    })
  }

  onDragEnd(event) {
    const { onDragEnd } = this.props
    onDragEnd({
      center: event.target.getCenter(),
      boundingBox: convertBounds(this.MapElement),
    })
  }

  onClusterGroupBounds(bounds) {
    this.fitActiveElement(bounds)
  }

  handleResize() {
    const { onResizeEnd } = this.props
    this.MapElement.invalidateSize()
    onResizeEnd({
      boundingBox: convertBounds(this.MapElement),
    })
    if (this.activeElement) {
      this.fitActiveElement(getBounds(this.activeElement))
    }
  }

  checkIfActiveElementNeedsUpdate(element) {
    const { previousFitBoundsId } = this.state
    const elementBounds = getBounds(element)
    const elementBoundsId = boundsToString(elementBounds)
    // check if the bounds are the same in that case we don't need to update
    if (elementBoundsId !== previousFitBoundsId && isValidBounds(elementBounds)) {
      this.fitActiveElement(elementBounds)
      this.zoomToActiveElement(elementBounds)
      this.setState({ previousFitBoundsId: elementBoundsId })
    }
  }

  zoomToActiveElement(bounds) {
    const { zoom } = this.props
    // if the bounds is not valid or is a point return
    if (isBoundsAPoint(bounds)) {
      return
    }
    // check wat the zoomlevel will be of the bounds and devide it with some margin
    const maxZoom = Math.round(this.MapElement.getBoundsZoom(bounds) / 1.25)
    // if the elementBounds is still bigger then the current zoom level
    if (maxZoom > zoom) {
      // zoom and pan the map to fit the bounds with a maxZoom
      this.MapElement.fitBounds(bounds, { maxZoom })
    }
  }

  fitActiveElement(bounds) {
    if (!isValidBounds(bounds)) {
      return
    }
    const { zoom } = this.props
    const mapBounds = this.MapElement.getBounds()
    const elementFits = mapBounds.contains(bounds)

    if (!elementFits) {
      const elementZoom = this.MapElement.getBoundsZoom(bounds)

      // Important: in case the API returns a location point, the map shouldn't be using this as bounding box
      if (!isBoundsAPoint(bounds) && !isBoundsAPoint(mapBounds) && elementZoom < zoom) {
        // pan and zoom to the geoJson element, only when not a point
        this.MapElement.fitBounds(bounds)
      } else {
        // only pan to the geoJson element
        this.MapElement.panInsideBounds(bounds)
      }
    }
  }

  handleLoading(layer) {
    const { _leaflet_id: leafletId } = layer

    this.setState((state) => ({
      pendingLayers: !state.pendingLayers.includes(leafletId)
        ? [...state.pendingLayers, leafletId]
        : state.pendingLayers,
    }))
  }

  handleLoaded(layer) {
    const { _leaflet_id: leafletId } = layer

    this.setState((state) => ({
      pendingLayers: state.pendingLayers.filter((layerId) => layerId !== leafletId),
    }))
  }

  render() {
    const {
      center,
      clusterMarkers,
      baseLayer,
      geoJsons,
      rdGeoJsons,
      layers,
      mapOptions,
      markers,
      marker,
      scaleControlOptions,
      zoomControlOptions,
      zoom,
      brkMarkers,
      isLoading,
      showMapLink,
      isZoomControlVisible,
    } = this.props

    const { pendingLayers } = this.state

    const tmsLayers = layers.filter((layer) => layer.type === MAP_CONFIG.MAP_LAYER_TYPES.TMS)
    const nonTmsLayers = layers.filter((layer) => layer.type !== MAP_CONFIG.MAP_LAYER_TYPES.TMS)

    const loadingHandlers = {
      onLoading: ({ sourceTarget }) => this.handleLoading(sourceTarget),
      onLoad: ({ sourceTarget }) => this.handleLoaded(sourceTarget),
    }

    return (
      <ReactResizeDetector
        handleWidth
        handleHeigh
        style={{
          bottom: '0',
          left: '0',
          position: 'absolute',
          right: '0',
          top: '0',
        }}
        onResize={this.handleResize}
      >
        <Map
          ref={this.setMapElement}
          onZoomEnd={this.onZoomEnd}
          onClick={this.onClick}
          onDragEnd={this.onDragEnd}
          onDraw={this.draw}
          center={center}
          zoom={zoom}
          onLayerRemove={({ layer }) => this.handleLoaded(layer)}
          {...mapOptions}
        >
          <TileLayer
            {...baseLayer.baseLayerOptions}
            url={baseLayer.urlTemplate}
            {...loadingHandlers}
          />
          {tmsLayers.map(({ id: key, isVisible, url, bounds }) => (
            <TileLayer
              {...{
                key,
                url,
                bounds,
              }}
              tms
              subdomains={baseLayer.baseLayerOptions.subdomains}
              minZoom={baseLayer.baseLayerOptions.minZoom}
              maxZoom={baseLayer.baseLayerOptions.maxZoom}
              zoom={zoom}
              opacity={visibleToOpacity(isVisible)}
              {...loadingHandlers}
            />
          ))}

          {nonTmsLayers.map(({ id: key, isVisible, url, params, overlayOptions }) => (
            <NonTiledLayer
              {...{
                key,
                url,
                params,
              }}
              {...overlayOptions}
              opacity={visibleToOpacity(isVisible)}
              {...loadingHandlers}
            />
          ))}
          {Boolean(clusterMarkers.length) && (
            <ClusterGroup
              markers={clusterMarkers}
              showCoverageOnHover={false}
              iconCreateFunction={createClusterIcon}
              spiderfyOnMaxZoom={false}
              animate={false}
              maxClusterRadius={50}
              chunkedLoading
              getMarkerGroupBounds={this.onClusterGroupBounds}
              ref={this.setActiveElement}
              disableClusteringAtZoom={baseLayer.baseLayerOptions.maxZoom}
            />
          )}
          {markers.map(
            (item) =>
              Boolean(item.position) && (
                <CustomMarker
                  ref={markerConfig[item.type].requestFocus && this.setActiveElement}
                  position={item.position}
                  key={item.position.toString() + item.type}
                  icon={ICONS[item.type](item.iconData)}
                  zIndexOffset={100}
                  rotationAngle={item.heading || 0}
                />
              ),
          )}
          {brkMarkers.map(
            (item) =>
              Boolean(item.position) && (
                <CustomMarker
                  ref={markerConfig[item.type].requestFocus && this.setActiveElement}
                  position={item.position}
                  key={item.position.toString() + item.type}
                  icon={ICONS[item.type](item.iconData)}
                  zIndexOffset={100}
                  rotationAngle={item.heading || 0}
                />
              ),
          )}
          {marker && (
            <CustomMarker
              position={marker.position}
              key={marker.toString()}
              icon={ICONS[marker.type](marker.iconData)}
            />
          )}
          {geoJsons.map(
            (shape) =>
              Boolean(shape.geoJson) && (
                <GeoJSON
                  data={shape.geoJson}
                  key={shape.id}
                  style={geoJsonConfig[shape.type] && geoJsonConfig[shape.type].style}
                  ref={geoJsonConfig[shape.type].requestFocus && this.setActiveElement}
                />
              ),
          )}
          {rdGeoJsons.map(
            (shape) =>
              Boolean(shape.geoJson) && (
                <RdGeoJson
                  data={shape.geoJson}
                  key={shape.id}
                  ref={rdGeoJsons.length === 1 && this.setActiveElement}
                />
              ),
          )}
          <ScaleControl {...scaleControlOptions} />
          {isZoomControlVisible && <ZoomControl {...zoomControlOptions} />}
          <LoadingIndicator
            loading={isLoading || pendingLayers.length > 0}
            showMapLink={showMapLink}
          />
        </Map>
      </ReactResizeDetector>
    )
  }
}

/* istanbul ignore next */
MapLeaflet.defaultProps = {
  baseLayer: {
    urlTemplate: 'https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png',
    baseLayerOptions: {},
  },
  center: [DEFAULT_LAT, DEFAULT_LNG],
  clusterMarkers: [],
  geoJsons: [],
  rdGeoJsons: [],
  layers: [],
  mapOptions: {},
  markers: [],
  marker: null,
  scaleControlOptions: {},
  zoomControlOptions: {},
  zoom: 11,
  isLoading: false,
  showMapLink: true,
  isZoomControlVisible: true,
  onClick: () => 'click', //
  onDragEnd: () => 'dragend',
  onResizeEnd: () => 'resizeend',
  onZoomEnd: () => 'zoomend',
}

MapLeaflet.propTypes = {
  baseLayer: PropTypes.shape({
    urlTemplate: PropTypes.string,
    baseLayerOptions: PropTypes.shape({}),
  }),
  center: PropTypes.arrayOf(PropTypes.number),
  clusterMarkers: PropTypes.arrayOf(PropTypes.shape({})),
  geoJsons: PropTypes.arrayOf(PropTypes.shape({})),
  rdGeoJsons: PropTypes.arrayOf(PropTypes.shape({})),
  getLeafletInstance: PropTypes.func.isRequired,
  brkMarkers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isZoomControlVisible: PropTypes.bool,
  mapOptions: PropTypes.shape({}),
  markers: PropTypes.arrayOf(PropTypes.shape({})),
  marker: PropTypes.shape({}),
  layers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      isVisible: PropTypes.bool.isRequired,
      overlayOptions: PropTypes.shape({}),
      transparent: PropTypes.bool,
      url: PropTypes.string.isRequired,
    }),
  ),
  onClick: PropTypes.func,
  onDragEnd: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onZoomEnd: PropTypes.func,
  scaleControlOptions: PropTypes.shape({}),
  zoomControlOptions: PropTypes.shape({}),
  zoom: PropTypes.number,
  isLoading: PropTypes.bool,
  showMapLink: PropTypes.bool,
}

export default MapLeaflet
