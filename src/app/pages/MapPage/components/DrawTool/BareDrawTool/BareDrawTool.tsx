/* eslint-disable no-underscore-dangle */
import { icons, useStateRef } from '@amsterdam/arm-core'
import { ascDefaultTheme, themeColor } from '@amsterdam/asc-ui'
import { useMapInstance } from '@amsterdam/react-maps'
import {
  FeatureGroup,
  DrawMap,
  LayerEvent,
  LeafletKeyboardEvent,
  Draw,
  Edit,
  drawLocal,
  DrawEvents,
} from 'leaflet'
import 'leaflet-draw'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import DrawToolControls from './DrawToolControls'
import { ExtendedLayer, PolygonType, PolylineType } from './types'

const { drawIcon } = icons

const GlobalStyle = createGlobalStyle`
  .leaflet-interactive.leaflet-mouse-marker {
    cursor: copy;

    &.leaflet-editing-icon {
      cursor: pointer;
    }
  }
`

const { tooltip: tooltipPolygon } = drawLocal.draw.handlers.polygon
const { tooltip: tooltipPolyline } = drawLocal.draw.handlers.polyline

tooltipPolygon.start = 'Klik op de kaart om te beginnen'
tooltipPolygon.cont = 'Klik op de kaart om een punt toe te voegen'
tooltipPolygon.end =
  'Klik op de kaart om verder te gaan of eindig met dubbelklik of klik op de eerste punt om te eindigen'

tooltipPolyline.start = 'Klik op de kaart om te meten'
tooltipPolyline.cont = 'Klik op de kaart om een lijn te maken'
tooltipPolyline.end = 'Klik op de kaart om verder te gaan of klik op de laatste punt om te eindigen'

Edit.PolyVerticesEdit = Edit.PolyVerticesEdit.extend({
  options: {
    icon: drawIcon,
  },
})

export interface DrawToolProps {
  onDrawStart?: (layer: ExtendedLayer) => void
  onDrawEnd?: (layer: ExtendedLayer) => void
  onClose?: () => void
  onEndInitialItems?: (layer: ExtendedLayer) => void
  onDelete?: (layersInEditMode: Array<ExtendedLayer>) => void
  drawnItems?: Array<ExtendedLayer>
  drawnItemsGroup?: FeatureGroup
  disablePolygonButton?: boolean
  disablePolylineButton?: boolean
}

