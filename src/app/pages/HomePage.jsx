import React from 'react'
import styled from 'styled-components'
import {
  Row,
  Column,
  Heading,
  CompactThemeProvider,
  breakpoint,
  themeSpacing,
} from '@datapunt/asc-ui'
import HighlightBlock from '../components/HomePage/HighlightBlock'
import NavigationBlock from '../components/HomePage/NavigationBlock'
import EditorialBlock from '../components/HomePage/EditorialBlock'
import OrganizationBlock from '../components/HomePage/OrganizationBlock'
import AboutBlock from '../components/HomePage/AboutBlock'
import ShareBar from '../components/ShareBar/ShareBar'
import ContentContainer from '../components/ContentContainer/ContentContainer'
import ThemesBlock from '../components/HomePage/ThemesBlock'
import { cmsConfig } from '../../shared/config/config'
import { toCollectionSearch } from '../../store/redux-first-router/actions'

const HighlightColumn = styled(Column)`
  // aligns the HighlightsBlock with the NavigationBlock
  margin-top: ${themeSpacing(6)};

  @media screen and ${breakpoint('max-width', 'laptop')} {
    margin-bottom: ${themeSpacing(12)};
  }
`

const StyledRow = styled(Row)`
  margin-bottom: ${themeSpacing(18)};

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    margin-bottom: ${themeSpacing(12)};

    ${({ fullWidth }) =>
      fullWidth &&
      `
      padding: 0;
    `}
  }
`

const HomePage = () => (
  <CompactThemeProvider>
    <ContentContainer>
      <StyledRow valign="flex-start">
        <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <Heading as="h2" styleAs="h1">
            Uitgelicht
          </Heading>
        </Column>
        <HighlightColumn wrap span={{ small: 1, medium: 2, big: 6, large: 8, xLarge: 8 }}>
          <HighlightBlock />
        </HighlightColumn>
        <Column span={{ small: 1, medium: 2, big: 6, large: 4, xLarge: 4 }}>
          <NavigationBlock />
        </Column>
      </StyledRow>
      <StyledRow>
        <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <EditorialBlock
            title="Dossiers"
            list={cmsConfig.HOME_COLLECTIONS}
            showMoreProps={{ to: toCollectionSearch, label: 'Overzicht alle dossiers' }}
          />
        </Column>
      </StyledRow>
      <StyledRow>
        <ThemesBlock />
      </StyledRow>
      <StyledRow>
        <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <EditorialBlock title="Meer data" list={cmsConfig.HOME_SPECIALS} showContentType />
        </Column>
      </StyledRow>
      <StyledRow fullWidth>
        <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <OrganizationBlock />
        </Column>
      </StyledRow>
      <StyledRow>
        <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <AboutBlock />
        </Column>
      </StyledRow>
      <StyledRow>
        <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <ShareBar hasPrintButton={false} />
        </Column>
      </StyledRow>
    </ContentContainer>
  </CompactThemeProvider>
)

export default HomePage
