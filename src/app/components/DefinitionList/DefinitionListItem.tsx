import React from 'react'
import { breakpoint, themeColor, themeSpacing } from '@datapunt/asc-ui'
import styled from 'styled-components'

type Props = {
  term: string
  description: string | number
}

const DefinitionListItemWrapper = styled.div`
  display: flex;
  margin-bottom: ${themeSpacing(2)};
  border-bottom: 1px solid ${themeColor('tint', 'level4')};

  @media screen and ${breakpoint('max-width', 'mobileL')} {
    flex-direction: column;
  }
`

const DefinitionListTerm = styled.dt`
  color: ${themeColor('tint', 'level5')};
  font-weight: 500;
  padding: ${themeSpacing(1, 5)};
  white-space: normal;
  width: 30%;
`

const DefinitionListDescription = styled.dd`
  padding: ${themeSpacing(1, 5)};
  white-space: normal;
  width: 70%;
`

const DefinitionListItem: React.FC<Props> = ({ term, description }) => (
  <DefinitionListItemWrapper>
    <DefinitionListTerm>{term}</DefinitionListTerm>
    <DefinitionListDescription>{description}</DefinitionListDescription>
  </DefinitionListItemWrapper>
)

export default DefinitionListItem
