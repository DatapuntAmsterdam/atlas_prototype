import styled, { css } from 'styled-components'
import { breakpoint, Column, Heading, Row, themeColor, themeSpacing } from '@datapunt/asc-ui'
import React from 'react'
import AboutCard from './AboutCard'
import ErrorMessage, { ErrorBackgroundCSS } from '../ErrorMessage/ErrorMessage'
import useFromCMS from '../../utils/useFromCMS'
import { cmsConfig } from '../../../shared/config/config'

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

const StyledRow = styled(Row)`
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

const AboutBlock = () => {
  const {
    results: resultsAbout,
    fetchData: fetchDataAbout,
    loading: loadingAbout,
    error: errorAbout,
  } = useFromCMS(cmsConfig.HOME_ABOUT)
  const {
    results: resultsAboutData,
    fetchData: fetchDataAboutData,
    loading: loadingAboutData,
    error: errorAboutData,
  } = useFromCMS(cmsConfig.HOME_ABOUT_DATA)

  React.useEffect(() => {
    ;(async () => {
      await fetchDataAbout()
      await fetchDataAboutData()
    })()
  }, [])

  return (
    <AboutBlockStyle data-test="about-block">
      <Row hasMargin={false}>
        <StyledColumn span={{ small: 1, medium: 2, big: 6, large: 6, xLarge: 6 }}>
          <StyledHeading forwardedAs="h2" styleAs="h1">
            Over data
          </StyledHeading>

          <StyledRow hasMargin={false} showError={errorAboutData}>
            {errorAboutData && (
              <ErrorMessage
                message="Er is een fout opgetreden bij het laden van dit blok."
                buttonLabel="Probeer opnieuw"
                buttonOnClick={fetchDataAboutData}
              />
            )}
            {resultsAboutData?.length
              ? resultsAboutData.map((aboutData, index) => (
                  <StyledCardColumn
                    wrap
                    key={aboutData.key || index}
                    span={{ small: 1, medium: 2, big: 3, large: 3, xLarge: 3 }}
                  >
                    <AboutCard loading={loadingAboutData} {...aboutData} />
                  </StyledCardColumn>
                ))
              : null}
          </StyledRow>
        </StyledColumn>
        <StyledColumn span={{ small: 1, medium: 2, big: 6, large: 6, xLarge: 6 }}>
          <StyledHeading forwardedAs="h2" styleAs="h1">
            Over deze site
          </StyledHeading>

          <StyledRow hasMargin={false} showError={errorAbout}>
            {errorAbout && (
              <ErrorMessage
                message="Er is een fout opgetreden bij het laden van dit blok."
                buttonLabel="Probeer opnieuw"
                buttonOnClick={fetchDataAbout}
              />
            )}
            {resultsAbout?.length
              ? resultsAbout.map((about, index) => (
                  <StyledCardColumn
                    wrap
                    key={about.key || index}
                    span={{ small: 1, medium: 2, big: 3, large: 3, xLarge: 3 }}
                  >
                    <AboutCard loading={loadingAbout} {...about} />
                  </StyledCardColumn>
                ))
              : null}
          </StyledRow>
        </StyledColumn>
      </Row>
    </AboutBlockStyle>
  )
}

export default AboutBlock
