import L, { LatLng, LatLngTuple, Polygon, Polyline } from 'leaflet'
import React, { useContext, useEffect } from 'react'
import { useMapInstance } from '@datapunt/react-maps'
import { DrawTool as DrawToolComponent } from '@datapunt/arm-draw'
import { mapPanelComponents, usePanToLatLng } from '@datapunt/arm-core'
import { SnapPoint } from '../types'
import DataSelectionContext from '../DataSelectionContext'

type extraLayerTypes = {
  id: string
  editing: {
    _enabled: boolean
    disable: () => void
  }
}

type PolygonType = extraLayerTypes & Polygon
type PolylineType = extraLayerTypes & Polyline

export type ExtendedLayer = PolygonType | PolylineType

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
  onToggle: (showDrawing: boolean) => void
  setMarkerGroups: (markerGroups: MarkerGroup[]) => void
  setDataSelectionResults: (results: any) => void
  markerGroupsRef: React.RefObject<MarkerGroup[]>
}

const { MapPanelContext } = mapPanelComponents

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

const bindDistanceAndAreaToTooltip = (layer: ExtendedLayer, toolTipText) => {
  layer.bindTooltip(toolTipText, { direction: 'bottom' }).openTooltip()
}

const DrawTool: React.FC<Props> = ({ onToggle, isOpen }) => {
  const { setPositionFromSnapPoint, variant } = useContext(MapPanelContext)
  const { fetchData, fetchMapVisualization, mapVisualization, removeDataSelection } = useContext(
    DataSelectionContext,
  )
  const mapInstance = useMapInstance()
  const { pan } = usePanToLatLng()

  const getData = async (layer: ExtendedLayer, distanceText: string) => {
    if (layer instanceof Polygon) {
      setPositionFromSnapPoint(SnapPoint.Halfway)
      const latLngs = layer.getLatLngs() as LatLng[][]
      const firstDrawingPoint = latLngs[0][0]
      await fetchMapVisualization(latLngs, layer.id)
      await fetchData(
        layer.getLatLngs() as LatLng[][],
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

  return (
    <DrawToolComponent
      onDrawEnd={async (layer: ExtendedLayer) => {
        const distanceText = setDistance(layer)
        bindDistanceAndAreaToTooltip(layer, distanceText)
        await getData(layer, distanceText)
      }}
      onDelete={(layersInEditMode: Array<ExtendedLayer>) => {
        const editLayerIds = layersInEditMode.map(({ id }) => id)

        // remove the markerGroups.
        if (mapVisualization) {
          removeDataSelection(editLayerIds)
        }
      }}
      isOpen={isOpen}
      onToggle={onToggle}
    />
  )
}

export default DrawTool
