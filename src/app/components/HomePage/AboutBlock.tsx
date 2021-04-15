import { breakpoint, Column, Heading, Row, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import usePromise, { isFulfilled, isPending, isRejected } from '@amsterdam/use-promise'
import { FunctionComponent, useState } from 'react'
import styled, { css } from 'styled-components'
import cmsConfig from '../../../shared/config/cms.config'
import { fetchListFromCms } from '../../utils/fetchFromCms'
import ErrorMessage, { ErrorBackgroundCSS } from '../ErrorMessage/ErrorMessage'
import AboutCard from './AboutCard'

const AboutBlockStyle = styled.div`
  width: 100%;
`

const StyledCardColumn = styled(Column)`
  @media screen and ${breakpoint('max-width', 'laptop')} {
    margin-bottom: ${themeSpacing(6)};
  }

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    margin-bottom: ${themeSpacing(4)};
  }
`

const StyledRow = styled(Row)<{ showError: boolean }>`
  ${({ showError, theme }) =>
    showError &&
    css`
      margin: 0;
      padding: ${themeSpacing(5)};
      background-color: ${themeColor('tint', 'level4')({ theme })};
      justify-content: center;
      ${ErrorBackgroundCSS};
    `}
  margin: 0;
  height: 100%; // make sure the AboutCards have the same size in both Columns

  @media screen and ${breakpoint('max-width', 'laptop')} {
    margin-bottom: ${themeSpacing(4)};

    @media screen and ${breakpoint('max-width', 'tabletM')} {
      margin-bottom: ${themeSpacing(6)};
    }
  }
`

const StyledColumn = styled(Column)`
  flex-direction: column;
  border-top: 4px solid ${themeColor('tint', 'level3')};
  padding-top: ${themeSpacing(4)};

  // Don't add a margin-bottom rule on the last StyledCardColumn and StyledRow components
  &:last-child {
    ${StyledCardColumn}:last-child {
      margin-bottom: 0;
    }

    @media screen and ${breakpoint('min-width', 'tabletM')} {
      ${StyledCardColumn} {
        margin-bottom: 0;
      }
    }

    ${StyledRow} {
      margin-bottom: 0;
    }
  }
`

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(6)};
`

const AboutBlock: FunctionComponent = () => {
  const [retryCount, setRetryCount] = useState(0)

  // TODO: Combine these Promises using something like Promise.all()
  const resultAbout = usePromise(
    () => fetchListFromCms(cmsConfig.HOME_ABOUT.endpoint(), cmsConfig.HOME_ABOUT.fields),
    [retryCount],
  )

  const resultAboutData = usePromise(
    () => fetchListFromCms(cmsConfig.HOME_ABOUT_DATA.endpoint(), cmsConfig.HOME_ABOUT_DATA.fields),
    [retryCount],
  )

  // TODO: There is now no loading state when both Promises are pending, we need to add one.
  return (
    <AboutBlockStyle data-test="about-block">
      <Row hasMargin={false}>
        <StyledColumn span={{ small: 1, medium: 2, big: 6, large: 6, xLarge: 6 }}>
          <StyledHeading forwardedAs="h2" styleAs="h1">
            Over data
          </StyledHeading>

          <StyledRow hasMargin={false} showError={isRejected(resultAboutData)}>
            {isRejected(resultAboutData) && (
              <ErrorMessage
                message="Er is een fout opgetreden bij het laden van dit blok."
                buttonLabel="Probeer opnieuw"
                buttonOnClick={() => setRetryCount(retryCount + 1)}
              />
            )}
            {isFulfilled(resultAboutData) &&
              resultAboutData.value.map((aboutData, index) => (
                <StyledCardColumn
                  wrap
                  key={aboutData.key || index}
                  span={{ small: 1, medium: 2, big: 3, large: 3, xLarge: 3 }}
                >
                  {
                    // TODO: Props should not be spread here, but instead be passed as a single value.
                  }
                  <AboutCard loading={isPending(resultAbout)} {...aboutData} />
                </StyledCardColumn>
              ))}
          </StyledRow>
        </StyledColumn>
        <StyledColumn span={{ small: 1, medium: 2, big: 6, large: 6, xLarge: 6 }}>
          <StyledHeading forwardedAs="h2" styleAs="h1">
            Over deze site
          </StyledHeading>

          <StyledRow hasMargin={false} showError={isRejected(resultAbout)}>
            {isRejected(resultAbout) && (
              <ErrorMessage
                message="Er is een fout opgetreden bij het laden van dit blok."
                buttonLabel="Probeer opnieuw"
                buttonOnClick={() => setRetryCount(retryCount + 1)}
              />
            )}
            {isFulfilled(resultAbout) &&
              resultAbout.value.map((about, index) => (
                <StyledCardColumn
                  wrap
                  key={about.key || index}
                  span={{ small: 1, medium: 2, big: 3, large: 3, xLarge: 3 }}
                >
                  {
                    // TODO: Props should not be spread here, but instead be passed as a single value.
                  }
                  <AboutCard loading={isPending(resultAboutData)} {...about} />
                </StyledCardColumn>
              ))}
          </StyledRow>
        </StyledColumn>
      </Row>
    </AboutBlockStyle>
  )
}

export default AboutBlock
