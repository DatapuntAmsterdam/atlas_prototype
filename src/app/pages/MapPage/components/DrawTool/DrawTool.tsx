import { ascDefaultTheme, themeColor } from '@amsterdam/asc-ui'
import { useMapInstance } from '@amsterdam/react-maps'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import type { LatLng, LatLngLiteral } from 'leaflet'
import L, { Polygon } from 'leaflet'
import type { FunctionComponent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDataSelection } from '../../../../components/DataSelection/DataSelectionContext'
import useLegacyDataselectionConfig from '../../../../components/DataSelection/useLegacyDataselectionConfig'
import { toGeoSearch } from '../../../../links'
import { routing } from '../../../../routes'
import useBuildQueryString from '../../../../utils/useBuildQueryString'
import useMapCenterToMarker from '../../../../utils/useMapCenterToMarker'
import useParam from '../../../../utils/useParam'
import config from '../../config'
import { useMapContext } from '../../MapContext'
import {
  DRAWTOOL_ADD_POLYGON,
  DRAWTOOL_ADD_POLYLINE,
  DRAWTOOL_EDIT_POLYGON,
  DRAWTOOL_EDIT_POLYLINE,
  DRAWTOOL_REMOVE_POLYGON,
  DRAWTOOL_REMOVE_POLYLINE,
} from '../../matomo-events'
import type { PolyDrawing } from '../../query-params'
import { polygonParam, polylineParam } from '../../query-params'
import type { ExtendedLayer, PolygonType, PolylineType } from './BareDrawTool'
import { BareDrawTool } from './BareDrawTool'

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

export const DRAWN_ITEM_CLASS = 'drawtool-drawn-item'

const DrawTool: FunctionComponent = () => {
  const { buildQueryString } = useBuildQueryString()

  const location = useLocation()
  const [polygon] = useParam(polygonParam)
  const [polyline] = useParam(polylineParam)
  const history = useHistory()
  const { activeFilters, setDistanceText, setDrawToolLocked } = useDataSelection()
  const { currentDatasetType } = useLegacyDataselectionConfig()
  const { panToWithPanelOffset } = useMapCenterToMarker()
  const { setLegendActive } = useMapContext()
  const { trackEvent } = useMatomo()

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
   */
  const updateShape = (shape: { polygon: PolyDrawing | null; polyline: PolyDrawing | null }) => {
    const geoOrAddressPage = shape.polygon ? routing.addresses.path : location.pathname
    const pathname = config[currentDatasetTypeRef.current?.toUpperCase()]?.path ?? geoOrAddressPage
    if (shape.polygon) {
      setLegendActive(false)
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
    const element = layer.getElement()

    if (element instanceof HTMLElement) {
      L.DomUtil.addClass(element, DRAWN_ITEM_CLASS)
    }
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
        // Ended drawing, so be able to click on the map to search by (geo) location
        setDrawToolLocked(false)
      }, 500) // Safari hack: using this arbitrary value because in some cases leaflet is firing the mapmarker click event slightly later, causing the user to navigate to geosearch page instead of showing the polygon

      if (layer instanceof Polygon) {
        // Also pan and zoom to the drawing
        panToWithPanelOffset(layer.getBounds())
      }

      updateShape({
        polygon: updatedPolygon,
        polyline: updatedPolyline,
      })
    },
    [polygonRef, polylineRef],
  )

  const onDeleteDrawing = useCallback((deletedLayers: ExtendedLayer[]) => {
    const deletedLayersIds = deletedLayers.map(({ id }) => id)
    const deletedLayersBounds = deletedLayers.map((layer) => {
      const coordinates = layer.getLatLngs()

      if (layer instanceof Polygon) {
        trackEvent(DRAWTOOL_REMOVE_POLYGON)
      } else {
        trackEvent(DRAWTOOL_REMOVE_POLYLINE)
      }

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
      ...toGeoSearch(),
      search: buildQueryString(undefined, [polylineParam, polygonParam]),
    })
  }

  const onDrawEnd = (layer: ExtendedLayer) => {
    updateDrawings(layer)
    if (layer instanceof Polygon) {
      trackEvent(DRAWTOOL_ADD_POLYGON)
    } else {
      trackEvent(DRAWTOOL_ADD_POLYLINE)
    }
  }

  useEffect(() => {
    const onEditVertex = (e: L.DrawEvents.EditVertex) => {
      setDrawToolLocked(true)
      updateDrawings(e.poly as ExtendedLayer)
      if (e.poly instanceof Polygon) {
        trackEvent(DRAWTOOL_EDIT_POLYGON)
      } else {
        trackEvent(DRAWTOOL_EDIT_POLYLINE)
      }
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
      onDrawEnd={onDrawEnd}
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
