import React from 'react'
import PropTypes from 'prop-types'

const MapPanelHandle = ({ isMapPanelHandleVisible, onMapPanelHandleToggle, children }) => (
  <div
    className={`
    map-panel-handle
    map-panel-handle--${isMapPanelHandleVisible ? 'visible' : 'hidden'}
  `}
  >
    {onMapPanelHandleToggle && (
      <button
        type="button"
        className={`
        map-panel-handle__toggle
        map-panel-handle__toggle--${isMapPanelHandleVisible ? 'icon-collapse' : 'icon-expand'}
      `}
        onClick={onMapPanelHandleToggle}
      >
        <span className="u-sr-only">
          {isMapPanelHandleVisible ? 'Kaartlagen verbergen' : 'Kaartlagen tonen'}
        </span>
      </button>
    )}
    {isMapPanelHandleVisible && children}
  </div>
)

MapPanelHandle.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  isMapPanelHandleVisible: PropTypes.bool.isRequired,
  onMapPanelHandleToggle: PropTypes.func,
}

MapPanelHandle.defaultProps = {
  onMapPanelHandleToggle: undefined,
}

export default MapPanelHandle
