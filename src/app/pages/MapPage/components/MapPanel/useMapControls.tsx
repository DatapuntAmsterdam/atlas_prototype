import { useContext, useMemo } from 'react'
import MapContext from '../../MapContext'
import BaseLayerToggle from '../BaseLayerToggleControl'
import { DrawerControl } from '../DrawerOverlay'
import DrawToolControl from '../DrawToolControl'
import LegendControl from '../LegendControl'
import ZoomControl from '../ZoomControl'

// Todo: consider moving onOpenLegend to a higher context
const useMapControls = (showDesktopVariant: boolean, onOpenLegend: () => void) => {
  const { panoFullScreen } = useContext(MapContext)
  return useMemo(() => {
    const legendControl: DrawerControl = {
      id: 'legend',
      hAlign: 'left',
      vAlign: showDesktopVariant ? 'top' : 'bottom',
      node: <LegendControl showDesktopVariant={showDesktopVariant} onClick={onOpenLegend} />,
    }
    let mapControls: DrawerControl[] = [
      legendControl,
      {
        id: 'baselayerToggle',
        hAlign: 'left',
        vAlign: showDesktopVariant ? 'bottom' : 'top',
        node: <BaseLayerToggle />,
      },
      {
        id: 'drawTool',
        hAlign: 'right',
        vAlign: showDesktopVariant ? 'top' : 'bottom',
        node: <DrawToolControl />,
      },
    ]
    if (showDesktopVariant) {
      mapControls.push({
        id: 'zoom',
        hAlign: 'right',
        vAlign: 'bottom',
        node: <ZoomControl />,
      })
    }
    if (panoFullScreen) {
      mapControls = [legendControl]
    }
    return mapControls
  }, [showDesktopVariant, panoFullScreen, showDesktopVariant, onOpenLegend])
}

export default useMapControls
