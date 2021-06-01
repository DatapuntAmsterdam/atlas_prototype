import { Spinner, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const DEFAULT_SIZE = 36

const LoadingSpinner = styled(Spinner).attrs((props) => ({
  size: props.size ?? DEFAULT_SIZE,
  'data-testid': 'loadingSpinner',
}))`
  display: flex;
  justify-content: center;
  width: 100%;

  & svg {
    fill: ${themeColor('secondary')};
  }
`

export default LoadingSpinner
