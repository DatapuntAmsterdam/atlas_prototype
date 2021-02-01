import { Spinner, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const DEFAULT_SIZE = 36

export const LOADING_SPINNER_TEST_ID = 'loadingSpinner'

const LoadingSpinner = styled(Spinner).attrs((props) => ({
  size: props.size ?? DEFAULT_SIZE,
  'data-testid': LOADING_SPINNER_TEST_ID,
}))`
  display: flex;
  justify-content: center;
  width: 100%;

  & svg {
    fill: ${themeColor('secondary')};
  }
`

export default LoadingSpinner
