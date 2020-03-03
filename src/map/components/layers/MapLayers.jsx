import React from 'react'
import PropTypes from 'prop-types'
import { useMatomo } from '@datapunt/matomo-tracker-react'

const MapLayers = ({ panelLayers, activeMapLayers, onLayerToggle }) => {
  const { trackEvent } = useMatomo()

  const handleLayerToggle = (collectionTitle, layer) => {
    // Sanitize the collection title to use it as action
    const action = collectionTitle.toLowerCase().replace(/[: ][ ]*/g, '_')

    onLayerToggle(layer)
    trackEvent({
      category: 'kaartlaag',
      action,
      name: layer.title,
    })
  }

  return (
    <div className="map-layers">
      <h3 className="u-sr-only">Beschikbare kaartlagen</h3>
      <ul>
        {panelLayers.map(({ id, title, mapLayers }) => (
          <li className="map-layers__category" key={id}>
            <h4 className="map-layers__category-text">{title}</h4>
            <ul>
              {mapLayers.map(layer => (
                <li
                  className={`
                      map-layers__title
                      map-layers__title--${
                        activeMapLayers.some(mapLayer => layer.title === mapLayer.title)
                          ? 'active'
                          : 'inactive'
                      }
                    `}
                  key={layer.title}
                >
                  <button type="button" onClick={() => handleLayerToggle(title, layer)}>
                    <span className="map-layers__toggle-title">{layer.title}</span>
                    <span className="map-layers__toggle map-layers__toggle--remove" />
                    <span className="map-layers__toggle map-layers__toggle--add" />
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

MapLayers.propTypes = {
  activeMapLayers: PropTypes.array, // eslint-disable-line
  panelLayers: PropTypes.array, // eslint-disable-line
  onLayerToggle: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
}

export default MapLayers
