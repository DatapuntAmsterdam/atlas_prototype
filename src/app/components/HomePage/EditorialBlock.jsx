import styled from 'styled-components'
import { breakpoint, CardContainer, Column, Row, styles, themeColor } from '@datapunt/asc-ui'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import useFromCMS from '../../utils/useFromCMS'
import BlockHeading from './BlockHeading'
import ErrorMessage, { ErrorBackgroundCSS } from '../ErrorMessage/ErrorMessage'
import OverviewLink from './OverviewLink'
import EditorialBlockCard from './EditorialBlockCard'

const CardRow = styled.div`
  ${({ showError }) => showError && ErrorBackgroundCSS}

  /* Add border-top to first row of cards when three Cards are shown */
  ${/* sc-selector */ styles.ColumnStyle}:nth-child(-n+3) > ${styles.LinkStyle} {
    border-top: ${themeColor('tint', 'level3')} 1px solid;
  }

  /* Add border-top to first row of cards when two Cards are shown */
  @media screen and ${breakpoint('max-width', 'laptop')} {
    ${/* sc-selector */ styles.ColumnStyle}:nth-child(3) > ${styles.LinkStyle} {
      border-top: none;
    }
  }

  /* Add border-top to first row of cards when one Card is shown */
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    ${/* sc-selector */ styles.ColumnStyle}:nth-child(n+2) > ${styles.LinkStyle} {
      border-top: none;
    }
  }
`

const EditorialBlock = ({ title, list, showMoreProps = {}, showContentType = false }) => {
  const { results, fetchData, loading, error } = useFromCMS(list)

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
    <CardContainer data-test="special-block">
      <Row hasMargin={false}>
        <Column wrap span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <BlockHeading styleAs="h1" forwardedAs="h2">
            {title}
          </BlockHeading>
        </Column>
      </Row>
      <CardRow showError={error}>
        {error && (
          <ErrorMessage
            absolute
            message="Er is een fout opgetreden bij het laden van dit blok."
            buttonLabel="Probeer opnieuw"
            buttonOnClick={fetchData}
          />
        )}
        <Row hasMargin={false}>
          {specials.length
            ? specials.map((special, index) => (
                <Column
                  key={special.key || index}
                  wrap
                  span={{ small: 1, medium: 2, big: 3, large: 4, xLarge: 4 }}
                >
                  <EditorialBlockCard
                    loading={loading}
                    showError={error}
                    {...special}
                    showContentType={showContentType}
                  />
                </Column>
              ))
            : null}
          {/* Todo: temporary fix for 2 or 5 items. hasMargin messes up the grid so columns don't have gutters, so we need to use justify-content="space-between" (default) in the row */}
          {(specials.length === 2 || specials.length === 5) && (
            <Column key="filler" wrap span={{ small: 1, medium: 2, big: 3, large: 4, xLarge: 4 }} />
          )}
        </Row>
      </CardRow>
      {showMoreProps.to && showMoreProps.label && (
        <Row hasMargin={false}>
          <Column wrap span={{ small: 1, medium: 2, big: 3, large: 4, xLarge: 4 }}>
            <OverviewLink
              linkProps={{ to: showMoreProps.to(), forwardedAs: RouterLink }}
              label={showMoreProps.label}
            />
          </Column>
        </Row>
      )}
    </CardContainer>
  )
}

export default EditorialBlock
