import { useMemo } from 'react'
import { useIsEmbedded } from '../../../../contexts/ui'
import useParam from '../../../../utils/useParam'
import { useMapContext } from '../../MapContext'
import { locationParam, mapLayersParam, panoHeadingParam } from '../../query-params'
import type { DrawerControl } from '../DrawerOverlay/DrawerOverlay'
import DrawToolControl from '../DrawToolControl'
import EmbedControl from '../EmbedControl'
import LegendControl from '../LegendControl'
import MapContextMenuControl from '../MapContextMenuControl/MapContextMenuControl'
import { PanoramaControl, PanoramaMenuControl, PanoramaViewerInfoBar } from '../PanoramaViewer'
import ZoomControl from '../ZoomControl'

const panoramaControl: DrawerControl = {
  id: 'panoramaControl',
  hAlign: 'right',
  vAlign: 'top',
  node: <PanoramaControl />,
}

const mapContextMenuControl: DrawerControl = {
  id: 'contextMenuControl',
  hAlign: 'left',
  vAlign: 'bottom',
  node: <MapContextMenuControl />,
}

const embedControl: DrawerControl = {
  id: 'embedControl',
  hAlign: 'right',
  vAlign: 'top',
  node: <EmbedControl />,
}

const panoramaMenuControl: DrawerControl = {
  id: 'panoramaMenu',
  hAlign: 'left',
  vAlign: 'bottom',
  node: <PanoramaMenuControl />,
}

const panoramaViewerInfoBarControl: DrawerControl = {
  id: 'panoramaViewerInfoBar',
  hAlign: 'right',
  vAlign: 'bottom',
  node: <PanoramaViewerInfoBar />,
}

const drawToolControl: DrawerControl = {
  id: 'drawTool',
  hAlign: 'right',
  vAlign: 'top',
  node: <DrawToolControl />,
}

const zoomControl: DrawerControl = {
  id: 'zoom',
  hAlign: 'right',
  vAlign: 'bottom',
  node: <ZoomControl />,
}

const legendControl: DrawerControl = {
  id: 'legend',
  hAlign: 'left',
  vAlign: 'top',
  node: <LegendControl showDesktopVariant />,
}

// Todo: consider moving onOpenLegend to a higher context
const useMapControls = () => {
  const { panoFullScreen } = useMapContext()
  const isEmbedded = useIsEmbedded()
  const [panoHeading] = useParam(panoHeadingParam)
  const [mapLayers] = useParam(mapLayersParam)
  const [location] = useParam(locationParam)
  const panoActive = panoHeading !== null && location !== null

  return useMemo(() => {
    if (panoFullScreen) {
      return [legendControl, panoramaControl]
    }

    const mapControls: DrawerControl[] = []

    // Hide the legend if embedded, unless some map layers are selected.
    if (!isEmbedded || mapLayers.length > 0) {
      mapControls.push(legendControl)
    }

    mapControls.push(mapContextMenuControl)

    // Show show the embed control if embedded.
    // Allows the user to navigate to the site with full interaction.
    if (isEmbedded) {
      mapControls.push(embedControl)
    }

    if (panoActive) {
      mapControls.push(panoramaControl)
      mapControls.push(panoramaMenuControl)
      mapControls.push(panoramaViewerInfoBarControl)
    } else {
      mapControls.push(drawToolControl)
    }

    mapControls.push(zoomControl)

    return mapControls
  }, [legendControl, isEmbedded, mapLayers, panoFullScreen, panoHeading])
}

export default useMapControls
