import React from 'react'
import styled from '@datapunt/asc-core'
import {
  Row,
  Column,
  Heading,
  CompactThemeProvider,
  breakpoint,
  themeSpacing,
} from '@datapunt/asc-ui'
import HighlightBlock from '../components/Homepage/HighlightBlock'
import NavigationBlock from '../components/Homepage/NavigationBlock'
import SpecialBlock from '../components/Homepage/SpecialBlock'
import OrganizationBlock from '../components/Homepage/OrganizationBlock'
import AboutBlock from '../components/Homepage/AboutBlock'
import ShareBar from '../components/ShareBar/ShareBar'
import ContentContainer from '../components/ContentContainer/ContentContainer'

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

const HomePage = ({ loading, showError }) => (
  <CompactThemeProvider>
    <ContentContainer>
      <StyledRow valign="flex-start">
        <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <Heading>Uitgelicht</Heading>
        </Column>
        <HighlightColumn wrap span={{ small: 1, medium: 2, big: 6, large: 8, xLarge: 8 }}>
          <HighlightBlock loading={loading} showError={showError} />
        </HighlightColumn>
        <Column span={{ small: 1, medium: 2, big: 6, large: 4, xLarge: 4 }}>
          <NavigationBlock loading={loading} showError={showError} />
        </Column>
      </StyledRow>
      <StyledRow>
        <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <SpecialBlock loading={loading} showError={showError} />
        </Column>
      </StyledRow>
      <StyledRow fullWidth>
        <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <OrganizationBlock loading={loading} showError={showError} />
        </Column>
      </StyledRow>
      <StyledRow>
        <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <AboutBlock loading={loading} showError={showError} />
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
