import { Alert, Heading, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import LoginLink from '../Links/LoginLink/LoginLink'

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(2)};
`

const PanoAlert: FunctionComponent = () => (
  <StyledAlert level="info" dismissible data-testid="panoAlert">
    <Heading forwardedAs="h3">Meer resultaten na inloggen</Heading>
    <Paragraph>
      Momenteel werken we aan het verbeteren van de onherkenbaarheid van personen in de
      panoramabeelden. Daarom zijn deze tijdelijk niet beschikbaar voor het publiek.
      Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om de panoramabeelden in te
      zien.
    </Paragraph>
    <LoginLink />
  </StyledAlert>
)

export default PanoAlert
