import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import React from 'react'
import styled from 'styled-components'
import NavigationCard from './NavigationCard'
import navigationLinks from './services/navigationLinks'

const StyledCardContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: ${themeColor('support', 'valid')};
  padding: ${themeSpacing(5)};

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    padding: ${themeSpacing(6)};

    /* Generate the arrow / triangle in the left corner */
    &::before {
      content: '';
      position: absolute;
      height: 0;
      width: 0;
      left: 0;
      top: 0;
      border-style: solid;
      border-width: ${themeSpacing(6, 6)} 0 0;
      border-color: #fff transparent transparent transparent;
    }

    /* Separate content in two columns on tabletM only */
    @media screen and ${breakpoint('max-width', 'laptop')} {
      column-count: 2;
      column-gap: ${themeSpacing(2)};
    }
  }

  // Makes sure the background of this component fills the entire screen width
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    padding-left: 0px;
    padding-right: 0px;

    &::before {
      content: '';
      position: absolute;
      height: 100%;
      width: calc(100vw - ${themeSpacing(2)});
      left: -${themeSpacing(5)};
      top: 0;
      background-color: ${themeColor('support', 'valid')};
    }
  }
`

const NavigationBlock = () => (
  <StyledCardContainer data-test="navigation-block">
    {navigationLinks
      .filter(({ description }) => description) // only the ones with a description
      .sort(({ id: idA }, { id: idB }) => idA - idB) // sort on id
      .map((linkProps) => (
        <NavigationCard key={linkProps.id} {...linkProps} />
      ))}
  </StyledCardContainer>
)

export default NavigationBlock
