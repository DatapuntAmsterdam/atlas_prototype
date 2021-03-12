import { EventHandler, Viewer, ViewerEvent, ViewerEventName } from 'openseadragon'
import { useEffect } from 'react'

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