const BareDrawTool: FunctionComponent<DrawToolProps> = ({
  onDelete,
  onDrawStart,
  onDrawEnd,
  onEndInitialItems,
  drawnItems,
  drawnItemsGroup: drawnItemsGroupProp,
  onClose,
  disablePolygonButton,
  disablePolylineButton,
  ...otherProps
}) => {
  const [inEditMode, setInEditMode] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState<{
    type: 'polygon' | 'polyline'
    drawing: Draw.Polyline | Draw.Polygon
  } | null>(null)
  const [inCreateMode, setInCreateMode, inCreateModeRef] = useStateRef(false)

  const mapInstance = useMapInstance() as DrawMap

  const internalDrawnItemsGroup = useMemo(() => new FeatureGroup(), [])
  const drawnItemsGroup = drawnItemsGroupProp ?? internalDrawnItemsGroup

  const getLayersInEditMode = () => {
    const layers: ExtendedLayer[] = []

    drawnItemsGroup.eachLayer((layer) => {
      const typedLayer = layer as ExtendedLayer
      if (typedLayer.editing._enabled) {
        layers.push(typedLayer)
      }
    })

    return layers
  }

  const exitEditMode = () => {
    setCurrentDrawing((currentDraw) => {
      if (currentDraw?.drawing) {
        currentDraw.drawing.disable()
      }
      return null
    })
    setInEditMode(false)
    setInCreateMode(false)
    getLayersInEditMode().forEach((drawnLayer) => {
      if (drawnLayer.editing._enabled) {
        drawnLayer.editing.disable()
      }
    })
  }

  const createPolygon = (): null | void => {
    exitEditMode()
    const drawing = new Draw.Polygon(mapInstance, {
      shapeOptions: {
        color: themeColor('support', 'invalid')({ theme: ascDefaultTheme }),
        bubblingMouseEvents: false,
      },
      showLength: true,
      allowIntersection: false,
      showArea: true,
      metric: true,
      precision: {
        m: 1,
      },
      icon: drawIcon,
    })
    setCurrentDrawing({
      type: 'polygon',
      drawing,
    })
    if (onDrawStart) {
      // @ts-ignore
      onDrawStart(drawing)
    }
    drawing.enable()
    setInCreateMode(true)
  }

  const createPolyline = (): null | void => {
    exitEditMode()
    const drawing = new Draw.Polyline(mapInstance, {
      showLength: true,
      shapeOptions: {
        color: themeColor('support', 'valid')({ theme: ascDefaultTheme }),
        bubblingMouseEvents: false,
      },
      icon: drawIcon,
    })
    setCurrentDrawing({
      type: 'polyline',
      drawing,
    })
    drawing.enable()
    setInCreateMode(true)

    if (onDrawStart) {
      // @ts-ignore
      onDrawStart(drawing)
    }
  }

  const deleteDrawing = () => {
    const layersToDelete = getLayersInEditMode()
    layersToDelete.forEach((layer) => {
      drawnItemsGroup.removeLayer(layer)
    })
    if (onDelete) {
      onDelete(layersToDelete)
    }

    setInEditMode(false)
  }

  const handleDrawingClick = (event: LayerEvent) => {
    const target = event.target as ExtendedLayer
    const { editing } = target

    setInEditMode(true)
    editing.enable()
  }

  // End editing mode by clicking outside the map
  const handleClick = () => {
    if (!inCreateModeRef.current) {
      exitEditMode()
    }
  }

  const handleKeyDown = (e: LeafletKeyboardEvent) => {
    switch (e.originalEvent.key) {
      case 'Delete':
      case 'Backspace':
        deleteDrawing()
        break

      case 'Enter':
      case 'Escape':
        exitEditMode()
        break

      default:
    }
  }

  /**
   * Used to add layer to the draw map instance. This will do the following:
   * - Set a layer id
   * - Exit edit mode
   * - Add an event listener on the layer
   */
  const addLayerToMap = (layer: PolygonType | PolylineType) => {
    // eslint-disable-next-line no-param-reassign
    layer.id = layer.id || uuidv4()
    exitEditMode()
    drawnItemsGroup.addLayer(layer)
    layer.on('click', handleDrawingClick)
  }

  const setDrawnItem = (layer: PolygonType | PolylineType) => {
    addLayerToMap(layer)
    if (onDrawEnd) {
      onDrawEnd(layer)
    }
  }

  const onDrawCreated = (e: DrawEvents.Created) => {
    const layer = e.layer as PolygonType | PolylineType
    setDrawnItem(layer)
  }

  useEffect(() => {
    // @ts-ignore
    mapInstance.on(Draw.Event.CREATED, onDrawCreated)
    mapInstance.on('click', handleClick)
    mapInstance.on('keydown', handleKeyDown)
    mapInstance.addLayer(drawnItemsGroup)

    return () => {
      // @ts-ignore
      mapInstance.off(Draw.Event.CREATED, onDrawCreated)
      mapInstance.off('click', handleClick)
      mapInstance.off('keydown', handleKeyDown)
      if (mapInstance.hasLayer(drawnItemsGroup)) {
        mapInstance.removeLayer(drawnItemsGroup)
      }
    }
  }, [])

  useEffect(() => {
    if (drawnItems && drawnItems.length) {
      drawnItems.forEach((drawnItem) => {
        addLayerToMap(drawnItem)

        if (onEndInitialItems) {
          onEndInitialItems(drawnItem)
        }
      })
    }
  }, [drawnItems])

  return (
    <>
      <GlobalStyle />
      <DrawToolControls
        currentDrawing={currentDrawing}
        inEditMode={inEditMode}
        inDrawMode={inCreateMode}
        onRemove={deleteDrawing}
        onStartPolygon={createPolygon}
        onStartPolyline={createPolyline}
        {...otherProps}
      />
    </>
  )
}

export default BareDrawTool
