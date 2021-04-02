import { Card, CardContent, CardMedia, Image, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import usePromise, { isFulfilled, isPending } from '@amsterdam/use-promise'
import { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components'
import { NOT_FOUND_THUMBNAIL } from '../../../../../shared/config/constants'
import { getAccessToken } from '../../../../../shared/services/auth/auth'

const StyledCard = styled(Card)`
  border: 1px solid ${themeColor('tint', 'level3')};
`

const StyledCardContent = styled(CardContent)`
  overflow-wrap: break-word;
  position: absolute;
  cursor: default;
  bottom: 0;
  left: 0;
  padding: ${themeSpacing(2, 3)};
  min-height: inherit;
  background-color: rgba(255, 255, 255, 0.67);
`

async function getObjectUrl(src: string) {
  const accessToken = getAccessToken()
  const headers = accessToken.length > 0 ? { Authorization: `Bearer ${accessToken}` } : undefined
  const response = await fetch(src, { headers })

  if (!response.ok) {
    throw new Error('Response is not ok.')
  }

  return URL.createObjectURL(await response.blob())
}

export interface IIIFThumbnailProps {
  src: string
  title: string
}

const IIIFThumbnail: FunctionComponent<IIIFThumbnailProps> = ({ src, title }) => {
  const objectUrl = usePromise(() => getObjectUrl(src), [src])

  // Revoke object URL on unmount or refetch.
  useEffect(() => {
    if (!isFulfilled(objectUrl)) {
      return
    }

    return () => URL.revokeObjectURL(objectUrl.value)
  }, [objectUrl])

  return (
    <StyledCard isLoading={isPending(objectUrl)}>
      <CardMedia>
        {!isPending(objectUrl) && (
          <Image
            data-testid="image"
            src={isFulfilled(objectUrl) ? objectUrl.value : NOT_FOUND_THUMBNAIL}
            square
          />
        )}
      </CardMedia>
      <StyledCardContent>{title}</StyledCardContent>
    </StyledCard>
  )
}

export default IIIFThumbnail
