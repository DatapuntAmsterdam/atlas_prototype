import { FilterBox as ASCFilterBox, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const FilterBox = styled(ASCFilterBox)`
  width: 100%;
  display: flex;
  flex-direction: column;

  & + & {
    margin-top: ${themeSpacing(5)};
  }

  button {
    align-self: flex-start;
  }
`

export default FilterBox
