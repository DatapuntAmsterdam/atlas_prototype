import { FunctionComponent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ContentLink } from '../../../normalizations/cms/types'
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

export interface IFrameProps {
  contentLink: ContentLink
  title?: string
}

const IFrame: FunctionComponent<IFrameProps> = ({ contentLink, title }) => {
  const [iframeLoading, setIframeLoading] = useState(true)
  const [iframeHeight, setIframeHeight] = useState('0')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleResize = () => {
    setIframeSize(setIframeHeight)
  }

  const iframeLoaded = () => {
    setIframeLoading(false)

    // Handle resize after the iframe is loaded
    handleResize()
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.height = `${iframeHeight}px`
    }
  }, [iframeHeight])

  return (
    <IFrameContainer>
      {iframeLoading && <LoadingSpinner />}
      <iframe
        src={contentLink.uri}
        title={title}
        ref={iframeRef}
        onLoad={iframeLoaded}
        width="100%"
        height={iframeHeight}
        frameBorder="0"
      />
    </IFrameContainer>
  )
}

export default IFrame
