import { ascDefaultTheme, breakpoint, Theme, themeColor } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

const GAP = ascDefaultTheme.spacing * 6

type Size = [number, number]
export type SizeOnBreakpoint = { [key in keyof Partial<Theme.BreakpointsInterface>]: Size }

export type Props = {
  grid?: SizeOnBreakpoint
}

type TileGridItemProps = {
  span?: SizeOnBreakpoint
}

export const TileGridItem = styled.div<TileGridItemProps>`
  // Begin IE11 rules
  display: flex;
  flex-shrink: 0;
  flex-basis: calc(100%);
  position: relative;

  & > * {
    border: ${GAP}px solid ${themeColor('tint', 'level1')};
    border-top: none;
  }

  &:nth-of-type(1n) > * {
    border-left: none;
  }

  &:nth-of-type(1) > * {
    border-right: none;
  }

  @media screen and ${breakpoint('min-width', 'tabletS')} {
    flex-basis: calc(50%);
  }

  @media screen and ${breakpoint('min-width', 'laptop')} {
    flex-basis: calc(100% / 4);

    &:nth-of-type(2n) > * {
      border-right: ${GAP}px solid white;
    }

    &:nth-of-type(5) > * {
      border-right: 0;
    }
  }

  // End IE11 rules
  min-height: 250px;

  @supports (display: grid) {
    position: relative;
    width: 100%;
    display: block;
    margin-right: initial;
    margin-bottom: initial;
    height: 100%;
    flex-shrink: initial;
    & > * {
      border: none !important;
    }

    ${({ span }) =>
      span &&
      Object.entries(span).map(
        ([brkPoint, size]: [any, any]) => css`
          @media screen and ${breakpoint('min-width', brkPoint)} {
            grid-column: span ${size[1]};
            grid-row: span ${size[0]};
            ${size[1] === 2 &&
            css`
              &:before {
                padding-top: 50%;
              }
            `}
          }
        `,
      )}
  }
`

export default styled.div<Props>`
  // Begin IE 11 rules
  display: flex;
  flex-wrap: wrap;
  height: 50%;
  width: 100%;
  // End IE 11 rules

  @supports (display: grid) {
    display: grid;
    height: initial;
    grid-column-gap: ${GAP}px;
    grid-row-gap: ${GAP}px;

    ${({ grid }) =>
      grid &&
      Object.entries(grid).map(
        ([brkPoint, size]: [any, any]) => css`
          @media screen and ${breakpoint('min-width', brkPoint)} {
            grid-template-rows: repeat(${size[0]}, 1fr);
            grid-template-columns: repeat(${size[1]}, 1fr);
          }
        `,
      )}
  }
`
