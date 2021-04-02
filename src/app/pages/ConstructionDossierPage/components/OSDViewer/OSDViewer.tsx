import { EventHandler, Options, Viewer, ViewerEvent } from 'openseadragon'
import { FunctionComponent, RefCallback, useCallback, useEffect, useState } from 'react'
import useBindHandler from './useBindHandler'

export interface OSDViewerProps {
  options: Options
  onInit?: (viewer: Viewer) => void
  onOpen?: EventHandler<ViewerEvent>
  onOpenFailed?: EventHandler<ViewerEvent>
}

const OSDViewer: FunctionComponent<OSDViewerProps> = ({
  options,
  onInit,
  onOpen,
  onOpenFailed,
  ...otherProps
}) => {
  const [viewer, setViewer] = useState<Viewer | null>(null)
  const viewerRef = useCallback<RefCallback<HTMLDivElement>>((element) => {
    if (!element) {
      return
    }

    setViewer(new Viewer({ ...options, element }))
  }, [])

  useEffect(() => {
    if (!viewer) {
      return
    }

    if (onInit) {
      onInit(viewer)
    }

    return () => viewer.destroy()
  }, [viewer])

  useBindHandler('open', viewer, onOpen)
  useBindHandler('open-failed', viewer, onOpenFailed)

  return <div ref={viewerRef} {...otherProps} />
}

export default OSDViewer
