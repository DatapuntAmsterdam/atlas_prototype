import { Heading, themeColor } from '@amsterdam/asc-ui'
import React, { ComponentProps } from 'react'
import styled from 'styled-components'

const StyledHeading = styled(Heading)`
  color: ${themeColor('secondary')};
  margin-bottom: 0.2em;
  max-width: calc(100% - 50px); // In case there's a infobox button
`

const DetailHeading: React.FC<ComponentProps<typeof Heading>> = ({ children, ...otherProps }) => (
  <StyledHeading data-testid="data-detail-subheading" forwardedAs="h4" styleAs="h2" {...otherProps}>
    {children}
  </StyledHeading>
)

export default DetailHeading
