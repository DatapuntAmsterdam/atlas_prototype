import { Heading, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { ComponentProps, FunctionComponent } from 'react'

const StyledHeading = styled(Heading)`
  color: ${themeColor('secondary')};
  margin-bottom: 0.2em;
  max-width: calc(100% - 50px); // In case there's a infobox button
`

const DetailHeading: FunctionComponent<ComponentProps<typeof Heading>> = ({
  children,
  ...otherProps
}) => (
  <StyledHeading data-testid="data-detail-subheading" forwardedAs="h4" styleAs="h2" {...otherProps}>
    {children}
  </StyledHeading>
)

export default DetailHeading
