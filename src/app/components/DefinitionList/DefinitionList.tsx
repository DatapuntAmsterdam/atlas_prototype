import React from 'react'
import styled from 'styled-components'

const DefinitionListWrapper = styled.dl`
  width: 100%;
`

const DefinitionList: React.FC = ({ children, ...otherProps }) => (
  <DefinitionListWrapper {...otherProps}>{children}</DefinitionListWrapper>
)

export default DefinitionList
