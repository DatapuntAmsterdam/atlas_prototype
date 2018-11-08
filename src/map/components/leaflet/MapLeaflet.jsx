import React from 'react';
import PropTypes from 'prop-types';
import ResizeAware from 'react-resize-aware';
import { Map, TileLayer, ZoomControl, ScaleControl, GeoJSON } from 'react-leaflet';

import CustomMarker from './custom/marker/CustomMarker';
import ClusterGroup from './custom/cluster-group/ClusterGroup';
import NonTiledLayer from './custom/non-tiled-layer';
import RdGeoJson from './custom/geo-json';
import icons from './services/icons.constant';
import geoJsonConfig from './services/geo-json-config.constant';
import markerConfig from './services/marker-config.constant';
import createClusterIcon from './services/cluster-icon';
import { boundsToString, getBounds, isValidBounds, isBoundsAPoint } from './services/bounds';
import MapBusyIndicator from './custom/map-busy-indicator/MapBusyIndicator';


const visibleToOpacity = ((isVisible) => (isVisible ? 100 : 0));

const convertBounds = (map) => {
  const leafletBounds = map.getBounds();
  return ({
    northEast: {
      latitude: leafletBounds._northEast.lat,
      longitude: leafletBounds._northEast.lng
    },
    southWest: {
      latitude: leafletBounds._southWest.lat,
      longitude: leafletBounds._southWest.lng
    }
  });
};
class MapLeaflet extends React.Component {
  constructor() {
    super();
    this.onZoomEnd = this.onZoomEnd.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onMoveEnd = this.onMoveEnd.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.onClusterGroupBounds = this.onClusterGroupBounds.bind(this);
    this.state = {
      previousFitBoundsId: ''
    };

    this.setMapElement = (element) => {
      if (element && element.leafletElement) {
        this.MapElement = element.leafletElement;
        this.props.getLeafletInstance(this.MapElement);
      }
    };

    this.setActiveElement = (element) => {
      if (element) {
        this.activeElement = element.leafletElement;
        this.checkIfActiveElementNeedsUpdate(this.activeElement);
      }
    };
  }

  onZoomEnd(event) {
    this.props.onZoomEnd({
      zoom: event.target.getZoom(),
      maxZoom: event.target.getMaxZoom(),
      minZoom: event.target.getMinZoom(),
      center: event.target.getCenter(),
      boundingBox: convertBounds(this.MapElement)
    });
  }

  onClick(event) {
    const { latlng, containerPoint, layerPoint } = event;
    this.props.onClick({
      latlng,
      containerPoint,
      layerPoint
    });
  }

  onMoveEnd(event) {
    this.props.onMoveEnd({
      center: event.target.getCenter(),
      boundingBox: convertBounds(this.MapElement)
    });
  }

  onDragEnd(event) {
    this.props.onDragEnd({
      center: event.target.getCenter(),
      boundingBox: convertBounds(this.MapElement)
    });
  }

  onClusterGroupBounds(bounds) {
    this.fitActiveElement(bounds);
  }

  handleResize() {
    this.MapElement.invalidateSize();
    this.props.onResizeEnd({
      boundingBox: convertBounds(this.MapElement)
    });
    if (this.activeElement) {
      this.fitActiveElement(getBounds(this.activeElement));
    }
  }

  checkIfActiveElementNeedsUpdate(element) {
    const elementBounds = getBounds(element);
    const elementBoundsId = boundsToString(elementBounds);
    // check if the bounds are the same in that case we don't need to update
    if (elementBoundsId !== this.state.previousFitBoundsId && isValidBounds(elementBounds)) {
      this.fitActiveElement(elementBounds);
      this.zoomToActiveElement(elementBounds);
      this.setState({ previousFitBoundsId: elementBoundsId });
    }
  }

  zoomToActiveElement(bounds) {
    const { zoom } = this.props;
    // if the bounds is not valid or is a point return
    if (isBoundsAPoint(bounds)) {
      return;
    }
    // check wat the zoomlevel will be of the bounds and devide it with some margin
    const maxZoom = Math.round(this.MapElement.getBoundsZoom(bounds) / 1.25);
    // if the elementBounds is still bigger then the current zoom level
    if (maxZoom > zoom) {
      // zoom and pan the map to fit the bounds with a maxZoom
      this.MapElement.fitBounds(bounds, { maxZoom });
    }
  }

