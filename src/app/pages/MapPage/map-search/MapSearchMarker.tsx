import { MapPanelContext, Marker as ARMMarker } from '@datapunt/arm-core'
import { useMapEvents } from '@datapunt/react-maps'
import { LeafletMouseEvent } from 'leaflet'
import React, { useContext } from 'react'
import fetchNearestDetail from '../../../../map/services/nearest-detail/nearest-detail'
import joinUrl from '../../../utils/joinUrl'
import useMapCenterToMarker from '../../../utils/useMapCenterToMarker'
import useParam from '../../../utils/useParam'
import MapContext, { Overlay } from '../MapContext'
import { MarkerProps } from '../MapMarkers'
import { detailUrlParam } from '../query-params'
import { SnapPoint } from '../types'

interface NearestDetail {
  id: string
  type: string
}

const MapSearchMarker: React.FC<MarkerProps> = ({ location, setLocation }) => {
  const [, setDetailUrl] = useParam(detailUrlParam)
  const { legendLeafletLayers } = useContext(MapContext)

  useMapCenterToMarker(location)

  const { setPositionFromSnapPoint } = useContext(MapPanelContext)

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

  useMapEvents({
    click: (event) => {
      setPositionFromSnapPoint(SnapPoint.Halfway)
      handleMapClick(event, legendLeafletLayers)
    },
  })

  return location ? <ARMMarker latLng={location} /> : null
}

export default MapSearchMarker
