import React from 'react'
import styled from 'styled-components'

const DefinitionListWrapper = styled.dl`
  width: 100%;
`

const DefinitionList: React.FC = ({ children }) => (
  <DefinitionListWrapper>{children}</DefinitionListWrapper>
)

export default DefinitionList
