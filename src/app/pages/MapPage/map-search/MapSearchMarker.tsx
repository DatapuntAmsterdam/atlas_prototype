import { MapPanelContext, Marker as ARMMarker } from '@amsterdam/arm-core'
import { useMapEvents } from '@amsterdam/react-maps'
import { LeafletMouseEvent } from 'leaflet'
import { useContext, useEffect, useRef, FunctionComponent } from 'react'
import { generatePath, useHistory } from 'react-router-dom'
import fetchNearestDetail from '../../../../map/services/nearest-detail/nearest-detail'
import MapContext, { Overlay } from '../MapContext'
import { MarkerProps } from '../MapMarkers'
import { locationParam } from '../query-params'
import { SnapPoint } from '../types'
import { routing } from '../../../routes'
import useBuildQueryString from '../../../utils/useBuildQueryString'

const MapSearchMarker: FunctionComponent<MarkerProps> = ({ location }) => {
  const { legendLeafletLayers } = useContext(MapContext)
  const history = useHistory()
  const { buildQueryString } = useBuildQueryString()

  const { setPositionFromSnapPoint } = useContext(MapPanelContext)

  const legendLeafletLayersRef = useRef<Overlay[]>(legendLeafletLayers)

  useEffect(() => {
    if (legendLeafletLayers) {
      legendLeafletLayersRef.current = legendLeafletLayers
    }
  }, [legendLeafletLayers])

  async function handleMapClick(e: LeafletMouseEvent) {
    const layers = legendLeafletLayersRef.current
      .filter((overlay) => overlay.layer.detailUrl)
      .map((overlay) => overlay.layer)

    const nearestDetail =
      layers.length > 0
        ? await fetchNearestDetail({ latitude: e.latlng.lat, longitude: e.latlng.lng }, layers, 8)
        : null

    if (nearestDetail) {
      const { type, subType, id } = nearestDetail
      history.push({
        pathname: generatePath(routing.dataDetail_TEMP.path, {
          type,
          subtype: subType ?? '',
          id,
        }),
        search: window.location.search,
      })
    } else {
      history.push({
        pathname: routing.dataSearchGeo_TEMP.path,
        search: buildQueryString([[locationParam, e.latlng]]),
      })
    }
  }

  useMapEvents({
    click: async (event) => {
      setPositionFromSnapPoint(SnapPoint.Halfway)
      await handleMapClick(event)
    },
  })

  return location ? <ARMMarker latLng={location} /> : null
}

export default MapSearchMarker
