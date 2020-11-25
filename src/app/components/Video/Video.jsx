/* eslint-disable jsx-a11y/media-has-caption */

import React from 'react'
import PropTypes from 'prop-types'

class Video extends React.Component {
  constructor(...options) {
    super(...options)

    this.playPromise = undefined
  }

  componentDidUpdate(prevProps) {
    const { videoPlayer, props } = this
    const { play, position } = props

    // Determine to play or pause the player
    if (prevProps.play !== play) {
      if (play) {
        this.playPromise = videoPlayer.play()
      } else if (this.playPromise !== undefined) {
        this.playPromise.then(() => {
          videoPlayer.pause()
        })
      } else {
        videoPlayer.pause()
      }
    }

    // Player position
    if (videoPlayer.currentTime !== position) {
      videoPlayer.currentTime = position
    }
  }

  render() {
    const { src, poster, type, showControls, children } = this.props
    return (
      <video
        crossOrigin="anonymous"
        ref={(c) => {
          this.videoPlayer = c
        }}
        preload="metadata"
        muted={false}
        className="c-video__element"
        poster={poster}
        controls={showControls}
      >
        <source
          {...{
            src,
            type,
          }}
        />
        {children}
      </video>
    )
  }
}

Video.defaultProps = {
  play: false,
  position: 0,
  showControls: false,
  type: '',
  poster: '',
}

Video.propTypes = {
  src: PropTypes.string.isRequired,
  type: PropTypes.string,
  poster: PropTypes.string,
  play: PropTypes.bool,
  showControls: PropTypes.bool,
  position: PropTypes.number,
}

export default Video
