import { Viewer } from 'openseadragon'
import { useCallback, useEffect, useState } from 'react'
import type { EventHandler, Options, ViewerEvent } from 'openseadragon'
import type { FunctionComponent, RefCallback } from 'react'
import useBindHandler from './useBindHandler'

export interface OSDViewerProps {
  options: Options
  onInit?: (viewer: Viewer) => void
  onOpen?: EventHandler<ViewerEvent>
  onOpenFailed?: EventHandler<ViewerEvent>
  onPageChange?: EventHandler<ViewerEvent>
}

const OSDViewer: FunctionComponent<OSDViewerProps> = ({
  options,
  onInit,
  onOpen,
  onOpenFailed,
  onPageChange,
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
  useBindHandler('page', viewer, onPageChange)

  return <div ref={viewerRef} {...otherProps} />
}

export default OSDViewer
