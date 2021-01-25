import { useEffect, useState } from 'react'
import { fetchWithToken } from '../../shared/services/api/api'
import environment from '../../environment'
import { PANORAMA_CONFIG } from '../../panorama/services/panorama-api/panorama-api'
import { ForbiddenError } from '../../shared/services/api/customError'

const useCheckPanoramaPermission = () => {
  const [showComponent, setShowComponent] = useState(false)
  const [isForbidden, setIsForbidden] = useState(false)
  const [hasGenericError, setHasGenericError] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        await fetchWithToken(
          `${environment.API_ROOT}${PANORAMA_CONFIG.PANORAMA_ENDPOINT_PREFIX}/TMX7316010203-001187_pano_0000_001517/adjacencies/?newest_in_range=true&tags=mission-bi`,
        )
        setShowComponent(true)
      } catch (e) {
        if (e instanceof ForbiddenError) {
          setIsForbidden(true)
        } else {
          setHasGenericError(true)
        }
      }
    })()
  }, [])

  return {
    showComponent,
    isForbidden,
    hasGenericError,
  }
}

export default useCheckPanoramaPermission
