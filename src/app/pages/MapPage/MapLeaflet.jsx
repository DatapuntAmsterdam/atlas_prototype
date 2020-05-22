import React from 'react'
import ReactResizeDetector from 'react-resize-detector'
import 'leaflet' // Required to define window.L before leaflet plugins are imported
import 'leaflet.markercluster'
import 'leaflet-rotatedmarker'
import 'leaflet.nontiledlayer'
import styled from 'styled-components'
import { TileLayer, GeoJSON } from '@datapunt/react-maps'
import { components } from '@datapunt/amsterdam-react-maps'
import { ViewerContainer } from '@datapunt/asc-ui'

// import CustomMarker from '../../../map/components/leaflet/custom/marker/CustomMarker'
// import ClusterGroup from '../../../map/components/leaflet/custom/cluster-group/ClusterGroup'
// import NonTiledLayer from '../../../map/components/leaflet/custom/non-tiled-layer'
// import geoJsonConfig from '../../../map/components/leaflet/services/geo-json-config.constant'
// import markerConfig from '../../../map/components/leaflet/services/marker-config.constant'
// import createClusterIcon from '../../../map/components/leaflet/services/cluster-icon'
import {
  boundsToString,
  getBounds,
  isBoundsAPoint,
  isValidBounds,
} from '../../../map/components/leaflet/services/bounds'

import LoadingIndicator from '../../../map/components/loading-indicator/LoadingIndicator'
import {
  dataSelectionType,
  DEFAULT_LAT,
  DEFAULT_LNG,
  detailPointType,
  geoSearchType,
  markerPointType,
  panoramaOrientationType,
  panoramaPersonType,
} from '../../../map/ducks/map/constants'
import RdGeoJson from '../../../map/components/leaflet/custom/geo-json/RdGeoJson'
import MAP_CONFIG from '../../../map/services/map.config'
import searchIcon from '../../../map/components/leaflet/services/search-icon'
import dataSelectionIcon from '../../../map/components/leaflet/services/data-selection-icon'
import detailIcon from '../../../map/components/leaflet/services/detail-icon'
import {
  panoramaOrientationIcon,
  panoramaPersonIcon,
} from '../../../map/components/leaflet/services/panorama-icon'
import locationIcon from '../../../map/components/leaflet/services/location-icon'
import { MapContext } from './MapContainer'

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

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400;
`

const { Marker, BaseLayer, NonTiledLayer, Scale, Zoom, Map, GeoJSONLayer } = components

const StyledMap = styled(Map)`
  width: 100%;
  height: 100vh;
`

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
      if (element) {
        this.MapElement = element
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
      geoJsons,
      rdGeoJsons,
      layers,
      mapOptions,
      markers = [],
      marker,
      scaleControlOptions,
      zoomControlOptions,
      zoom,
      brkMarkers,
      isLoading,
      showMapLink,
      isZoomControlVisible,
      baseLayer,
    } = this.props
    const { pendingLayers } = this.state

    console.log('This is leaflets baselayer', baseLayer)

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
        <StyledMap
          // ref={this.setMapElement}
          // onDraw={this.draw}
          // onLayerRemove={({ layer }) => this.handleLoaded(layer)}
          setInstance={this.setMapElement}
          events={{
            zoomend: this.onZoomEnd,
            click: this.onClick,
          }}
        >
          {tmsLayers.map(({ id: key, isVisible, url, bounds }) => (
            <TileLayer
              key={key}
              args={[url]}
              events={{
                loading: () => {
                  console.log('loading................')
                },
                load: () => {
                  console.log('loading................')
                },
              }}
              options={{
                subdomains: baseLayer.baseLayerOptions.subdomains,
                minZoom: baseLayer.baseLayerOptions.minZoom,
                maxZoom: baseLayer.baseLayerOptions.maxZoom,
                opacity: visibleToOpacity(isVisible),
                tms: true,
                bounds,
              }}
            />
          ))}

          {nonTmsLayers.map(({ id: key, isVisible, url, params, overlayOptions }) => (
            <NonTiledLayer
              {...{
                url,
                key,
                params,
              }}
              options={{
                ...overlayOptions,
                opacity: visibleToOpacity(isVisible),
              }}
            />
          ))}
          {/* {Boolean(clusterMarkers.length) && ( */}
          {/*  <ClusterGroup */}
          {/*    markers={clusterMarkers} */}
          {/*    showCoverageOnHover={false} */}
          {/*    iconCreateFunction={createClusterIcon} */}
          {/*    spiderfyOnMaxZoom={false} */}
          {/*    animate={false} */}
          {/*    maxClusterRadius={50} */}
          {/*    chunkedLoading */}
          {/*    getMarkerGroupBounds={this.onClusterGroupBounds} */}
          {/*    ref={this.setActiveElement} */}
          {/*    disableClusteringAtZoom={baseLayer.baseLayerOptions.maxZoom} */}
          {/*  /> */}
          {/* )} */}
          {markers.map(
            (item) =>
              Boolean(item.position) && (
                <Marker
                  // ref={markerConfig[item.type].requestFocus && this.setActiveElement}
                  latLng={{ lat: item.position[0], lng: item.position[1] }}
                  key={item.position[0].toString() + item.type}
                  options={{
                    zIndexOffset: 100,
                    icon: ICONS[item.type](item.iconData),
                  }}
                  // rotationAngle={item.heading || 0}
                />
              ),
          )}
          {brkMarkers.map(
            (item) =>
              Boolean(item.position) && (
                <Marker
                  // ref={markerConfig[item.type].requestFocus && this.setActiveElement}
                  latLng={{ lat: item.position[0], lng: item.position[1] }}
                  key={item.position[0].toString() + item.type}
                  options={{
                    icon: ICONS[item.type](item.iconData),
                    zIndexOffset: 100,
                  }}
                  // rotationAngle={item.heading || 0}
                />
              ),
          )}
          {marker && (
            <Marker
              latLng={{ lat: marker.position[0], lng: marker.position[1] }}
              options={{
                icon: ICONS[marker.type](marker.iconData),
              }}
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
          <Scale
            options={{
              position: 'bottomright',
              metric: true,
              imperial: false,
            }}
          />

          <StyledViewerContainer bottomRight={isZoomControlVisible ? <Zoom /> : null} />
          <BaseLayer />
          <LoadingIndicator
            loading={isLoading || pendingLayers.length > 0}
            showMapLink={showMapLink}
          />
        </StyledMap>
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

export default MapLeaflet
