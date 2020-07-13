import { Spinner } from '@datapunt/asc-ui'
import styled from 'styled-components'

export const DEFAULT_SIZE = 36

const LoadingSpinner = styled(Spinner).attrs((props) => ({
  size: props.size ?? DEFAULT_SIZE,
}))`
  display: flex;
  justify-content: center;
  width: 100%;
`

export default LoadingSpinner
