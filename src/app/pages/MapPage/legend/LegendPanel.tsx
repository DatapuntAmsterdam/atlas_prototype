import { Heading } from '@amsterdam/asc-ui'
import { FunctionComponent, useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import MapPanel from '../../../../map/containers/panel/MapPanel'
import { getUser } from '../../../../shared/ducks/user/user'
import useParam from '../../../utils/useParam'
import { DrawerPanelHeader, DrawerPanelProps, SmallDrawerPanel } from '../components/DrawerPanel'
import MapContext from '../MapContext'
import { legendOpenParam, mapLayersParam, zoomParam } from '../query-params'

const StyledMapPanel = styled(MapPanel)`
  max-height: 100%;
  height: 100%;
  max-width: 100%;
  width: 100%;
  box-shadow: none;
  margin: 0;
  bottom: 0;
  left: 0;

  & > .scroll-wrapper {
    height: initial;
    max-height: initial;
    overflow: visible;
  }

  & > .map-panel__heading {
    display: none;
  }
`

const LegendPanel: FunctionComponent<DrawerPanelProps> = ({ ...otherProps }) => {
  const { panelLayers } = useContext(MapContext)
  const user = useSelector(getUser)
  const [zoomLevel] = useParam(zoomParam)
  const [activeLayers, setActiveMapLayers] = useParam(mapLayersParam)
  const [, setLegendOpen] = useParam(legendOpenParam)

  const overlays = useMemo(() => activeLayers.map((layer) => ({ id: layer, isVisible: true })), [
    activeLayers,
  ])

  return (
    <SmallDrawerPanel {...otherProps}>
      <DrawerPanelHeader onClose={() => setLegendOpen(false)}>
        <Heading as="h2" styleAs="h1">
          Legenda
        </Heading>
      </DrawerPanelHeader>
      {/* @ts-ignore */}
      <StyledMapPanel
        panelLayers={panelLayers}
        overlays={overlays}
        onAddLayers={(mapLayers: string[]) => {
          if (mapLayers) {
            setActiveMapLayers([...activeLayers, ...mapLayers])
          }
        }}
        onRemoveLayers={(mapLayers: string[]) => {
          setActiveMapLayers(activeLayers.filter((layer) => !mapLayers.includes(layer)))
        }}
        isMapPanelVisible
        zoomLevel={zoomLevel}
        user={user}
      />
    </SmallDrawerPanel>
  )
}

export default LegendPanel
