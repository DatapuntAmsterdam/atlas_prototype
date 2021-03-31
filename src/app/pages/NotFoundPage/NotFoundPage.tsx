import { Column, Heading, Link, Paragraph, Row, themeSpacing } from '@amsterdam/asc-ui'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import ShareBar from '../../components/ShareBar/ShareBar'
import { toHome } from '../../links'

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(5)};
`

const NotFoundPage = () => (
  <ContentContainer>
    <Row>
      <Column
        span={{ small: 1, medium: 2, big: 6, large: 8, xLarge: 8 }}
        push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}
      >
        <div>
          <StyledHeading>Pagina niet gevonden</StyledHeading>
          <Paragraph>De link die je volgde, werkt niet (meer).</Paragraph>
          <Paragraph>
            Heb je een link, waarvan je niet meer weet over welke pagina die ging? Neem dan{' '}
            <Link variant="inline" href="mailto:datapunt@amsterdam.nl" title="Contact">
              contact
            </Link>{' '}
            op en stuur de oude link. Dan zoeken wij de nieuwe voor je op.
          </Paragraph>
          <Paragraph>
            Of ga door naar de{' '}
            <Link
              as={RouterLink}
              to={toHome()}
              variant="inline"
              title="Naar Data en Informatie - Homepage"
            >
              voorpagina
            </Link>
            .
          </Paragraph>
          <ShareBar />
        </div>
      </Column>
    </Row>
  </ContentContainer>
)

export default NotFoundPage
