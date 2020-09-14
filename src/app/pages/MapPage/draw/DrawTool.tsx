import { MapPanelContext } from '@datapunt/arm-core'
import {
  DrawTool as DrawToolComponent,
  ExtendedLayer,
  PolygonType,
  PolylineType,
} from '@datapunt/arm-draw'
import { ascDefaultTheme, themeColor } from '@datapunt/asc-ui'
import { useMapInstance } from '@datapunt/react-maps'
import L, { LatLng, LatLngLiteral, Polygon } from 'leaflet'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import DataSelectionContext from './DataSelectionContext'
import { Overlay, SnapPoint } from '../types'
import useParam from '../../../utils/useParam'
import { PolyDrawing, polygonsParam, polylinesParam } from '../query-params'
import MapContext from '../MapContext'

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

function getDistanceLabel(layer: ExtendedLayer) {
  const latLngs = layer.getLatLngs().flat(2)
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

const DrawTool: React.FC<DrawToolProps> = ({ setCurrentOverlay }) => {
  const { setPositionFromSnapPoint } = useContext(MapPanelContext)
  const { showDrawTool, setShowDrawTool } = useContext(MapContext)
  const {
    fetchData,
    fetchMapVisualization,
    dataSelection,
    mapVisualizations: mapVisualization,
    removeDataSelection,
  } = useContext(DataSelectionContext)

  const [polygons, setPolygons] = useParam(polygonsParam)
  const [polylines, setPolylines] = useParam(polylinesParam)

  const [initialDrawnItems, setInitialDrawnItems] = useState([
    ...polygons.map((drawing) => createPolyLayer(drawing)),
    ...polylines.map((drawing) => createPolyLayer(drawing, true)),
  ])

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

  /**
   * Add tooltip, update the URL param and fetch the results
   * @param e
   */
  const editVertex = useCallback(
    async (e: L.DrawEvents.EditVertex) => {
      const layer = e.poly as ExtendedLayer

      const distanceText = getDistanceLabel(layer)
      bindDistanceAndAreaToTooltip(layer, distanceText)

      const setPolys = layer instanceof Polygon ? setPolygons : setPolylines

      setPolys(
        (polys) =>
          polys.map((poly) => {
            if (poly.id !== layer.id) {
              return poly
            }

            return { ...poly, polygon: layer.getLatLngs().flat(2) }
          }),
        'replace',
      )

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

      // Delete or reset the drawing geometries
      deletedLayers.forEach((layer) => {
        const setPolys = layer instanceof Polygon ? setPolygons : setPolylines
        setPolys((polys) => polys.filter(({ id }) => !deletedLayersIds.includes(id)), 'replace')
      })
    },
    [mapVisualization, setPolygons, setPolylines],
  )

  const handleOnDrawEnd = useCallback(
    async (layer: ExtendedLayer) => {
      const distanceText = getDistanceLabel(layer)
      await getDrawingData(layer, distanceText)
      bindDistanceAndAreaToTooltip(layer, distanceText)

      const setPolys = layer instanceof Polygon ? setPolygons : setPolylines

      setPolys((polys) => [
        ...polys.filter(({ id }) => id !== layer.id),
        { id: layer.id, polygon: layer.getLatLngs().flat(2) },
      ])
    },
    [getDrawingData, setPolygons, setPolylines],
  )

  const fitToBounds = useCallback(() => {
    const bounds = drawnItemsGroup.getBounds()

    if (mapInstance && bounds.isValid()) {
      mapInstance.fitBounds(bounds)
    }
  }, [drawnItemsGroup, mapInstance])

  useEffect(() => {
    if (mapInstance) {
      fitToBounds()
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

  useEffect(() => {
    if (dataSelection) {
      setPositionFromSnapPoint(SnapPoint.Halfway)
    }
  }, [dataSelection])

  // TODO: Move all these effects here to ARM DrawTool (needs a refactor to accept existing drawings)
  useEffect(() => {
    if (showDrawTool) {
      // polygons can be null, while there are polygons set and showDrawTool is set to true, so wait one tick here
      setTimeout(() => {
        window.localStorage.setItem('polygons', JSON.stringify(polygons))
        window.localStorage.setItem('polylines', JSON.stringify(polylines))
      }, 0)
    }
  }, [polygons, polylines, showDrawTool])

  /**
   * When opening the drawtool, get possible existing drawings from localStorage,
   * then update the URL query
   * then manually create the layers and update the initialDrawnItems state
   * finally get fetch the data
   *
   * TODO: Obviously this is far from ideal. This logic should be moved to the ARM draw package
   */
  useEffect(() => {
    if (showDrawTool) {
      const savedPolygonsRaw = window.localStorage.getItem('polygons')
      const savedPolylinesRaw = window.localStorage.getItem('polylines')
      const savedPolygons: PolyDrawing[] = savedPolygonsRaw ? JSON.parse(savedPolygonsRaw) : []
      const savedPolylines: PolyDrawing[] = savedPolylinesRaw ? JSON.parse(savedPolylinesRaw) : []

      setPolygons(savedPolygons)
      setPolylines(savedPolylines)

      const initialLayers = [
        ...savedPolylines.map((drawing: PolyDrawing) => createPolyLayer(drawing, true)),
        ...savedPolygons.map((drawing: PolyDrawing) => createPolyLayer(drawing)),
      ]

      setInitialDrawnItems(initialLayers)

      initialLayers.forEach((layer) => getDrawingData(layer, getDistanceLabel(layer)))
    } else {
      setPolygons(null)
      setPolylines(null)
      drawnItemsGroup.clearLayers()
    }
  }, [showDrawTool])

  useEffect(() => {
    if (!polylines.length && !polygons.length) {
      setShowDrawTool(false)
    } else {
      setShowDrawTool(true)
    }
  }, [polylines, polygons])

  useEffect(() => {
    initialDrawnItems.forEach((layer) => {
      const distanceText = getDistanceLabel(layer)
      bindDistanceAndAreaToTooltip(layer, distanceText)
    })
  }, [initialDrawnItems])

  return (
    <DrawToolComponent
      onDrawEnd={handleOnDrawEnd}
      onDelete={onDeleteDrawing}
      isOpen={showDrawTool}
      onToggle={setShowDrawTool}
      drawnItems={initialDrawnItems && initialDrawnItems}
      onDrawStart={() => {
        setCurrentOverlay(Overlay.Results)
      }}
      drawnItemsGroup={drawnItemsGroup}
    />
  )
}

export default DrawTool
