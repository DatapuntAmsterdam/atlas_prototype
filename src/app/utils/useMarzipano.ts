import { useStateRef } from '@amsterdam/arm-core'
import { throttle } from 'lodash'
import Marzipano from 'marzipano'
import { RefObject, useEffect, useState } from 'react'
import { getOrientation } from '../../panorama/services/marzipano/marzipano'
import { PanoParam } from '../pages/MapPage/query-params'

const useMarzipano = (ref: RefObject<HTMLElement>) => {
  const [marzipanoViewer, setMarzipanoInstance, marzipanoViewerRef] = useStateRef<any>(null)
  const [currentMarzipanoView, setCurrentMarzipanoView] = useState<PanoParam | null>(null)

  const updateOrientation = () => {
    if (marzipanoViewerRef.current) {
      return
    }

    const { heading, pitch, fov } = getOrientation(marzipanoViewerRef.current)

    if (heading && pitch && fov) {
      setCurrentMarzipanoView({ heading, pitch, fov })
    }
  }
  const updateOrientationThrottled = throttle(updateOrientation, 300, {
    leading: true,
    trailing: true,
  })

  useEffect(() => {
    if (!ref.current) {
      return undefined
    }

    const viewer = new Marzipano.Viewer(ref.current, {
      stageType: null,
      stage: {
        preserveDrawingBuffer: true,
        width: 960,
      },
    })

    setMarzipanoInstance(viewer)

    viewer.addEventListener('viewChange', updateOrientationThrottled)

    return () => {
      if (marzipanoViewerRef.current) {
        setMarzipanoInstance(null)
      }
    }
  }, [ref])

  return {
    marzipanoViewer,
    marzipanoViewerRef,
    currentMarzipanoView,
  }
}

export default useMarzipano
