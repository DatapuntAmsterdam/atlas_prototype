import React from 'react'
import MapPreviewPanel from '../../../map/containers/preview-panel/MapPreviewPanel'
import MapContext from './MapContext'
import fetchDetail from '../../../map/services/map-detail/map-detail'

const MapPreviewPanelContainer: React.FC = () => {
  const { detailUrl, setGeometry } = React.useContext(MapContext)
  const [detail, setDetail] = React.useState({})

  const getDetail = React.useCallback(async (endpoint: string, user = {}) => {
    const detailResult = await fetchDetail(endpoint, user)

    const geometry = detailResult?.geometrie || detailResult?.geometry

    if (detailResult) setDetail(detailResult)
    if (geometry) setGeometry(geometry)
  }, [])

  React.useEffect(() => {
    if (detailUrl) getDetail(detailUrl)
  }, [detailUrl])

  return (
    <MapPreviewPanel
      detail={detail}
      detailResult={detail}
      mapDetail={{
        isLoading: false,
      }}
      openPano={() => {}}
      detailLocation={[]}
    />
  )
}

export default MapPreviewPanelContainer
