import { Heading, themeColor } from '@amsterdam/asc-ui'
import React, { ComponentProps } from 'react'
import styled from 'styled-components'

const StyledHeading = styled(Heading)`
  color: ${themeColor('secondary')};
  margin-bottom: 0.2em;
`

const DetailHeading: React.FC<ComponentProps<typeof Heading>> = ({ children, ...otherProps }) => (
  <StyledHeading forwardedAs="h4" styleAs="h2" {...otherProps}>
    {children}
  </StyledHeading>
)

export default DetailHeading
