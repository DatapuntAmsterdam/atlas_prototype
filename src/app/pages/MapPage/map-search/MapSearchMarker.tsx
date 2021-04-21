import { MapPanelContext, Marker as ARMMarker } from '@amsterdam/arm-core'
import { LeafletMouseEvent } from 'leaflet'
import { FunctionComponent, useContext } from 'react'
import { matchPath, useHistory, useLocation } from 'react-router-dom'
import fetchNearestDetail from '../../../../map/services/nearest-detail/nearest-detail'
import MapContext from '../MapContext'
import { MarkerProps } from '../MapMarkers'
import { locationParam, zoomParam } from '../query-params'
import { SnapPoint } from '../types'
import { toDataDetail } from '../../../links'
import { routing } from '../../../routes'
import useBuildQueryString from '../../../utils/useBuildQueryString'
import useParam from '../../../utils/useParam'
import useLeafletMapEventHandler from '../../../utils/useLeafletMapEventHandler'

const MapSearchMarker: FunctionComponent<MarkerProps> = ({ position }) => {
  const { legendLeafletLayers } = useContext(MapContext)
  const [zoom] = useParam(zoomParam)
  const location = useLocation()
  const history = useHistory()
  const { buildQueryString } = useBuildQueryString()

  const { setPositionFromSnapPoint } = useContext(MapPanelContext)

  async function handleMapClick(e: LeafletMouseEvent) {
    const layers = legendLeafletLayers
      .filter(({ layer }) => layer.detailUrl && zoom >= layer.minZoom)
      .map(({ layer }) => layer)

    const nearestDetail =
      layers.length > 0
        ? await fetchNearestDetail(
            { latitude: e.latlng.lat, longitude: e.latlng.lng },
            layers,
            zoom,
          )
        : null

    if (nearestDetail) {
      const { type, subType, id } = nearestDetail

      history.push({
        ...toDataDetail({ type, subtype: subType ?? '', id }),
        search: location.search,
      })
    } else {
      history.push({
        pathname: routing.dataSearchGeo_TEMP.path,
        search: buildQueryString([[locationParam, e.latlng]]),
      })
    }
  }

  useLeafletMapEventHandler(
    {
      click: async (event) => {
        setPositionFromSnapPoint(SnapPoint.Halfway)
        await handleMapClick(event)
      },
    },
    [location, legendLeafletLayers],
  )

  return position &&
    !matchPath(location.pathname, { path: routing.dataDetail_TEMP.path, exact: true }) ? (
    <ARMMarker latLng={position} />
  ) : null
}

export default MapSearchMarker
