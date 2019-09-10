import React from 'react'
import PropTypes from 'prop-types'
import styled from '@datapunt/asc-core'
import { breakpoint } from '@datapunt/asc-ui'

const StyledContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: white;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    margin-top: 54px;
    margin-bottom: 70px;
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
