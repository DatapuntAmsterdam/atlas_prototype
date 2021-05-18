import { Download } from '@amsterdam/asc-assets'
import { breakpoint, Button, Image, Spinner, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import getImageFromCms from '../../utils/getImageFromCms'

const defaultPublicationImage = '/sites/default/files/images/default-plaatje-publicatie-OIS.jpg'

const DocumentCoverStyle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: ${themeSpacing(5)};
  background-color: ${themeColor('tint', 'level2')};
`

const DocumentCoverContentStyle = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${themeSpacing(8, 0)};

  @media screen and ${breakpoint('max-width', 'tabletS')} {
    margin: ${themeSpacing(5)};
  }
`

const StyledImage = styled(Image)`
  max-width: 300px;
  margin-bottom: ${themeSpacing(8)};
  width: 100%;

  @media screen and ${breakpoint('max-width', 'tabletS')} {
    max-width: 200px;
    margin-bottom: ${themeSpacing(5)};
  }
`

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
`

export interface DocumentCoverProps {
  imageSrc: string
  title: string
  description: string
  loading: boolean
  onClick: () => void
}

const DocumentCover: FunctionComponent<DocumentCoverProps> = ({
  imageSrc,
  title,
  description,
  loading,
  onClick,
  ...otherProps
}) => {
  const [didError, setDidError] = useState(false)
  const actualSrc = useMemo(
    () => (didError ? getImageFromCms(defaultPublicationImage, 600, 0, 'fit') : imageSrc),
    [didError],
  )

  return (
    <DocumentCoverStyle {...otherProps} data-testid="documentCover">
      <DocumentCoverContentStyle>
        <StyledImage
          data-testid="image"
          src={actualSrc}
          alt={title}
          onError={!didError ? () => setDidError(true) : undefined}
        />
        <StyledButton
          data-testid="button"
          variant="primary"
          onClick={onClick}
          iconLeft={
            loading ? (
              <Spinner data-testid="loading-spinner" />
            ) : (
              <Download data-testid="download-icon" />
            )
          }
        >
          {description}
        </StyledButton>
      </DocumentCoverContentStyle>
    </DocumentCoverStyle>
  )
}

export default DocumentCover
