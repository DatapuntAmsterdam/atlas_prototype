import { MapPanelContext, usePanToLatLng } from '@datapunt/arm-core'
import {
  DrawTool as DrawToolComponent,
  ExtendedLayer,
  PolygonType,
  PolylineType,
} from '@datapunt/arm-draw'
import { themeColor, ascDefaultTheme } from '@datapunt/asc-ui'
import L, { Polygon, LatLng, LatLngTuple, LatLngLiteral, LatLngBoundsLiteral } from 'leaflet'
import { useMapInstance } from '@datapunt/react-maps'
import React, { useContext, useEffect, useMemo } from 'react'
import PARAMETERS from '../../../../store/parameters'
import { decodeBounds } from '../../../../store/queryParameters'
import getParam from '../../../utils/getParam'
import DataSelectionContext from '../DataSelectionContext'
import MapContext from '../MapContext'
import { Overlay, SnapPoint } from '../types'

type MarkerGroup = {
  id: string
  markers: [
    {
      id: string
      latLng: LatLngTuple[]
    },
  ]
}

type Props = {
  isOpen: boolean
  onToggle: (showDrawing: boolean) => void
  setCurrentOverlay: (overlay: Overlay) => void
}

const getTotalDistance = (latLngs: LatLng[]) => {
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

const setDistance = (layer: ExtendedLayer) => {
  const latLngs = layer
    .getLatLngs()
    // @ts-ignore
    .flat()
    .flat()
  const distance = getTotalDistance(latLngs)

  let toolTipText: string

  if (distance >= 1000) {
    toolTipText = `${L.GeometryUtil.formattedNumber(`${distance / 1000}`, 2)} km`
  } else {
    toolTipText = `${L.GeometryUtil.formattedNumber(`${distance}`, 2)} m`
  }

  if (layer instanceof Polygon) {
    toolTipText = `${L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(latLngs), true, {
      m: 1,
    })}, ${toolTipText}`
  }

  return toolTipText
}

const bindDistanceAndAreaToTooltip = (layer: ExtendedLayer, toolTipText: string) => {
  layer.bindTooltip(toolTipText, { direction: 'bottom' }).openTooltip()
}

const DrawTool: React.FC<Props> = ({ onToggle, isOpen, setCurrentOverlay }) => {
  const { setPositionFromSnapPoint, variant } = useContext(MapPanelContext)
  const { fetchData, fetchMapVisualization, mapVisualization, removeDataSelection } = useContext(
    DataSelectionContext,
  )
  const {
    drawingGeometries,
    addDrawingGeometry,
    deleteDrawingGeometry,
    resetDrawingGeometries,
  } = useContext(MapContext)

  const mapInstance = useMapInstance()
  const { pan } = usePanToLatLng()

  const getData = async (layer: ExtendedLayer, distanceText: string) => {
    const latLngs = layer.getLatLngs()

    // convert the geometry to match a type that only contains lat/lng
    const drawingGeometry = latLngs[0] as LatLngLiteral[]
    addDrawingGeometry(drawingGeometry)

    if (layer instanceof Polygon) {
      setPositionFromSnapPoint(SnapPoint.Halfway)

      const firstDrawingPoint = latLngs[0] as LatLng
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
      pan(firstDrawingPoint, variant === 'drawer' ? 'vertical' : 'horizontal', 20)
    }
  }

  const editVertex = async (e: L.DrawEvents.EditVertex) => {
    const layer = e.poly as ExtendedLayer

    const distanceText = setDistance(layer)
    bindDistanceAndAreaToTooltip(layer, distanceText)
    await getData(layer, distanceText)
  }

  const onDeleteDrawing = (layersInEditMode: Array<ExtendedLayer>) => {
    const editLayerIds = layersInEditMode.map(({ id }) => id)
    const editLayerBounds = layersInEditMode.map((layer) => {
      const coordinates = layer.getLatLngs()

      return coordinates[0] as LatLngLiteral
    })
    // remove the markerGroups.
    if (mapVisualization) {
      removeDataSelection(editLayerIds)
    }

    // Delete or reset the drawing geometries
    if (editLayerBounds?.length) {
      deleteDrawingGeometry(editLayerBounds[0])
    } else {
      resetDrawingGeometries()
    }
  }

  useEffect(() => {
    if (mapInstance) {
      // @ts-ignore
      mapInstance.on(L.Draw.Event.EDITVERTEX, editVertex)
    }

    return () => {
      if (mapInstance) {
        // @ts-ignore
        mapInstance.off(L.Draw.Event.EDITVERTEX, editVertex)
      }
    }
  }, [mapInstance])

  const setInitialDrawing = (polybounds: LatLngLiteral[]) => {
    function createPolyline(coordinates: LatLngLiteral[]): PolylineType {
      const bounds = (coordinates.map(({ lat, lng }) => [lat, lng]) as unknown) as LatLng[]

      return L.polyline(bounds, {
        color: themeColor('support', 'invalid')({ theme: ascDefaultTheme }),
        bubblingMouseEvents: false,
      }) as PolylineType
    }

    function createPolygon(coordinates: LatLngLiteral[]): PolygonType {
      const bounds = (coordinates.map(({ lat, lng }) => [lat, lng]) as unknown) as LatLng[]

      return L.polygon(bounds, {
        color: themeColor('support', 'invalid')({ theme: ascDefaultTheme }),
        bubblingMouseEvents: false,
      }) as PolygonType
    }

    return polybounds.length > 2 ? createPolygon(polybounds) : createPolyline(polybounds)
  }

  const initialDrawnItems = useMemo(() => {
    // Get the drawing geometry from the url here, before the context is updated to prevent newly drawm geometries to be pushed to the DrawToolComponent
    const initialDrawingGeometries = getParam(PARAMETERS.DRAWING_GEOMETRY)

    if (initialDrawingGeometries) {
      return decodeBounds(initialDrawingGeometries).map((initialDrawingGeometry: LatLngLiteral[]) =>
        setInitialDrawing(initialDrawingGeometry),
      )
    }
    return null
  }, [])

  useEffect(() => {
    if (mapInstance && drawingGeometries?.length) {
      // Center the map
      mapInstance.fitBounds((drawingGeometries as unknown) as LatLngBoundsLiteral)
    }
  }, [mapInstance, drawingGeometries])

  return (
    <DrawToolComponent
      onDrawEnd={async (layer: ExtendedLayer) => {
        const distanceText = setDistance(layer)
        bindDistanceAndAreaToTooltip(layer, distanceText)

        await getData(layer, distanceText)
      }}
      onDelete={onDeleteDrawing}
      isOpen={isOpen || initialDrawnItems}
      onToggle={onToggle}
      drawnItems={initialDrawnItems && initialDrawnItems}
      onDrawStart={() => {
        setCurrentOverlay(Overlay.Results)
      }}
    />
  )
}

export default DrawTool
