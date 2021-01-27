import { Alert, Heading, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import styled from 'styled-components'

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(2)};
`

const PanoAlert: FunctionComponent = () => (
  <StyledAlert level="info" dismissible data-testid="panoAlert">
    <Heading forwardedAs="h3">
      Panoramabeelden alleen toegankelijk vanaf een vertrouwd netwerk
    </Heading>
    <Paragraph>
      Momenteel werken we eraan om de panoramabeelden toegankelijk te maken voor het publiek. Wil je
      panoramabeelden zien, dan moet je inloggen op ADW of vanaf een vertrouwd netwerk aanmelden.
    </Paragraph>
  </StyledAlert>
)

export default PanoAlert
