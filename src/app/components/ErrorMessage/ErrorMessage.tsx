import styled, { css } from 'styled-components'
import { breakpoint, Button, Paragraph, themeColor, themeSpacing } from '@datapunt/asc-ui'
import React from 'react'

const ErrorMessageStyle = styled.div`
  ${({ absolute }: { absolute: boolean }) =>
    absolute &&
    css`
      position: absolute;
      top: ${themeSpacing(14)};
      left: 50%;
      transform: translateX(-50%);

      @media screen and ${breakpoint('min-width', 'tabletM')} {
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    `}

  z-index: 1;
  background-color: white;
  padding: ${themeSpacing(5)};
  border: 1px solid ${themeColor('tint', 'level3')};
  text-align: center;
`

export const ErrorBackgroundCSS = css`
  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: ${themeColor('tint', 'level1')};
    opacity: 0.8;
    width: 100%;
    height: 100%;
  }
`

type ErrorMessageProps = {
  message: string
  buttonOnClick: () => void
  buttonLabel: string
  buttonIcon?: React.ReactNode
  absolute?: boolean
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  buttonLabel,
  buttonOnClick,
  buttonIcon,
  absolute = false,
}) => (
  <ErrorMessageStyle absolute={absolute}>
    <Paragraph>{message}</Paragraph>
    <Button
      type="button"
      onClick={buttonOnClick}
      iconLeft={buttonIcon}
      variant="primary"
      taskflow={false}
    >
      {buttonLabel}
    </Button>
  </ErrorMessageStyle>
)

export default ErrorMessage
