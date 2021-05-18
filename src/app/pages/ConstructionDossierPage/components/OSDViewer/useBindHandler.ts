import { useEffect } from 'react'
import type { EventHandler, Viewer, ViewerEvent, ViewerEventName } from 'openseadragon'

export default function useBindHandler(
  eventName: ViewerEventName,
  viewer: Viewer | null,
  handler?: EventHandler<ViewerEvent>,
) {
  useEffect(() => {
    if (!viewer || !handler) {
      return
    }

    viewer.addHandler(eventName, handler)

    return () => {
      viewer.removeHandler(eventName, handler)
    }
  }, [handler, viewer])
}
