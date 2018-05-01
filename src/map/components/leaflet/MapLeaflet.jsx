import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, ZoomControl, ScaleControl, Marker } from 'react-leaflet';

import NonTiledLayer from './custom/non-tiled-layer';
import RdGeoJson from './custom/geo-json';
import searchIcon from './services/search-icon';

const visibleToOpacity = ((isVisible) => (isVisible ? 100 : 0));

class MapLeaflet extends React.Component {
  constructor() {
    super();
    this.onZoomEnd = this.onZoomEnd.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onMoveEnd = this.onMoveEnd.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.setMapElement = (element) => {
      this.MapElement = element;
    };

    this.setGeoJsonElement = (element) => {
      if (element) {
        this.geoJsonElement = element;
        this.fitGeoJson();
      }
    };
  }

  onZoomEnd(event) {
    this.props.onZoomEnd({
      zoom: event.target.getZoom(),
      maxZoom: event.target.getMaxZoom(),
      minZoom: event.target.getMinZoom(),
      center: event.target.getCenter()
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
      center: event.target.getCenter()
    });
  }

  onDragEnd(event) {
    this.props.onDragEnd({
      center: event.target.getCenter()
    });
  }

  fitGeoJson() {
    if (!this.geoJsonElement) {
      return;
    }
    const elementBounds = this.geoJsonElement.leafletElement.getBounds();
    const mapBounds = this.MapElement.leafletElement.getBounds();
    const elementFits = mapBounds.contains(elementBounds);
    if (!elementFits) {
      const elementZoom = this.MapElement.leafletElement.getBoundsZoom(elementBounds);
      if (elementZoom < this.props.zoom) {
        // pan and zoom to the geoJson element
        this.MapElement.leafletElement.fitBounds(elementBounds);
      } else {
        // only pan to the geoJson element
        this.MapElement.leafletElement.panInsideBounds(elementBounds);
      }
    }
  }

  invalidateSize() {
    this.MapElement.leafletElement.invalidateSize();
  }

  render() {
    const {
      baseLayer,
      center,
      geoJson,
      layers,
      mapOptions,
      markers,
      scaleControlOptions,
      zoom
    } = this.props;
    return (
      <Map
        ref={this.setMapElement}
        onZoomEnd={this.onZoomEnd}
        onClick={this.onClick}
        onMoveEnd={this.onMoveEnd}
        onDragEnd={this.onDragEnd}
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
          markers.map((marker) => (
            <Marker
              position={marker.position}
              key={marker.position}
              icon={searchIcon}
            />
          ))
        }
        {
          geoJson.geometry && (
            <RdGeoJson
              ref={this.setGeoJsonElement}
              key={geoJson.label}
              data={geoJson}
            />
          )
        }
        <ScaleControl {...scaleControlOptions} />
        {
          this.props.isZoomControlVisible && (
            <ZoomControl position="bottomright" />
          )
        }
      </Map>
    );
  }
}

MapLeaflet.defaultProps = {
  layers: [],
  markers: [],
  geoJson: {},
  center: [52.3731081, 4.8932945],
  zoom: 11,
  mapOptions: {},
  scaleControlOptions: {},
  baseLayer: {
    urlTemplate: 'https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png',
    baseLayerOptions: {}
  },
  isZoomControlVisible: true,
  onZoomEnd: () => 'zoomend',
  onClick: () => 'click',
  onDoubleClick: () => 'doubleclick',
  onMoveEnd: () => 'moveend',
  onDragEnd: () => 'dragend'
};

MapLeaflet.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    overlayOptions: PropTypes.shape({}),
    transparent: PropTypes.bool,
    url: PropTypes.string.isRequired
  })),
  geoJson: PropTypes.shape({}), //eslint-disable-line
  markers: PropTypes.array, //eslint-disable-line
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  mapOptions: PropTypes.shape({}),
  scaleControlOptions: PropTypes.shape({}),
  baseLayer: PropTypes.shape({
    urlTemplate: PropTypes.string,
    baseLayerOptions: PropTypes.shape({})
  }),
  isZoomControlVisible: PropTypes.bool,
  onZoomEnd: PropTypes.func,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMoveEnd: PropTypes.func,
  onDragEnd: PropTypes.func
};

export default MapLeaflet;
