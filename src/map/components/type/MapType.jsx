import { Heading } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { SelectButton } from '../../../shared/components/select-button'

function hasLayer(activeBaseLayer, baseLayers) {
  return (
    baseLayers &&
    baseLayers.length > 0 &&
    baseLayers.some((layer) => layer.value === activeBaseLayer)
  )
}

const MapType = ({ activeBaseLayer, baseLayers, onBaseLayerToggle }) => (
  <section className="map-type">
    <Heading forwardedAs="h4">Achtergrond</Heading>
    <SelectButton
      className="map-type__select map-type__select--topography"
      handleChange={onBaseLayerToggle}
      icon={<span className="icon icon--topography" />}
      isDisabled={!hasLayer(activeBaseLayer, baseLayers.topography)}
      name="topography"
      options={baseLayers.topography}
      value={hasLayer(activeBaseLayer, baseLayers.topography) ? activeBaseLayer : null}
    />

    <SelectButton
      className="map-type__select map-type__select--aerial"
      handleChange={onBaseLayerToggle}
      icon={<span className="icon icon--aerial" />}
      isDisabled={!hasLayer(activeBaseLayer, baseLayers.aerial)}
      name="aerial"
      options={baseLayers.aerial}
      value={hasLayer(activeBaseLayer, baseLayers.aerial) ? activeBaseLayer : null}
    />
  </section>
)

MapType.propTypes = {
  activeBaseLayer: PropTypes.string.isRequired,
  baseLayers: PropTypes.object, // eslint-disable-line
  onBaseLayerToggle: PropTypes.func.isRequired,
}

export default MapType
