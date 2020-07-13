import React from 'react'
import styled from 'styled-components'
import setIframeSize from '../../../shared/services/set-iframe-size/setIframeSize'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const IFrameContainer = styled.div`
  position: relative;
  text-align: center;
  width: 100%;

  & iframe {
    min-height: 100vh; // this is an arbitrary number as we don't know the size of all iframes that don't send an event message with their height
  }
`

const IFrame = ({ contentLink, title }) => {
  const [iframeLoading, setIframeLoading] = React.useState(true)
  const [iframeHeight, setIframeHeight] = React.useState(0)
  const iframeRef = React.useRef(null)

  const handleResize = () => {
    setIframeSize(setIframeHeight)
  }

  const iframeLoaded = () => {
    setIframeLoading(false)

    // Handle resize after the iframe is loaded
    handleResize(setIframeHeight)
  }

  React.useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  React.useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.height = `${iframeHeight}px`
    }
  }, [iframeHeight])

  return (
    <IFrameContainer>
      {iframeLoading && <LoadingSpinner />}
      {contentLink && contentLink.uri && (
        <iframe
          src={contentLink.uri}
          title={title}
          ref={iframeRef}
          onLoad={iframeLoaded}
          width="100%"
          height={iframeHeight}
          frameBorder="0"
        />
      )}
    </IFrameContainer>
  )
}

export default IFrame
