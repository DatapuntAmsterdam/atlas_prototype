import React from 'react'
import styled from '@datapunt/asc-core'
import { Button, svgFill, themeColor } from '@datapunt/asc-ui'
import { Enlarge } from '@datapunt/asc-assets'

const StyledButton = styled(Button)`
  border-color: ${themeColor('tint', 'level7')};
  color: ${themeColor('tint', 'level7')};
  background: ${themeColor('tint', 'level1')};
  ${svgFill('tint', 'level7')};

  &:hover,
  &:focus {
    outline: 0;
    background: ${themeColor('tint', 'level3')};
  }
`

const LoadMoreButton = ({ fetching, onClick }) => (
  <StyledButton
    disabled={fetching}
    variant="primaryInverted"
    iconLeft={<Enlarge />}
    iconSize={12}
    onClick={onClick}
  >
    Toon meer
  </StyledButton>
)

export default LoadMoreButton
