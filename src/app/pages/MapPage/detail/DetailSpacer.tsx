import styled from 'styled-components'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'

const DetailSpacer = styled.div`
  width: 100%;
  margin: ${themeSpacing(2, 0)};
  border-bottom: 3px solid ${themeColor('tint', 'level2')};
`

export default DetailSpacer
