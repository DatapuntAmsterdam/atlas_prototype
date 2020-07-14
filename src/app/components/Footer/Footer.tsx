import {
  Column,
  CompactThemeProvider,
  Footer as FooterComponent,
  FooterBottom,
  FooterSection,
  FooterTop,
  Link,
  List,
  ListItem,
  Paragraph,
  Row,
  themeSpacing,
} from '@datapunt/asc-ui'
import React from 'react'
import styled from 'styled-components'
import { FOOTER_LINKS } from '../../../shared/config/config'
import { openFeedbackForm } from '../Modal/FeedbackModal'
import FooterLinks, { FooterLink } from './FooterLinks'

const StyledLink = styled(Link)`
  margin-bottom: ${themeSpacing(3)};
`

const StyledParagraph = styled(Paragraph)`
  margin-bottom: ${themeSpacing(5)};
`

const helpLinks: FooterLink[] = [
  ...FOOTER_LINKS.HELP,
  {
    order: 3,
    title: 'Feedback geven',
    id: 'feedback_3',
    onClick: openFeedbackForm,
  },
].sort((a, b) => (a.order > b.order ? 1 : -1))

const Footer: React.FC = () => (
  <CompactThemeProvider>
    <FooterComponent>
      <FooterTop>
        <Row>
          <Column wrap span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}>
            <FooterSection title="Colofon">
              {FOOTER_LINKS && <FooterLinks links={FOOTER_LINKS.COLOFON} />}
            </FooterSection>
          </Column>
          <Column wrap span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}>
            <FooterSection title="Volg de gemeente">
              {FOOTER_LINKS && <FooterLinks links={FOOTER_LINKS.SOCIAL} />}
            </FooterSection>
          </Column>
          <Column wrap span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}>
            <FooterSection title="Vragen">
              <StyledParagraph>
                Heeft u een vraag en kunt u het antwoord niet vinden op deze website? Of heeft u
                bevindingen? Neem dan contact met ons op.
              </StyledParagraph>
              {FOOTER_LINKS && <FooterLinks links={helpLinks} />}
            </FooterSection>
          </Column>
        </Row>
      </FooterTop>
      <FooterBottom>
        <List>
          <ListItem>
            <StyledLink variant="with-chevron" {...FOOTER_LINKS.PRIVACY}>
              {FOOTER_LINKS.PRIVACY.title}
            </StyledLink>
          </ListItem>
        </List>
      </FooterBottom>
    </FooterComponent>
  </CompactThemeProvider>
)

export default Footer
