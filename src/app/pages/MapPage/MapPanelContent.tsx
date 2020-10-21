import React, { FunctionComponent, useContext, useState } from 'react'
import useParam from '../../utils/useParam'
import DrawerOverlay, { DeviceMode, DrawerControl, DrawerState } from './components/DrawerOverlay'
import LegendControl from './components/LegendControl'
import ZoomControl from './components/ZoomControl'
import BaseLayerControl from './controls/BaseLayerControl'
import DetailPanel from './detail/DetailPanel'
import DrawResultsPanel from './draw/DrawResultsPanel'
import DrawTool from './draw/DrawTool'
import LegendPanel from './legend/LegendPanel'
import LocationSearchPanel from './location-search/LocationSearchPanel'
import MapContext from './MapContext'
import { detailUrlParam, legendOpenParam, locationParam, panoParam } from './query-params'

export interface MapPanelContentProps {
  showDesktopVariant: boolean
}

const MapPanelContent: FunctionComponent<MapPanelContentProps> = ({ showDesktopVariant }) => {
  const { showDrawContent } = useContext(MapContext)
  const [panelState, setPanelState] = useState(DrawerState.Closed)
  const [legendOpen, setLegendOpen] = useParam(legendOpenParam)
  const [detailUrl] = useParam(detailUrlParam)
  const [location] = useParam(locationParam)
  const [pano] = useParam(panoParam)
  const mode = showDesktopVariant ? DeviceMode.Desktop : DeviceMode.Mobile

  const controls: DrawerControl[] = [
    {
      id: 'legend',
      hAlign: 'left',
      vAlign: showDesktopVariant ? 'top' : 'bottom',
      node: (
        <LegendControl
          showDesktopVariant={showDesktopVariant}
          onToggle={() => {
            setLegendOpen(!legendOpen)

            if (!legendOpen) {
              setPanelState(DrawerState.Open)
            }
          }}
        />
      ),
    },
    {
      id: 'base-layer',
      hAlign: 'left',
      vAlign: showDesktopVariant ? 'bottom' : 'top',
      node: <BaseLayerControl />,
    },
  ]

  if (showDesktopVariant) {
    controls.push({
      id: 'zoom',
      hAlign: 'right',
      vAlign: 'bottom',
      node: <ZoomControl />,
    })
  }

  if (!pano) {
    controls.push({
      id: 'drawtool',
      hAlign: 'right',
      vAlign: 'top',
      node: <DrawTool />,
    })
  }

  return (
    <DrawerOverlay
      mode={mode}
      controls={controls}
      state={panelState}
      onStateChange={(state) => setPanelState(state)}
    >
      {location && <LocationSearchPanel location={location} />}
      {detailUrl && <DetailPanel detailUrl={detailUrl} />}
      {legendOpen && <LegendPanel />}
      {showDrawContent && <DrawResultsPanel />}
    </DrawerOverlay>
  )
}

export default MapPanelContent
