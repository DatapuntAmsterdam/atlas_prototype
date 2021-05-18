import { breakpoint, Button, Paragraph, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'
import type { FunctionComponent, HTMLAttributes } from 'react'

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

export interface ErrorMessageProps {
  message: string
  buttonOnClick: () => void
  buttonLabel: string
  buttonIcon?: React.ReactNode
  absolute?: boolean
}

export const ERROR_MESSAGE_TEST_ID = 'errorMessage'
export const ERROR_MESSAGE_RELOAD_BUTTON_TEST_ID = 'buttonReload'

const ErrorMessage: FunctionComponent<ErrorMessageProps & HTMLAttributes<HTMLDivElement>> = ({
  message,
  buttonLabel,
  buttonOnClick,
  buttonIcon,
  absolute = false,
  ...otherProps
}) => (
  <ErrorMessageStyle absolute={absolute} {...otherProps} data-testid={ERROR_MESSAGE_TEST_ID}>
    <Paragraph>{message}</Paragraph>
    <Button
      type="button"
      data-testid={ERROR_MESSAGE_RELOAD_BUTTON_TEST_ID}
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
