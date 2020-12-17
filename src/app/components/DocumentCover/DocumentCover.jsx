import { Download } from '@amsterdam/asc-assets'
import { breakpoint, Button, Image, Spinner, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import React, { useState } from 'react'
import styled from 'styled-components'
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

// StyledButton.displayName === 'Styled(Component)' since Button is wrapped around forwardRef, so let's set set the displayName manually so we can target it in tests
StyledButton.displayName = 'StyledButton'
StyledImage.displayName = 'StyledImage'

const DocumentCover = ({ imageSrc, onClick, title, description, loading, ...otherProps }) => {
  const [hasErrored, setHasErrored] = useState(false)
  const [imageFromCMS, setImageFromCMS] = useState(imageSrc)

  const handleError = () => {
    setHasErrored(true)
    setImageFromCMS(getImageFromCms(defaultPublicationImage, 600, 0, 'fit'))
  }

  return (
    <DocumentCoverStyle {...otherProps}>
      <DocumentCoverContentStyle>
        <StyledImage
          src={imageFromCMS}
          alt={title}
          onError={!hasErrored ? handleError : undefined}
        />
        <StyledButton
          variant="primary"
          onClick={onClick}
          iconLeft={loading ? <Spinner /> : <Download />}
        >
          {description}
        </StyledButton>
      </DocumentCoverContentStyle>
    </DocumentCoverStyle>
  )
}

export default DocumentCover
