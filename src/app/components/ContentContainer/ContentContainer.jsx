import { breakpoint, themeSpacing } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const StyledContainer = styled.div`
  width: 100%;
  padding-top: ${themeSpacing(4)};
  padding-bottom: ${themeSpacing(4)};
  background-color: white;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    padding-top: ${themeSpacing(14)};
    padding-bottom: ${themeSpacing(18)};
  }
`

const ContentContainer = ({ children, className }) => (
  <StyledContainer className={className}>{children}</StyledContainer>
)

ContentContainer.defaultProps = {
  className: 'content-container',
}

ContentContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default ContentContainer
