import styled from '@datapunt/asc-core'
import {
  breakpoint,
  CardContainer,
  Column,
  Heading,
  Row,
  themeColor,
  themeSpacing,
  styles,
} from '@datapunt/asc-ui'
import React from 'react'
import ErrorMessage from './ErrorMessage'
import OrganizationCard from './OrganizationCard'
import useFromCMS from '../../utils/useFromCMS'
import cmsConfig from '../../../shared/config/cms.config'

const StyledCardContainer = styled(CardContainer)`
  background-color: ${themeColor('tint', 'level2')};
  padding: ${themeSpacing(8, 4)};
`

const StyledRow = styled(Row)`
  ${({ showError }) => showError && `justify-content: center;`}

  @media screen and ${breakpoint('max-width', 'laptop')} {
    ${/* sc-selector */ styles.ColumnStyle}:nth-child(-n+2) {
      margin-bottom: ${themeSpacing(8)};
    }
  }
`

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(4)};

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    margin-bottom: ${themeSpacing(6)};
  }
`

const OrganizationBlock = ({ ...otherProps }) => {
  const { results, fetchData, loading, error } = useFromCMS(cmsConfig.HOME_ORGANIZATION, undefined)

  React.useEffect(() => {
    ;(async () => {
      await fetchData()
    })()
  }, [])

  return (
    <StyledCardContainer {...otherProps}>
      <Row hasMargin={false}>
        <StyledHeading $as="h2" styleAs="h1">
          Onderzoek, Informatie en Statistiek
        </StyledHeading>
      </Row>
      <StyledRow hasMargin={false} showError={error}>
        {error && <ErrorMessage absolute={false} />}
        {results &&
          results.map(result => (
            <Column
              key={result.key}
              wrap
              span={{ small: 1, medium: 1, big: 3, large: 3, xLarge: 3 }}
            >
              <OrganizationCard loading={loading} {...result} />
            </Column>
          ))}
      </StyledRow>
    </StyledCardContainer>
  )
}

export default OrganizationBlock
