import { ascDefaultTheme, themeColor } from '@amsterdam/asc-ui'
import { useMapInstance } from '@amsterdam/react-maps'
import {
  DrawTool as DrawToolComponent,
  ExtendedLayer,
  PolygonType,
  PolylineType,
} from '@amsterdam/arm-draw'
import L, { LatLng, LatLngLiteral, Polygon } from 'leaflet'
import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import useParam from '../../../../utils/useParam'
import { drawToolOpenParam, PolyDrawing, polygonParam, polylineParam } from '../../query-params'
import DataSelectionContext from './DataSelectionContext'
import { routing } from '../../../../routes'
import useBuildQueryString from '../../../../utils/useBuildQueryString'

function getTotalDistance(latLngs: LatLng[]) {
  return latLngs.reduce(
    (total, latlng, i) => {
      if (i > 0) {
        const dist = latlng.distanceTo(latLngs[i - 1])
        return total + dist
      }
      return total
    },
    latLngs.length > 2 ? latLngs[0].distanceTo(latLngs[latLngs.length - 1]) : 0,
  )
}

const getLayerCoordinates = (layer: ExtendedLayer) => layer.getLatLngs().flat(2)

function getDistanceLabel(layer: ExtendedLayer) {
  const latLngs = getLayerCoordinates(layer)
  const distance = getTotalDistance(latLngs)
  const label =
    distance >= 1000
      ? `${L.GeometryUtil.formattedNumber(`${distance / 1000}`, 2)} km`
      : `${L.GeometryUtil.formattedNumber(`${distance}`, 2)} m`

  if (layer instanceof Polygon) {
    return `${L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(latLngs), true, {
      m: 1,
    })}, ${label}`
  }

  return label
}

const bindDistanceAndAreaToTooltip = (layer: ExtendedLayer, toolTipText: string) => {
  layer.bindTooltip(toolTipText, { direction: 'bottom' }).openTooltip()
}

const createPolyLayer = (drawing: PolyDrawing, line = false): PolylineType | PolygonType => {
  const polygon = L[line ? 'polyline' : 'polygon'](drawing.polygon, {
    color: themeColor('support', line ? 'valid' : 'invalid')({ theme: ascDefaultTheme }),
    bubblingMouseEvents: false,
  }) as PolylineType | PolygonType

  polygon.id = drawing.id

  return polygon
}

