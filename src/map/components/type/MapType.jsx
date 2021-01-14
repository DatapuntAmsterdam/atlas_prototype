import { Heading } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { SelectButton } from '../../../shared/components/select-button'
import Topography from '../../../shared/assets/icons/icon-topography.svg'
import Aerial from '../../../shared/assets/icons/icon-aerial.svg'

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
      icon={<Topography />}
      isDisabled={!hasLayer(activeBaseLayer, baseLayers.topography)}
      name="topography"
      options={baseLayers.topography}
      value={hasLayer(activeBaseLayer, baseLayers.topography) ? activeBaseLayer : null}
    />

    <SelectButton
      className="map-type__select map-type__select--aerial"
      handleChange={onBaseLayerToggle}
      icon={<Aerial />}
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