  fitActiveElement(bounds) {
    if (!isValidBounds(bounds)) {
      return;
    }
    const { zoom } = this.props;
    const mapBounds = this.MapElement.getBounds();
    const elementFits = mapBounds.contains(bounds);
    if (!elementFits) {
      const elementZoom = this.MapElement.getBoundsZoom(bounds);
      if (elementZoom < zoom) {
        // pan and zoom to the geoJson element
        this.MapElement.fitBounds(bounds);
      } else {
        // only pan to the geoJson element
        this.MapElement.panInsideBounds(bounds);
      }
    }
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
      scaleControlOptions,
      zoom,
      loading
    } = this.props;
    return (
      <ResizeAware
        style={{
          bottom: '0',
          left: '0',
          position: 'absolute',
          right: '0',
          top: '0'
        }}
        onlyEvent
        onResize={this.handleResize}
      >
        <Map
          ref={this.setMapElement}
          onZoomEnd={this.onZoomEnd}
          onClick={this.onClick}
          onMoveEnd={this.onMoveEnd}
          onDragEnd={this.onDragEnd}
          onDraw={this.draw}
          center={center}
          zoom={zoom}
          {...mapOptions}
        >
          <TileLayer
            {...baseLayer.baseLayerOptions}
            url={baseLayer.urlTemplate}
          />
          {
            layers.map((layer) => (
              <NonTiledLayer
                key={layer.id}
                {...layer.overlayOptions}
                url={layer.url}
                opacity={visibleToOpacity(layer.isVisible)}
              />
            ))
          }
          {
            Boolean(clusterMarkers.length) && (
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
            )
          }
          {
            markers.map((marker) => Boolean(marker.position) && (
              <CustomMarker
                ref={markerConfig[marker.type].requestFocus && this.setActiveElement}
                position={marker.position}
                key={marker.position.toString() + marker.type}
                icon={icons[marker.type](marker.iconData)}
                zIndexOffset={100}
                rotationAngle={marker.heading || 0}
              />
            ))
          }
          {
            geoJsons.map((shape) => Boolean(shape.geoJson) && (
              <GeoJSON
                data={shape.geoJson}
                key={shape.id}
                style={geoJsonConfig[shape.type] && geoJsonConfig[shape.type].style}
                ref={geoJsonConfig[shape.type].requestFocus && this.setActiveElement}
              />
            ))
          }
          {
            rdGeoJsons.map((shape) =>
              (Boolean(shape.geoJson) && Boolean(shape.geoJson.label)) && (
                <RdGeoJson
                  data={shape.geoJson}
                  key={shape.id}
                  ref={rdGeoJsons.length === 1 && this.setActiveElement}
                />
              )
            )
          }
          <ScaleControl {...scaleControlOptions} />
          {
            this.props.isZoomControlVisible && (
              <ZoomControl position="bottomright" />
            )
          }
          <MapBusyIndicator loading={loading} />
        </Map>
      </ResizeAware>
    );
  }
}

/* istanbul ignore next */
MapLeaflet.defaultProps = {
  baseLayer: {
    urlTemplate: 'https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png',
    baseLayerOptions: {}
  },
  center: [52.3731081, 4.8932945],
  clusterMarkers: [],
  geoJsons: [],
  rdGeoJsons: [],
  layers: [],
  mapOptions: {},
  markers: [],
  scaleControlOptions: {},
  zoom: 11,
  loading: false,
  isZoomControlVisible: true,
  onClick: () => 'click',  //
  onMoveEnd: () => 'moveend',
  onDragEnd: () => 'dragend',
  onResizeEnd: () => 'resizeend',
  onZoomEnd: () => 'zoomend'
};

MapLeaflet.propTypes = {
  baseLayer: PropTypes.shape({
    urlTemplate: PropTypes.string,
    baseLayerOptions: PropTypes.shape({})
  }),
  center: PropTypes.arrayOf(PropTypes.number),
  clusterMarkers: PropTypes.arrayOf(PropTypes.shape({})),
  geoJsons: PropTypes.arrayOf(PropTypes.shape({})),
  rdGeoJsons: PropTypes.arrayOf(PropTypes.shape({})),
  getLeafletInstance: PropTypes.func.isRequired,
  isZoomControlVisible: PropTypes.bool,
  mapOptions: PropTypes.shape({}),
  markers: PropTypes.arrayOf(PropTypes.shape({})),
  layers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    overlayOptions: PropTypes.shape({}),
    transparent: PropTypes.bool,
    url: PropTypes.string.isRequired
  })),
  onClick: PropTypes.func,
  // onDoubleClick: PropTypes.func,
  onMoveEnd: PropTypes.func,
  onDragEnd: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onZoomEnd: PropTypes.func,
  scaleControlOptions: PropTypes.shape({}),
  zoom: PropTypes.number,
  loading: PropTypes.bool
};

export default MapLeaflet;
