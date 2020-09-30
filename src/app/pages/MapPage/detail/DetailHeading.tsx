import styled from 'styled-components'
import { Heading, themeColor } from '@amsterdam/asc-ui'
import React from 'react'

const StyledHeading = styled(Heading)`
  color: ${themeColor('secondary')};
  margin-bottom: 0.2em;
`

const DetailHeading: React.FC = ({ children, ...otherProps }) => (
  // @ts-ignore
  <StyledHeading forwardedAs="h4" styleAs="h2" {...otherProps}>
    {children}
  </StyledHeading>
)

export default DetailHeading
