import L, { LatLng, LatLngTuple, Polygon, Polyline } from 'leaflet'
import React, { useEffect } from 'react'
import { useMapInstance } from '@datapunt/react-maps'
import { DrawTool as DrawToolComponent } from '@datapunt/arm-draw'
import getDataSelection from '../getDataSelection'

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
  markers: LatLngTuple[]
}

type Props = {
  onToggle: (showDrawing: boolean) => void
  setMarkerGroups: (markerGroups: MarkerGroup[]) => void
  markerGroupsRef: React.RefObject<MarkerGroup[]>
}

const DATA_SELECTION_ENDPOINT = 'https://api.data.amsterdam.nl/dataselectie/bag/geolocation/'

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

const bindDistanceAndAreaToTooltip = (layer: ExtendedLayer) => {
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
  if (toolTipText) {
    layer.bindTooltip(toolTipText, { direction: 'bottom' }).openTooltip()
  }
}

const DrawTool: React.FC<Props> = ({ onToggle, setMarkerGroups, markerGroupsRef }) => {
  const mapInstance = useMapInstance()
  const fetchData = async (latLngs: LatLng[][]) =>
    getDataSelection(DATA_SELECTION_ENDPOINT, {
      shape: JSON.stringify(latLngs[0].map(({ lat, lng }) => [lng, lat])),
    })

  const getMarkerGroup = async (layer: ExtendedLayer): Promise<null | void> => {
    if (!(layer instanceof Polygon)) {
      return null
    }
    try {
      const latLngs = layer.getLatLngs() as LatLng[][]
      const res = await fetchData(latLngs)

      if (markerGroupsRef.current) {
        setMarkerGroups([
          ...markerGroupsRef.current.filter(({ id }) => id !== layer.id),
          {
            id: layer.id,
            markers: res.markers,
          },
        ])
      }
    } catch (e) {
      // Handle error
      // eslint-disable-next-line no-console
      console.warn(e)
    }

    return null
  }

  const editVertex = async (e: L.DrawEvents.EditVertex) => {
    await getMarkerGroup(e.poly as ExtendedLayer)
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
        await getMarkerGroup(layer)
        bindDistanceAndAreaToTooltip(layer)
      }}
      onDelete={(layersInEditMode: Array<ExtendedLayer>) => {
        const editLayerIds = layersInEditMode.map(({ id }) => id)

        // remove the markerGroups.
        if (markerGroupsRef.current) {
          setMarkerGroups(markerGroupsRef.current.filter(({ id }) => !editLayerIds.includes(id)))
        }
      }}
      onToggle={onToggle}
    />
  )
}

export default DrawTool
