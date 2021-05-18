import { breakpoint, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'

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

export interface ContentContainerProps {
  className?: string
}

const ContentContainer: FunctionComponent<ContentContainerProps> = ({ children, className }) => (
  <StyledContainer className={className}>{children}</StyledContainer>
)

ContentContainer.defaultProps = {
  className: 'content-container',
}

export default ContentContainer
