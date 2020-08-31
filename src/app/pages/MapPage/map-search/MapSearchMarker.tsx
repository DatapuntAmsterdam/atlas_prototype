import { MapPanelContext, Marker as ARMMarker, usePanToLatLng } from '@datapunt/arm-core'
import { useMapInstance } from '@datapunt/react-maps'
import { LeafletMouseEvent } from 'leaflet'
import React, { useContext, useEffect } from 'react'
import fetchNearestDetail from '../../../../map/services/nearest-detail/nearest-detail'
import { detailUrlParam, locationParam } from '../../../query-params'
import joinUrl from '../../../utils/joinUrl'
import useParam from '../../../utils/useParam'
import MapContext from '../MapContext'
import { SnapPoint } from '../types'

interface NearestDetail {
  id: string
  type: string
}

const MapSearchMarker: React.FC = () => {
  const [, setDetailUrl] = useParam(detailUrlParam)
  const { legendLeafletLayers } = React.useContext(MapContext)
  const [location, setLocation] = useParam(locationParam)

  async function handleMapClick(e: LeafletMouseEvent) {
    if (legendLeafletLayers && legendLeafletLayers.length > 0) {
      const activeOverlaysWithInstanceAPI = legendLeafletLayers.filter(
        // @ts-ignore TODO: auto generate types
        (activeOverlay) => activeOverlay.detailUrl,
      )

      const nearestDetail: NearestDetail | null = await fetchNearestDetail(
        { latitude: e.latlng.lat, longitude: e.latlng.lng },
        activeOverlaysWithInstanceAPI,
        8,
      )

      if (nearestDetail) {
        const detailUrl = joinUrl(nearestDetail.type, nearestDetail.id)
        setDetailUrl(detailUrl)
      } else {
        setLocation([e.latlng.lat, e.latlng.lng])
      }
    } else {
      // get the geo search information
      setLocation([e.latlng.lat, e.latlng.lng])
    }
  }

  const {
    drawerPosition,
    setPositionFromSnapPoint,
    matchPositionWithSnapPoint,
    variant,
  } = useContext(MapPanelContext)

  const mapInstance = useMapInstance()
  const { pan } = usePanToLatLng()
  useEffect(() => {
    if (!mapInstance) {
      return undefined
    }
    const clickHandler = (e: LeafletMouseEvent) => {
      setPositionFromSnapPoint(SnapPoint.Halfway)
      handleMapClick(e)
    }
    mapInstance.on('click', clickHandler)

    return () => {
      mapInstance.off('click', clickHandler)
    }
  }, [mapInstance])

  // Use this logic to automatically pan the map to the center of the marker when the drawer is positioned in the middle
  useEffect(() => {
    if (matchPositionWithSnapPoint(SnapPoint.Halfway) && location) {
      pan(
        { lat: location[0], lng: location[1] },
        variant === 'drawer' ? 'vertical' : 'horizontal',
        20,
      )
    }
  }, [drawerPosition, location])
  return location ? <ARMMarker latLng={location} /> : null
}

export default MapSearchMarker
