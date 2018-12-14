import React from 'react';
import PropTypes from 'prop-types';

const MapPanelHandle = (props) => (
  <div className={`
    map-panel-handle
    map-panel-handle--${props.isMapPanelHandleVisible ? 'visible' : 'hidden'}
  `}
  >
    <button
      className={`
        map-panel-handle__toggle
        map-panel-handle__toggle--${props.isMapPanelHandleVisible ? 'icon-collapse' : 'icon-expand'}
      `}
      onClick={props.onMapPanelHandleToggle}
    >
      <span className="u-sr-only">
        {props.isMapPanelHandleVisible ? 'Kaartlagen verbergen' : 'Kaartlagen tonen' }
      </span>
    </button>
    {props.isMapPanelHandleVisible && props.children}
  </div>
);

MapPanelHandle.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  isMapPanelHandleVisible: PropTypes.bool.isRequired,
  onMapPanelHandleToggle: PropTypes.func.isRequired
};

export default MapPanelHandle;
