import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import Star from '../../../shared/assets/icons/star.svg'

const StyledStar = styled.span`
  display: inline-flex;
  width: 20px;
  height: 20px;
  margin-right: ${themeSpacing(1)};

  svg {
    height: 100%;
    width: 100%;
  }
`

const EmptyStar = styled(StyledStar)`
  svg {
    fill: ${themeColor('tint', 'level3')};
  }
`

interface RatingProps {
  max?: number
  defaultValue: number
}

const DEFAULT_MAX = 5

const Rating: FunctionComponent<RatingProps> = ({ max, defaultValue }) => {
  const maxValue = max ?? DEFAULT_MAX
  if (maxValue < 1) {
    // eslint-disable-next-line no-console
    console.warn('"max" prop for Rating component should be bigger than 0')
  } else if (defaultValue > maxValue) {
    // eslint-disable-next-line no-console
    console.warn('"defaultValue" prop for Rating component exceeds the given max')
  }
  const nrOfEmptyStars = maxValue - defaultValue

  // Default to 0 in case defaultValue exceeds max value
  const emptyStars = Array.from(Array(nrOfEmptyStars > 0 ? nrOfEmptyStars : 0).keys())
  const filledStart = Array.from(Array(defaultValue).keys())
  return (
    <span aria-label={`${defaultValue} van ${maxValue}`}>
      {filledStart.map((value) => (
        <StyledStar key={value} data-testid="filledStar">
          <Star />
        </StyledStar>
      ))}
      {emptyStars.map((value) => (
        <EmptyStar key={value} data-testid="emptyStar">
          <Star aria-hidden="true" />
        </EmptyStar>
      ))}
    </span>
  )
}

export default Rating
