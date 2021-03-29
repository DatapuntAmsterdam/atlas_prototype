import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const ButtonBar = styled.div`
  > *:not(:last-of-type) {
    margin-right: ${themeSpacing(4)};
  }
`

export default ButtonBar
