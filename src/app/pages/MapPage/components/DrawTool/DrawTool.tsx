import { ascDefaultTheme, themeColor } from '@amsterdam/asc-ui'
import { useMapInstance } from '@amsterdam/react-maps'
import L, { Polygon } from 'leaflet'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import type { FunctionComponent } from 'react'
import type { LatLng, LatLngBounds, LatLngLiteral } from 'leaflet'
import useParam from '../../../../utils/useParam'
import type { PolyDrawing } from '../../query-params'
import { polygonParam, polylineParam } from '../../query-params'
import type { ExtendedLayer, PolygonType, PolylineType } from './BareDrawTool'
import { BareDrawTool } from './BareDrawTool'
import { routing } from '../../../../routes'
import useBuildQueryString from '../../../../utils/useBuildQueryString'
import { useDataSelection } from '../../../../components/DataSelection/DataSelectionContext'
import useLegacyDataselectionConfig from '../../../../components/DataSelection/useLegacyDataselectionConfig'
import config from '../../config'
import useMapCenterToMarker from '../../../../utils/useMapCenterToMarker'

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
  layer
    .bindTooltip(toolTipText, { direction: 'bottom', permanent: !(layer instanceof Polygon) })
    .openTooltip()
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
  const { buildQueryString } = useBuildQueryString()

  const [polygon] = useParam(polygonParam)
  const [polyline] = useParam(polylineParam)
  const history = useHistory()
  const { activeFilters, setDistanceText, setDrawToolLocked } = useDataSelection()
  const { currentDatasetType } = useLegacyDataselectionConfig()
  const { panToWithPanelOffset } = useMapCenterToMarker()

  const [initialDrawnItems, setInitialDrawnItems] = useState<ExtendedLayer[]>([])

  // We needs refs here for leaflet event handlers
  const currentDatasetTypeRef = useRef(currentDatasetType)
  const polygonRef = useRef(polygon)
  const polylineRef = useRef(polyline)
  const activeFiltersRef = useRef(activeFilters)
  const buildQueryStringRef = useRef(buildQueryString)
  currentDatasetTypeRef.current = currentDatasetType
  polygonRef.current = polygon
  polylineRef.current = polyline
  activeFiltersRef.current = activeFilters
  buildQueryStringRef.current = buildQueryString

  const mapInstance = useMapInstance()
  const drawnItemsGroup = useMemo(() => new L.FeatureGroup(), [])

  const getDrawingData = useCallback((layer: ExtendedLayer, distanceText: string) => {
    if (layer instanceof Polygon) {
      setDistanceText(distanceText)
    }
  }, [])

  /**
   * Update the state / URL with the current drawings
   * @param shape
   * @param bounds
   */
  const updateShape = (
    shape: { polygon: PolyDrawing | null; polyline: PolyDrawing | null },
    bounds?: LatLngBounds,
  ) => {
    const pathname =
      config[currentDatasetTypeRef.current?.toUpperCase()]?.path ?? routing.addresses.path
    if (shape.polygon) {
      if (bounds) {
        panToWithPanelOffset(bounds.getCenter())
      }
      history.push({
        pathname,
        search: buildQueryStringRef.current([
          // @ts-ignore
          [polylineParam, shape.polyline],
          // @ts-ignore
          [polygonParam, shape.polygon],
        ]),
      })
    } else {
      setDistanceText(undefined)
      history.push({
        pathname,
        search: buildQueryStringRef.current([[polylineParam, shape.polyline]], [polygonParam]),
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

      setTimeout(() => {
        setDrawToolLocked(false)
      }, 100)
      updateShape(
        {
          polygon: updatedPolygon,
          polyline: updatedPolyline,
        },
        layer.getBounds(),
      )
    },
    [polygonRef, polylineRef],
  )

  const onDeleteDrawing = useCallback((deletedLayers: ExtendedLayer[]) => {
    const deletedLayersIds = deletedLayers.map(({ id }) => id)
    const deletedLayersBounds = deletedLayers.map((layer) => {
      const coordinates = layer.getLatLngs()

      return layer instanceof Polygon
        ? (coordinates[0] as LatLngLiteral)
        : (coordinates as unknown as LatLngLiteral)
    })

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
  }, [])

  const onClose = () => {
    history.push({
      pathname: routing.dataSearchGeo.path,
      search: buildQueryString(undefined, [polylineParam, polygonParam]),
    })
  }

  useEffect(() => {
    const onEditVertex = (e: L.DrawEvents.EditVertex) => {
      setDrawToolLocked(true)
      updateDrawings(e.poly as ExtendedLayer)
    }

    mapInstance.on(L.Draw.Event.EDITVERTEX as any, onEditVertex as any)

    // Clean up
    return () => {
      drawnItemsGroup.clearLayers()
      mapInstance.off(L.Draw.Event.EDITVERTEX as any, onEditVertex as any)
    }
  }, [])

  useEffect(() => {
    if (!polygon) {
      setDistanceText(undefined)
    }
  }, [polygon])

  /**
   * This effect will handle loading drawings from initial state and
   * handle adding and removing drawings when navigating
   */
  useEffect(() => {
    // Delete old drawings / layers
    drawnItemsGroup.eachLayer((layer) => {
      const typedLayer = layer as ExtendedLayer
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
  }, [polygon, polyline])

  return (
    <BareDrawTool
      data-testid="drawTool"
      onDrawEnd={updateDrawings}
      onEndInitialItems={attachDataToLayer}
      onDelete={onDeleteDrawing}
      onClose={onClose}
      onDrawStart={() => {
        setDrawToolLocked(true)
      }}
      drawnItems={initialDrawnItems}
      drawnItemsGroup={drawnItemsGroup}
    />
  )
}

export default DrawTool
