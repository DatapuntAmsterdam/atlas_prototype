import React from 'react'
import RouterLink from 'redux-first-router-link'
import {
  Link,
  Footer as AscFooter,
  FooterBottom,
  FooterBottomLinkList,
  FooterContent,
  FooterHeading,
  FooterBottomLinkListItem,
  FooterToggle,
  FooterTop,
  Row,
  Column,
} from '@datapunt/asc-ui'
import { routing } from '../../routes'
import FollowLinks from './FollowLinks'
import HelpLinks from './HelpLinks'
import ColofonLinks from './ColofonLinks'

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

const Footer = ({ ...otherProps }) => (
  <AscFooter {...otherProps}>
    <FooterTop>
      <Row>
        <Column wrap span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}>
          <FooterToggle title="Colofon" hideAt="tabletM">
            <FooterContent indent>
              <ColofonLinks />
            </FooterContent>
          </FooterToggle>
          <FooterContent showAt="tabletM">
            <FooterHeading $as="h3">Colofon</FooterHeading>
            <ColofonLinks />
          </FooterContent>
        </Column>
        <Column wrap span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}>
          <FooterToggle title="Volg de gemeente" hideAt="tabletM">
            <FooterContent indent>
              <FollowLinks />
            </FooterContent>
          </FooterToggle>
          <FooterContent showAt="tabletM">
            <FooterHeading $as="h3">Volg de gemeente</FooterHeading>
            <FollowLinks />
          </FooterContent>
        </Column>
        <Column wrap span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}>
          <FooterToggle title="Vragen?" hideAt="tabletM">
            <FooterContent indent>
              <HelpLinks />
            </FooterContent>
          </FooterToggle>
          <FooterContent showAt="tabletM">
            <FooterHeading $as="h3" styleAs="h3">
              Vragen?
            </FooterHeading>
            <HelpLinks />
          </FooterContent>
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
  </AscFooter>
)

export default Footer
