import styled from '@datapunt/asc-core'
import {
  breakpoint,
  CardContainer,
  Column,
  Heading,
  Row,
  styles,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import cmsConfig from '../../../shared/config/cms.config'
import { toSpecialOverview } from '../../../store/redux-first-router/actions'
import useFromCMS from '../../utils/useFromCMS'
import ErrorMessage, { ErrorBackgroundCSS } from './ErrorMessage'
import OverviewLink from './OverviewLink'
import SpecialCard from './SpecialCard'

const StyledRow = styled(Row)`
  ${({ showError }) => showError && ErrorBackgroundCSS}

  /* Add border-top to first row of cards when three SpecialCards are shown */
  ${/* sc-selector */ styles.ColumnStyle}:nth-child(-n+3) > ${styles.LinkStyle} {
    border-top: ${themeColor('tint', 'level3')} 1px solid;
  }

  /* Add border-top to first row of cards when two SpecialCards are shown */
  @media screen and ${breakpoint('max-width', 'laptop')} {
    ${/* sc-selector */ styles.ColumnStyle}:nth-child(3) > ${styles.LinkStyle} {
      border-top: none;
    }
  }

  /* Add border-top to first row of cards when one SpecialCard is shown */
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    ${/* sc-selector */ styles.ColumnStyle}:nth-child(n+2) > ${styles.LinkStyle} {
      border-top: none;
    }
  }
`

const StyledHeading = styled(Heading)`
  @media screen and ${breakpoint('max-width', 'laptopL')} {
    margin-bottom: ${themeSpacing(4)};
  }

  @media screen and ${breakpoint('min-width', 'laptopL')} {
    margin-bottom: ${themeSpacing(6)};
  }
`

const SpecialsBlock = ({ ...otherProps }) => {
  const { results, fetchData, loading, error } = useFromCMS(cmsConfig.HOME_SPECIALS, undefined)

  React.useEffect(() => {
    ;(async () => {
      await fetchData()
    })()
  }, [])

  const specials =
    results ||
    Array(6)
      .fill(null)
      .map((x, i) => i)

  return (
    <CardContainer {...otherProps}>
      <Row hasMargin={false}>
        <Column wrap span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <StyledHeading $as="h1">In Beeld</StyledHeading>
        </Column>
      </Row>
      <StyledRow hasMargin={false} showError={error}>
        {error && <ErrorMessage />}
        {specials &&
          specials.map((special, index) => (
            <Column
              key={special.key || index}
              wrap
              span={{ small: 1, medium: 2, big: 3, large: 4, xLarge: 4 }}
            >
              <SpecialCard loading={loading} showError={error} {...special} />
            </Column>
          ))}
      </StyledRow>
      <Row hasMargin={false}>
        <Column wrap span={{ small: 1, medium: 2, big: 3, large: 4, xLarge: 4 }}>
          <OverviewLink to={toSpecialOverview()} $as={RouterLink} label="Bekijk overzicht" />
        </Column>
      </Row>
    </CardContainer>
  )
}

export default SpecialsBlock
