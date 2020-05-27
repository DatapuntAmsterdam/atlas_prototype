import React from 'react'
import MapPreviewPanel from '../../../map/containers/preview-panel/MapPreviewPanel'
import MapContext from './MapContext'
import fetchDetail from '../../../map/services/map-detail/map-detail'

const MapPreviewPanelContainer = () => {
  const { detailUrl, setGeometry } = React.useContext(MapContext)
  const [detail, setDetail] = React.useState({})

  const getDetail = React.useCallback(async (endpoint, user = {}) => {
    const detailResult = await fetchDetail(endpoint, user)

    if (detailResult) setDetail(detailResult)
    if (detailResult?.geometrie) setGeometry(detailResult.geometrie)
    
  }, [])

  React.useEffect(() => {
    getDetail(detailUrl)
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





