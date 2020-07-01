import { MapPanelContext, Marker as ARMMarker, usePanToLatLng } from '@datapunt/arm-core'
import { useMapInstance } from '@datapunt/react-maps'
import { LatLngLiteral, LeafletMouseEvent } from 'leaflet'
import React, { useContext, useEffect } from 'react'
import { SnapPoint } from '../types'

const PointSearchMarker: React.FC<{
  onClick: (e: LeafletMouseEvent) => void
  currentLatLng: LatLngLiteral | null
}> = ({ onClick, currentLatLng }) => {
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
      onClick(e)
    }
    mapInstance.on('click', clickHandler)

    return () => {
      mapInstance.off('click', clickHandler)
    }
  }, [mapInstance])

  // Use this logic to automatically pan the map to the center of the marker when the drawer is positioned in the middle
  useEffect(() => {
    if (matchPositionWithSnapPoint(SnapPoint.Halfway) && currentLatLng) {
      pan(currentLatLng, variant === 'drawer' ? 'vertical' : 'horizontal', 20)
    }
  }, [drawerPosition, currentLatLng])
  return currentLatLng ? <ARMMarker latLng={currentLatLng} /> : null
}

export default PointSearchMarker
