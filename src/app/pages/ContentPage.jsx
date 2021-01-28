import { Column, Heading, Link, Paragraph, Row, themeSpacing } from '@amsterdam/asc-ui'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import ContentContainer from '../components/ContentContainer/ContentContainer'
import ShareBar from '../components/ShareBar/ShareBar'
import { toHome } from '../links'

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(5)};
`

const ContentPage = ({ title, children }) => (
  <ContentContainer>
    <Row>
      <Column
        span={{ small: 1, medium: 2, big: 6, large: 8, xLarge: 8 }}
        push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}
      >
        <div>
          <StyledHeading>{title}</StyledHeading>
          {children}
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

export default ContentPage
