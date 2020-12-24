import { MapPanelContext } from '@amsterdam/arm-core'
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
import useParam from '../../../utils/useParam'
import MapContext from '../MapContext'
import { PolyDrawing, polygonsParam, polylinesParam } from '../query-params'
import { Overlay, SnapPoint } from '../types'
import DataSelectionContext from './DataSelectionContext'
import { routing } from '../../../routes'
import useBuildQueryString from '../../../utils/useBuildQueryString'

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
  const bounds = (drawing.polygon.map(({ lat, lng }) => [lat, lng]) as unknown) as LatLng[]

  const polygon = L[line ? 'polyline' : 'polygon'](bounds, {
    color: themeColor('support', line ? 'valid' : 'invalid')({ theme: ascDefaultTheme }),
    bubblingMouseEvents: false,
  }) as PolylineType | PolygonType

  polygon.id = drawing.id

  return polygon
}

export interface DrawToolProps {
  setCurrentOverlay: (overlay: Overlay) => void
}

const DrawTool: FunctionComponent<DrawToolProps> = ({ setCurrentOverlay }) => {
  const { setPositionFromSnapPoint } = useContext(MapPanelContext)
  const { setShowDrawTool } = useContext(MapContext)
  const {
    fetchData,
    fetchMapVisualization,
    dataSelection,
    mapVisualizations: mapVisualization,
    removeDataSelection,
  } = useContext(DataSelectionContext)
  const { buildQueryString } = useBuildQueryString()

  const [polygons, setPolygons] = useParam(polygonsParam)
  const [polylines, setPolylines] = useParam(polylinesParam)
  const history = useHistory()

  const [initialDrawnItems, setInitialDrawnItems] = useState<ExtendedLayer[]>([])

  // We needs refs here for leaflet event handlers
  const polygonsRef = useRef(polygons)
  polygonsRef.current = polygons

  const polylinesRef = useRef(polylines)
  polylinesRef.current = polylines

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

  const updateShapes = (shape: { polygons?: PolyDrawing[]; polylines?: PolyDrawing[] }) => {
    window.localStorage.setItem('polygons', JSON.stringify(shape.polygons))
    window.localStorage.setItem('polylines', JSON.stringify(shape.polylines))

    const pushReplace = !polygons.length && shape.polygons?.length ? 'push' : 'replace'

    // If user removes all the drawings, close the drawtool
    if (!shape.polygons?.length && !shape.polylines?.length) {
      setShowDrawTool(false)
    }

    if (!shape.polygons?.length) {
      history.push({
        pathname: routing.dataSearchGeo_TEMP.path,
        search: buildQueryString(undefined, [polygonsParam]),
      })
    } else {
      history[pushReplace]({
        pathname: routing.addresses_TEMP.path,
        search: buildQueryString<any>([
          [polygonsParam, shape.polygons],
          [polylinesParam, shape.polylines],
        ]),
      })
    }
  }

  const addOrEditShape = (layer: ExtendedLayer) => {
    updateShapes({
      polygons:
        layer instanceof Polygon
          ? [
              ...polygonsRef.current.filter(({ id }) => id !== layer.id),
              { id: layer.id, polygon: getLayerCoordinates(layer) },
            ]
          : polygonsRef.current,
      polylines:
        layer instanceof Polygon
          ? polylinesRef.current
          : [
              ...polylinesRef.current.filter(({ id }) => id !== layer.id),
              { id: layer.id, polygon: getLayerCoordinates(layer) },
            ],
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

      const newPolygons = polygonsRef.current.filter(
        (layer) => !deletedLayersIds.includes(layer.id),
      )
      const newPolylines = polylinesRef.current.filter(
        (layer) => !deletedLayersIds.includes(layer.id),
      )

      updateShapes({
        polygons: newPolygons,
        polylines: newPolylines,
      })
    },
    [mapVisualization, setPolygons, setPolylines],
  )

  const handleOnDrawEnd = useCallback(
    async (layer: ExtendedLayer) => {
      const distanceText = getDistanceLabel(layer)
      await getDrawingData(layer, distanceText)
      bindDistanceAndAreaToTooltip(layer, distanceText)

      addOrEditShape(layer)
    },
    [getDrawingData, setPolygons, setPolylines],
  )

  const fitToBounds = useCallback(() => {
    const bounds = drawnItemsGroup.getBounds()

    if (bounds.isValid()) {
      mapInstance.fitBounds(bounds)
    }
  }, [drawnItemsGroup])

  useEffect(() => {
    const savedPolygonsRaw = window.localStorage.getItem('polygons')
    const savedPolylinesRaw = window.localStorage.getItem('polylines')
    const savedPolygons: PolyDrawing[] = savedPolygonsRaw ? JSON.parse(savedPolygonsRaw) : []
    const savedPolylines: PolyDrawing[] = savedPolylinesRaw ? JSON.parse(savedPolylinesRaw) : []

    setPolylines(savedPolylines)
    setPolygons(savedPolygons)

    setInitialDrawnItems([
      ...savedPolygons.map((drawing) => createPolyLayer(drawing)),
      ...savedPolylines.map((drawing) => createPolyLayer(drawing, true)),
    ])

    fitToBounds()

    mapInstance.on(L.Draw.Event.EDITVERTEX as any, editShape as any)

    return () => {
      mapInstance.off(L.Draw.Event.EDITVERTEX as any, editShape as any)
    }
  }, [])

  useEffect(() => {
    if (dataSelection) {
      setPositionFromSnapPoint(SnapPoint.Halfway)
    }
  }, [dataSelection])

  return (
    <DrawToolComponent
      onDrawEnd={handleOnDrawEnd}
      onDelete={onDeleteDrawing}
      isOpen
      onClose={() => {
        setShowDrawTool(false)
        history.push({
          pathname: routing.dataSearchGeo_TEMP.path,
          search: buildQueryString(undefined, [polylinesParam, polygonsParam]),
        })
      }}
      drawnItems={initialDrawnItems.length ? initialDrawnItems : []}
      onDrawStart={() => {
        setCurrentOverlay(Overlay.Results)
      }}
      drawnItemsGroup={drawnItemsGroup}
    />
  )
}

export default DrawTool
