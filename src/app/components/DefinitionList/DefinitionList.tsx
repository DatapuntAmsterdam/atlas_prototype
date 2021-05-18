import styled from 'styled-components'
import type { FunctionComponent } from 'react'

const DefinitionListWrapper = styled.dl`
  width: 100%;
`

const DefinitionList: FunctionComponent = ({ children, ...otherProps }) => (
  <DefinitionListWrapper {...otherProps}>{children}</DefinitionListWrapper>
)

export default DefinitionList
