import { FunctionComponent } from 'react'
import styled from 'styled-components'

const DefinitionListWrapper = styled.dl`
  width: 100%;
`

const DefinitionList: FunctionComponent = ({ children, ...otherProps }) => (
  <DefinitionListWrapper {...otherProps}>{children}</DefinitionListWrapper>
)

export default DefinitionList