const DrawTool: FunctionComponent = () => {
  const {
    fetchData,
    fetchMapVisualization,
    mapVisualizations: mapVisualization,
    removeDataSelection,
  } = useContext(DataSelectionContext)
  const { buildQueryString } = useBuildQueryString()

  const [polygon, setPolygon] = useParam(polygonParam)
  const [polyline, setPolyline] = useParam(polylineParam)
  const [drawtoolOpen] = useParam(drawToolOpenParam)
  const history = useHistory()

  const [initialDrawnItems, setInitialDrawnItems] = useState<ExtendedLayer[]>([])

  // We needs refs here for leaflet event handlers
  const polygonRef = useRef(polygon)
  polygonRef.current = polygon

  const polylineRef = useRef(polyline)
  polylineRef.current = polyline

  const mapInstance = useMapInstance()
  const drawnItemsGroup = useMemo(() => new L.FeatureGroup(), [])

  const getDrawingData = useCallback((layer: ExtendedLayer, distanceText: string) => {
    if (layer instanceof Polygon) {
      const latLngs = layer.getLatLngs() as LatLng[][]

      Promise.all([
        fetchMapVisualization(latLngs, layer.id),
        fetchData(
          latLngs,
          layer.id,
          {
            size: 20,
            page: 1,
          },
          {
            layer,
            distanceText,
          },
        ),
      ])
        .then(() => {})
        .catch((error: string) => {
          // eslint-disable-next-line no-console
          console.error(`DrawTool: could not retrieve dataSelection with markers: ${error}`)
        })
    }
  }, [])

  /**
   * Update the state / URL with the current drawings
   * @param shape
   */
  const updateShape = (shape: { polygon: PolyDrawing | null; polyline: PolyDrawing | null }) => {
    if (shape.polygon || shape.polyline) {
      setPolygon(shape.polygon)
      setPolyline(shape.polyline, 'replace')
    } else {
      history.push({
        pathname: routing.dataSearchGeo_TEMP.path,
        search: buildQueryString(undefined, [polylineParam, polygonParam, drawToolOpenParam]),
      })
    }
  }

  /**
   * Add a tooltip showing the distance and fetch dataselection
   * @param layer
   */
  const attachDataToLayer = (layer: ExtendedLayer) => {
    const distanceText = getDistanceLabel(layer)
    getDrawingData(layer, distanceText)
    bindDistanceAndAreaToTooltip(layer, distanceText)
  }

  /**
   * Add a tooltip showing the distance, fetch dataselection and
   * update the URL parameters
   */
  const updateDrawings = useCallback(
    (layer: ExtendedLayer) => {
      const updatedPolygon =
        layer instanceof Polygon
          ? { id: layer.id, polygon: getLayerCoordinates(layer) }
          : polygonRef.current

      const updatedPolyline =
        layer instanceof Polygon
          ? polylineRef.current
          : { id: layer.id, polygon: getLayerCoordinates(layer) }

      updateShape({
        polygon: updatedPolygon,
        polyline: updatedPolyline,
      })
    },
    [setPolygon, setPolyline],
  )

  const onEditVertex = (e: L.DrawEvents.EditVertex) => {
    updateDrawings(e.poly as ExtendedLayer)
  }

  const onDeleteDrawing = useCallback(
    (deletedLayers: ExtendedLayer[]) => {
      const deletedLayersIds = deletedLayers.map(({ id }) => id)
      const deletedLayersBounds = deletedLayers.map((layer) => {
        const coordinates = layer.getLatLngs()

        return layer instanceof Polygon
          ? (coordinates[0] as LatLngLiteral)
          : ((coordinates as unknown) as LatLngLiteral)
      })

      // remove the markerGroups.
      if (mapVisualization && deletedLayersIds.length) {
        removeDataSelection()
      }

      if (deletedLayersBounds.length === 0) {
        return
      }

      const newPolygon =
        polygonRef.current?.id && deletedLayersIds.includes(polygonRef.current.id)
          ? null
          : polygonRef.current

      const newPolyline =
        polylineRef.current?.id && deletedLayersIds.includes(polylineRef.current.id)
          ? null
          : polylineRef.current

      updateShape({
        polygon: newPolygon,
        polyline: newPolyline,
      })
    },
    [mapVisualization, setPolygon, setPolyline],
  )

  const onClose = () => {
    removeDataSelection()
    drawnItemsGroup.clearLayers()
    history.push({
      pathname: routing.dataSearchGeo_TEMP.path,
      search: buildQueryString(undefined, [polylineParam, polygonParam, drawToolOpenParam]),
    })
  }

  useEffect(() => {
    mapInstance.on(L.Draw.Event.EDITVERTEX as any, onEditVertex as any)

    return () => {
      mapInstance.off(L.Draw.Event.EDITVERTEX as any, onEditVertex as any)
    }
  }, [])

  /**
   * This effect will handle loading drawings from initial state and
   * handle adding and removing drawings when navigating
   */
  useEffect(() => {
    const drawingsOnMap = drawnItemsGroup.getLayers().map(({ id }: any) => id)
    const layersToAdd = [polygon?.id, polyline?.id]
    const layersToRemove = drawingsOnMap.filter((id) => !layersToAdd.includes(id))

    // Delete old drawings / layers
    drawnItemsGroup.eachLayer((layer) => {
      const typedLayer = layer as ExtendedLayer
      if (layersToRemove.includes(typedLayer.id) && typedLayer instanceof Polygon) {
        removeDataSelection()
      }
      drawnItemsGroup.removeLayer(typedLayer)
    })

    // Add layers if they don't exist on the map
    const drawnItems: Array<PolylineType | PolygonType> = []
    if (polygon) {
      drawnItems.push(createPolyLayer(polygon))
    }
    if (polyline) {
      drawnItems.push(createPolyLayer(polyline, true))
    }
    if (drawnItems.length) {
      setInitialDrawnItems(drawnItems)
    }
  }, [polygon, polyline, drawtoolOpen])

  return (
    <DrawToolComponent
      data-testid="drawTool"
      onDrawEnd={updateDrawings}
      onEndInitialItems={attachDataToLayer}
      onDelete={onDeleteDrawing}
      onClose={onClose}
      drawnItems={initialDrawnItems}
      drawnItemsGroup={drawnItemsGroup}
    />
  )
}

export default DrawTool
