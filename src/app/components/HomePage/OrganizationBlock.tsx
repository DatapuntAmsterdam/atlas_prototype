import {
  breakpoint,
  CardContainer,
  Column,
  Heading,
  Row,
  styles,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import usePromise, { isFulfilled, isRejected } from '@amsterdam/use-promise'
import cmsConfig from '../../../shared/config/cms.config'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import OrganizationCard from './OrganizationCard'
import { fetchListFromCms } from '../../utils/fetchFromCms'

const StyledCardContainer = styled(CardContainer)`
  background-color: ${themeColor('tint', 'level2')};
  padding: ${themeSpacing(8, 4)};
`

const StyledRow = styled(Row)<{ showError: boolean }>`
  ${({ showError }) => showError && `justify-content: center;`}

  @media screen and ${breakpoint('max-width', 'laptop')} {
    ${/* sc-selector */ styles.ColumnStyle}:nth-child(-n+2) {
      margin-bottom: ${themeSpacing(8)};
    }
  }

  @media screen and ${breakpoint('max-width', 'mobileL')} {
    ${/* sc-selector */ styles.ColumnStyle}:nth-child(-n+3) {
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

const OrganizationBlock: FunctionComponent = () => {
  const [retryCount, setRetryCount] = useState(0)

  const result = usePromise(
    () =>
      fetchListFromCms(cmsConfig.HOME_ORGANIZATION.endpoint(), cmsConfig.HOME_ORGANIZATION.fields),
    [retryCount],
  )

  return (
    <StyledCardContainer data-test="organization-block">
      <Row hasMargin={false}>
        <StyledHeading forwardedAs="h2" styleAs="h1">
          Onderzoek, Informatie en Statistiek
        </StyledHeading>
      </Row>
      <StyledRow hasMargin={false} showError={isRejected(result)}>
        {isRejected(result) && (
          <ErrorMessage
            message="Er is een fout opgetreden bij het laden van dit blok."
            buttonLabel="Probeer opnieuw"
            buttonOnClick={() => setRetryCount(retryCount + 1)}
          />
        )}
        {isFulfilled(result) && result.value.length
          ? result.value.map((field) => (
              <Column
                key={field.key}
                wrap
                span={{ small: 1, medium: 1, big: 3, large: 3, xLarge: 3 }}
              >
                <OrganizationCard loading={false} {...field} />
              </Column>
            ))
          : null}
      </StyledRow>
    </StyledCardContainer>
  )
}

export default OrganizationBlock
