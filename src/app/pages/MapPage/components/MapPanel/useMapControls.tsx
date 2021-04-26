import { useMemo } from 'react'
import { useMapContext } from '../../MapContext'
import BaseLayerToggle from '../BaseLayerToggleControl'
import DrawToolControl from '../DrawToolControl'
import { DrawerControl } from '../DrawerOverlay/DrawerOverlay'
import LegendControl from '../LegendControl'
import ZoomControl from '../ZoomControl'
import useParam from '../../../../utils/useParam'
import { locationParam, panoHeadingParam } from '../../query-params'
import {
  PanoramaControl,
  PanoramaMenuControl,
  PanoramaViewerInfoBar,
} from '../../../../components/PanoramaViewer'

// Todo: consider moving onOpenLegend to a higher context
const useMapControls = (showDesktopVariant: boolean, onOpenLegend: () => void) => {
  const { panoFullScreen } = useMapContext()
  const [panoHeading] = useParam(panoHeadingParam)
  const [location] = useParam(locationParam)
  const panoActive = panoHeading !== null && location !== null

  return useMemo(() => {
    const panoramaControl: DrawerControl = {
      id: 'panoramaControl',
      hAlign: 'right',
      vAlign: 'top',
      node: <PanoramaControl />,
    }
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
    ]

    if (panoActive) {
      mapControls.push(panoramaControl)
      mapControls.push({
        id: 'panoramaMenu',
        hAlign: 'left',
        vAlign: 'bottom',
        node: <PanoramaMenuControl />,
      })
      mapControls.push({
        id: 'panoramaMenu',
        hAlign: 'right',
        vAlign: 'bottom',
        node: <PanoramaViewerInfoBar />,
      })
    } else {
      mapControls.push({
        id: 'drawTool',
        hAlign: 'right',
        vAlign: showDesktopVariant ? 'top' : 'bottom',
        node: <DrawToolControl />,
      })
    }

    if (showDesktopVariant) {
      mapControls.push({
        id: 'zoom',
        hAlign: 'right',
        vAlign: 'bottom',
        node: <ZoomControl />,
      })
    }
    if (panoFullScreen) {
      mapControls = [legendControl, panoramaControl]
    }
    return mapControls
  }, [showDesktopVariant, panoFullScreen, showDesktopVariant, onOpenLegend])
}

export default useMapControls
