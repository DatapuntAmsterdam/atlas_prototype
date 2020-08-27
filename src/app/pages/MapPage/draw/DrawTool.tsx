/* eslint-disable no-underscore-dangle */
import { MapPanelContext } from '@datapunt/arm-core'
import {
  DrawTool as DrawToolComponent,
  ExtendedLayer,
  PolygonType,
  PolylineType,
} from '@datapunt/arm-draw'
import { ascDefaultTheme, themeColor } from '@datapunt/asc-ui'
import { useMapInstance } from '@datapunt/react-maps'
import L, { LatLng, latLngBounds, LatLngLiteral, Polygon } from 'leaflet'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import DataSelectionContext from './DataSelectionContext'
import { Overlay, SnapPoint } from '../types'
import useParam from '../../../utils/useParam'
import { PolyDrawing, polygonParam, polylineParam } from '../../../query-params'
import MapContext from '../MapContext'

type Props = {
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

const createPolyLayer = (drawing: PolyDrawing, line = false): PolylineType | PolygonType => {
  const bounds = (drawing.polygon.map(({ lat, lng }) => [lat, lng]) as unknown) as LatLng[]

  const polygon = L[line ? 'polyline' : 'polygon'](bounds, {
    color: themeColor('support', line ? 'valid' : 'invalid')({ theme: ascDefaultTheme }),
    bubblingMouseEvents: false,
  }) as PolylineType | PolygonType

  polygon.id = drawing.id

  return polygon
}

const DrawTool: React.FC<Props> = ({ setCurrentOverlay }) => {
  const { setPositionFromSnapPoint } = useContext(MapPanelContext)
  const { showDrawTool, setShowDrawTool } = useContext(MapContext)
  const {
    fetchData,
    fetchMapVisualization,
    dataSelection,
    mapVisualizations: mapVisualization,
    removeDataSelection,
  } = useContext(DataSelectionContext)

  const [polygons, setPolygons] = useParam(polygonParam)
  const [polylines, setPolylines] = useParam(polylineParam)

  const [initialDrawnItems, setInitialDrawnItems] = useState([
    ...(polygons ? polygons.map((drawing) => createPolyLayer(drawing)) : []),
    ...(polylines ? polylines.map((drawing) => createPolyLayer(drawing, true)) : []),
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

      const distanceText = setDistance(layer)
      bindDistanceAndAreaToTooltip(layer, distanceText)
      const setFn = layer instanceof Polygon ? setPolygons : setPolylines
      setFn(
        (currentPolys) => [
          ...(currentPolys
            ? currentPolys.map(({ id, polygon }) =>
                id === layer.id
                  ? { id: layer.id, polygon: layer.getLatLngs().flat() as LatLngLiteral[] }
                  : {
                      id,
                      polygon,
                    },
              )
            : []),
        ],
        'replace',
      )
      await getDrawingData(layer, distanceText)
    },
    [getDrawingData],
  )

  const onDeleteDrawing = useCallback(
    (deletedLayers: Array<ExtendedLayer>) => {
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

      // Delete or reset the drawing geometries
      if (deletedLayersBounds?.length) {
        deletedLayers.forEach((layer) => {
          const setFn = layer instanceof Polygon ? setPolygons : setPolylines
          setFn(
            (currentPolys) => [
              ...(currentPolys
                ? currentPolys.filter(({ id }) => !deletedLayersIds.includes(id))
                : []),
            ],
            'replace',
          )
        })
      }
    },
    [mapVisualization, setPolygons, setPolylines],
  )

  const handleOnDrawEnd = useCallback(
    async (layer: ExtendedLayer) => {
      const distanceText = setDistance(layer)
      await getDrawingData(layer, distanceText)
      bindDistanceAndAreaToTooltip(layer, distanceText)
      const setFn = layer instanceof Polygon ? setPolygons : setPolylines
      setFn(
        (currentPolys) => [
          ...(currentPolys ? currentPolys.filter(({ id }) => id !== layer.id) : []),
          { id: layer.id, polygon: layer.getLatLngs().flat() as LatLngLiteral[] },
        ],
        'replace',
      )
    },
    [getDrawingData, setPolygons, setPolylines],
  )

  const fitToBounds = useCallback(() => {
    // @ts-ignore
    const currentLatLngs = Object.values(drawnItemsGroup._layers as ExtendedLayer[])
      .map((layer: ExtendedLayer) => layer.getLatLngs().flat())
      .flat() as LatLngLiteral[]

    if (!currentLatLngs.length || !mapInstance) {
      return
    }

    const minLat = Math.min(...currentLatLngs.map(({ lat }) => lat))
    const minLng = Math.min(...currentLatLngs.map(({ lng }) => lng))
    const maxLng = Math.max(...currentLatLngs.map(({ lng }) => lng))
    const maxLat = Math.max(...currentLatLngs.map(({ lat }) => lat))

    // const offset = (maxLng - minLng) * 0.5 // in case the panel is open
    const bounds = latLngBounds({ lat: minLat, lng: minLng }, { lat: maxLat, lng: maxLng })
    mapInstance.fitBounds(bounds)
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

  // Todo: Move all these effects here to ARM DrawTool (needs a refactor to accept existing drawings)
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
   * Todo: Obviously this is far from ideal. This logic should be moved to the ARM draw package
   */
  useEffect(() => {
    if (showDrawTool) {
      const savedPolygons = JSON.parse(window.localStorage.getItem('polygons') || 'null')
      const savedPolylines = JSON.parse(window.localStorage.getItem('polylines') || 'null')
      setPolygons(savedPolygons)
      setPolylines(savedPolylines)
      const initialLayers = [
        ...(savedPolylines
          ? savedPolylines.map((drawing: PolyDrawing) => createPolyLayer(drawing, true))
          : []),
        ...(savedPolygons
          ? savedPolygons.map((drawing: PolyDrawing) => createPolyLayer(drawing))
          : []),
      ]
      setInitialDrawnItems(initialLayers)
      Promise.all(initialLayers.map((layer) => getDrawingData(layer, setDistance(layer))))
    } else {
      setPolygons(null)
      setPolylines(null)
      drawnItemsGroup.clearLayers()
    }
  }, [showDrawTool])

  useEffect(() => {
    initialDrawnItems.forEach((layer) => {
      const distanceText = setDistance(layer)
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
