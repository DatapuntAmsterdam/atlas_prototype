import React from 'react'
import RouterLink from 'redux-first-router-link'
import styled from '@datapunt/asc-core'
import {
  Link,
  Footer,
  FooterBottom,
  FooterBottomLinkList,
  FooterContent,
  FooterHeading,
  FooterLinkList,
  FooterBottomLinkListItem,
  FooterLinkListItem,
  FooterToggle,
  FooterTop,
  Row,
  Column,
  Paragraph,
} from '@datapunt/asc-ui'
import { routing } from '../../routes'

const RouterLinkWrapper = ({ to, className, children }) => (
  <RouterLink to={to} className={className}>
    {children}
  </RouterLink>
)

const StyledLink = ({ children, ...otherProps }) => (
  <Link $as={RouterLinkWrapper} linkType="with-chevron" gutterBottom={3} {...otherProps}>
    {children}
  </Link>
)

const ProclaimLink = styled(StyledLink)`
  align-self: flex-start;
`

const FollowLinks = () => (
  <FooterLinkList>
    <FooterLinkListItem>
      <Link
        title="Twitter"
        href="https://twitter.com/AmsterdamNL"
        rel="external noopener noreferrer"
        target="_blank"
        variant="with-chevron"
      >
        Twitter
      </Link>
    </FooterLinkListItem>
    <FooterLinkListItem>
      <Link
        title="Facebook"
        href="https://www.facebook.com/gemeenteamsterdam"
        rel="external noopener noreferrer"
        target="_blank"
        variant="with-chevron"
      >
        Facebook
      </Link>
    </FooterLinkListItem>
    <FooterLinkListItem>
      <Link
        title="LinkedIn"
        href="https://www.linkedin.com/company/gemeente-amsterdam"
        rel="external noopener noreferrer"
        target="_blank"
        variant="with-chevron"
      >
        Linkedin
      </Link>
    </FooterLinkListItem>
    <FooterLinkListItem>
      <Link
        title="GitHub"
        href="https://github.com/Amsterdam"
        rel="external noopener noreferrer"
        target="_blank"
        variant="with-chevron"
      >
        GitHub
      </Link>
    </FooterLinkListItem>
  </FooterLinkList>
)

const ProclaimerContent = () => (
  <>
    <Paragraph indent>
      Gemeente Amsterdam biedt met City Data een voorziening waar data voor iedereen beschikbaar
      zijn en hergebruikt mogen worden. De gegevens worden aangeboden door gemeentelijke en externe
      partijen. De eigenaren van deze gegevens zijn primair verantwoordelijk voor de kwaliteit van
      hun gepubliceerde data. Opmerkingen en aanvullingen op de gegevens kunt u {` `}
      <Link
        color="inherit"
        className="c-link--inverse"
        title="Terugmelden"
        href="mailto:terugmelding.basisinformatie@amsterdam.nl"
      >
        melden
      </Link>
      .
    </Paragraph>
    <ProclaimLink
      color="#fff"
      title="Lees de hele proclaimer"
      variant="with-chevron"
      to={{ type: routing.proclaimer.type }}
    >
      Lees de hele proclaimer
    </ProclaimLink>
  </>
)

const FooterComponent = () => (
  <Footer>
    <FooterTop>
      <Row>
        <Column wrap span={{ small: 1, medium: 2, big: 4, large: 8, xLarge: 8 }}>
          <>
            <FooterToggle title="Proclaimer" hideAt="tabletM">
              <FooterContent indent>
                <ProclaimerContent />
              </FooterContent>
            </FooterToggle>
            <FooterContent showAt="tabletM">
              <FooterHeading $as="h3">Proclaimer</FooterHeading>
              <ProclaimerContent />
            </FooterContent>
          </>
        </Column>
        <Column
          wrap
          span={{ small: 1, medium: 2, big: 2, large: 3, xLarge: 3 }}
          push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}
        >
          <>
            <FooterToggle title="Volg de gemeente" hideAt="tabletM">
              <FooterContent indent>
                <FollowLinks />
              </FooterContent>
            </FooterToggle>
            <FooterContent showAt="tabletM">
              <FooterHeading $as="h3">Volg de gemeente</FooterHeading>
              <FollowLinks />
            </FooterContent>
          </>
        </Column>
      </Row>
    </FooterTop>
    <FooterBottom>
      <Row>
        <Column wrap span={{ small: 1, medium: 2, big: 6, large: 10, xLarge: 10 }}>
          <FooterBottomLinkList>
            <FooterBottomLinkListItem>
              <StyledLink to={{ type: routing.proclaimer.type }}>Privacy en cookies</StyledLink>
            </FooterBottomLinkListItem>
          </FooterBottomLinkList>
        </Column>
      </Row>
    </FooterBottom>
  </Footer>
)

export default FooterComponent
