import {
  DrawTool as DrawToolComponent,
  ExtendedLayer,
  PolygonType,
  PolylineType,
} from '@amsterdam/arm-draw'
import { ascDefaultTheme, themeColor } from '@amsterdam/asc-ui'
import { useMapInstance } from '@amsterdam/react-maps'
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
import { routing } from '../../../routes'
import useBuildQueryString from '../../../utils/useBuildQueryString'
import useParam from '../../../utils/useParam'
import MapContext from '../MapContext'
import { PolyDrawing, polygonParam, polylineParam } from '../query-params'
import DataSelectionContext from './DataSelectionContext'

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
  const { showDrawTool, setShowDrawTool } = useContext(MapContext)
  const {
    fetchData,
    fetchMapVisualization,
    mapVisualizations: mapVisualization,
    removeDataSelection,
  } = useContext(DataSelectionContext)
  const { buildQueryString } = useBuildQueryString()

  const [polygon, setPolygon] = useParam(polygonParam)
  const [polyline, setPolyline] = useParam(polylineParam)
  const history = useHistory()

  const [initialDrawnItems, setInitialDrawnItems] = useState<ExtendedLayer[]>([])

  // We needs refs here for leaflet event handlers
  const polygonRef = useRef(polygon)
  polygonRef.current = polygon

  const polylineRef = useRef(polyline)
  polylineRef.current = polyline

  const mapInstance = useMapInstance()
  const drawnItemsGroup = useMemo(() => new L.FeatureGroup(), [])

  const getDrawingData = useCallback(async (layer: ExtendedLayer, distanceText: string) => {
    if (layer instanceof Polygon) {
      const latLngs = layer.getLatLngs() as LatLng[][]

      await fetchMapVisualization(latLngs, layer.id)
      await fetchData(
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
      )
    }
  }, [])

  const updateShapes = (shape: { polygon: PolyDrawing | null; polyline: PolyDrawing | null }) => {
    const pushReplace = !polygon && shape.polygon ? 'push' : 'replace'

    // If user removes all the drawings, close the drawtool
    if (!shape.polygon && !shape.polyline) {
      setShowDrawTool(false)
    }

    if (!shape.polygon) {
      history.push({
        pathname: routing.dataSearchGeo_TEMP.path,
        search: buildQueryString(undefined, [polygonParam]),
      })
    } else {
      history[pushReplace]({
        pathname: routing.addresses_TEMP.path,
        search: buildQueryString<any>([
          [polygonParam, shape.polygon],
          [polylineParam, shape.polyline],
        ]),
      })
    }
  }

  const addOrEditShape = (layer: ExtendedLayer) => {
    const updatedPolygon =
      layer instanceof Polygon
        ? { id: layer.id, polygon: getLayerCoordinates(layer) }
        : polygonRef.current

    const updatedPolyline =
      layer instanceof Polygon
        ? polylineRef.current
        : { id: layer.id, polygon: getLayerCoordinates(layer) }

    updateShapes({
      polygon: updatedPolygon,
      polyline: updatedPolyline,
    })
  }

  /**
   * Add tooltip, update the URL param and fetch the results
   * @param e
   */
  const editShape = useCallback(
    async (e: L.DrawEvents.EditVertex) => {
      const layer = e.poly as ExtendedLayer

      const distanceText = getDistanceLabel(layer)
      bindDistanceAndAreaToTooltip(layer, distanceText)

      addOrEditShape(layer)

      await getDrawingData(layer, distanceText)
    },
    [getDrawingData],
  )

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
        removeDataSelection(deletedLayersIds)
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

      updateShapes({
        polygon: newPolygon,
        polyline: newPolyline,
      })
    },
    [mapVisualization, setPolygon, setPolyline],
  )

  const handleOnDrawEnd = useCallback(
    async (layer: ExtendedLayer) => {
      const distanceText = getDistanceLabel(layer)
      await getDrawingData(layer, distanceText)
      bindDistanceAndAreaToTooltip(layer, distanceText)

      addOrEditShape(layer)
    },
    [getDrawingData, setPolygon, setPolyline],
  )

  const fitToBounds = useCallback(() => {
    const bounds = drawnItemsGroup.getBounds()

    if (bounds.isValid()) {
      mapInstance.fitBounds(bounds)
    }
  }, [drawnItemsGroup])

  useEffect(() => {
    setInitialDrawnItems([
      ...(polygon ? [createPolyLayer(polygon)] : []),
      ...(polyline ? [createPolyLayer(polyline, true)] : []),
    ])

    fitToBounds()

    mapInstance.on(L.Draw.Event.EDITVERTEX as any, editShape as any)

    return () => {
      mapInstance.off(L.Draw.Event.EDITVERTEX as any, editShape as any)
    }
  }, [])

  return (
    <DrawToolComponent
      onDrawEnd={handleOnDrawEnd}
      onDelete={onDeleteDrawing}
      isOpen
      onClose={() => {
        setShowDrawTool(false)
        history.push({
          pathname: routing.dataSearchGeo_TEMP.path,
          search: buildQueryString(undefined, [polylineParam, polygonParam]),
        })
      }}
      drawnItems={initialDrawnItems}
      drawnItemsGroup={drawnItemsGroup}
    />
  )
}

export default DrawTool
