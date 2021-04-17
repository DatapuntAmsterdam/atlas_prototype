import { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner'

const IFrameContainer = styled.div`
  position: relative;
  text-align: center;
  width: 100%;

  & iframe {
    min-height: 100vh;
  }
`

export interface IFrameProps {
  src: string
  title?: string
}

const IFrame: FunctionComponent<IFrameProps> = ({ src, title }) => {
  const [loading, setLoading] = useState(true)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    function onMessage({ data }: MessageEvent) {
      const prefix = 'documentHeight:'

      if (typeof data !== 'string' || !data.includes(prefix)) {
        return
      }

      setHeight(Number(data.split(prefix)[1]))
    }

    window.addEventListener('message', onMessage)

    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <IFrameContainer>
      {loading && <LoadingSpinner data-testid="loadingSpinner" />}
      <iframe
        src={src}
        title={title}
        onLoad={() => setLoading(false)}
        width="100%"
        height={height}
        frameBorder="0"
      />
    </IFrameContainer>
  )
}

export default IFrame
