import { Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const SubHeading = styled(Heading)<{ hasMarginBottom?: boolean }>`
  color: ${themeColor('secondary')};
  margin-bottom: ${({ hasMarginBottom }) => (hasMarginBottom ? themeSpacing(2) : 0)};
  font-weight: bold;
`
export default SubHeading
