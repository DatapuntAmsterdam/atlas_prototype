import { MapPanelContext, Marker as ARMMarker, usePanToLatLng } from '@datapunt/arm-core'
import { useMapInstance } from '@datapunt/react-maps'
import { LeafletMouseEvent } from 'leaflet'
import React, { useContext, useEffect } from 'react'
import fetchNearestDetail from '../../../../map/services/nearest-detail/nearest-detail'
import { detailUrlParam, locationParam } from '../query-params'
import joinUrl from '../../../utils/joinUrl'
import useParam from '../../../utils/useParam'
import MapContext, { Overlay } from '../MapContext'
import { SnapPoint } from '../types'

interface NearestDetail {
  id: string
  type: string
}

const MapSearchMarker: React.FC = () => {
  const [, setDetailUrl] = useParam(detailUrlParam)
  const { legendLeafletLayers } = useContext(MapContext)
  const [location, setLocation] = useParam(locationParam)
  const mapInstance = useMapInstance()
  const { pan } = usePanToLatLng()
  const {
    drawerPosition,
    setPositionFromSnapPoint,
    matchPositionWithSnapPoint,
    variant,
  } = useContext(MapPanelContext)

  async function handleMapClick(e: LeafletMouseEvent, activeOverlays: Overlay[]) {
    const layers = activeOverlays
      .filter((overlay) => !!overlay.layer.detailUrl)
      .map((overlay) => overlay.layer)

    if (layers.length === 0) {
      setLocation(e.latlng)
      return
    }

    const nearestDetail: NearestDetail | null = await fetchNearestDetail(
      { latitude: e.latlng.lat, longitude: e.latlng.lng },
      layers,
      8,
    )

    if (nearestDetail) {
      const detailUrl = joinUrl(nearestDetail.type, nearestDetail.id)
      setDetailUrl(detailUrl)
    } else {
      setLocation(e.latlng)
    }
  }

  useEffect(() => {
    if (!mapInstance) {
      return undefined
    }

    const clickHandler = (e: LeafletMouseEvent) => {
      setPositionFromSnapPoint(SnapPoint.Halfway)
      handleMapClick(e, legendLeafletLayers)
    }

    mapInstance.on('click', clickHandler)

    return () => {
      mapInstance.off('click', clickHandler)
    }
  }, [mapInstance, legendLeafletLayers])

  // Use this logic to automatically pan the map to the center of the marker when the drawer is positioned in the middle
  useEffect(() => {
    if (matchPositionWithSnapPoint(SnapPoint.Halfway) && location) {
      pan(location, variant === 'drawer' ? 'vertical' : 'horizontal', 20)
    }
  }, [drawerPosition, location])

  return location ? <ARMMarker latLng={location} /> : null
}

export default MapSearchMarker
