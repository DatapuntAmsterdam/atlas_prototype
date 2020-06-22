import React from 'react'
import { themeSpacing } from '@datapunt/asc-ui'
import styled from 'styled-components'

const DefinitionListWrapper = styled.dl`
  width: 100%;
  margin-bottom: ${themeSpacing(2)};
`

const DefinitionList: React.FC = ({ children }) => (
  <DefinitionListWrapper>{children}</DefinitionListWrapper>
)

export default DefinitionList
