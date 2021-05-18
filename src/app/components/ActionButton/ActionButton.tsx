import { Button, svgFill, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { FunctionComponent, ReactNode } from 'react'

const StyledButton = styled(Button)`
  border-color: ${themeColor('tint', 'level7')};
  color: ${themeColor('tint', 'level7')};
  background: ${themeColor('tint', 'level1')};
  align-self: flex-start;
  ${svgFill(themeColor('tint', 'level7'))};

  &:hover,
  &:focus {
    outline: 0;
    background: ${themeColor('tint', 'level3')};
  }
`

export interface ActionButtonProps {
  fetching: boolean
  iconLeft: ReactNode
  label: string
  onClick: () => void
}

const ActionButton: FunctionComponent<ActionButtonProps> = ({
  fetching,
  iconLeft,
  label,
  onClick,
  ...otherProps
}) => (
  <StyledButton
    disabled={fetching}
    variant="primaryInverted"
    iconLeft={iconLeft}
    iconSize={12}
    onClick={onClick}
    {...otherProps}
  >
    {label}
  </StyledButton>
)

export default ActionButton
