/* eslint-disable jsx-a11y/media-has-caption */

import { Component, FunctionComponent, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

interface VideoProps {
  src?: string
  type?: string
  poster?: string
  play?: boolean
  showControls?: boolean
  position?: number
}

const Vidiho: FunctionComponent<VideoProps> = ({
  src,
  poster,
  type,
  showControls,
  children,
  play,
  position,
}) => {
  const videoPlayer = useRef<HTMLVideoElement>(null)

  // useEffect(() => {
  //   // Determine to play or pause the player
  //   if (prevProps.play !== play) {
  //     if (play) {
  //       this.playPromise = videoPlayer.play()
  //     } else if (this.playPromise !== undefined) {
  //       // eslint-disable-next-line no-void
  //       void this.playPromise.then(() => {
  //         videoPlayer.pause()
  //       })
  //     } else {
  //       videoPlayer.pause()
  //     }
  //   }
  //
  //   // Player position
  //   if (videoPlayer.currentTime !== position) {
  //     videoPlayer.currentTime = position
  //   }
  // }, [])

  return (
    <video
      crossOrigin="anonymous"
      ref={videoPlayer}
      preload="metadata"
      muted={false}
      className="c-video__element"
      poster={poster}
      controls={showControls}
    >
      <source src={src} type={type} />
      {children}
    </video>
  )
}

export default Vidiho
