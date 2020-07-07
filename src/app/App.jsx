import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  GlobalStyle,
  ThemeProvider,
  Container,
  themeColor,
  themeSpacing,
  breakpoint,
} from '@datapunt/asc-ui'
import { MatomoProvider } from '@datapunt/matomo-tracker-react'
import {
  Provider as GraphQLProvider,
  createClient,
  cacheExchange,
  fetchExchange,
  dedupExchange,
} from 'urql'
import { isContentPage, isSearchPage, isEditorialDetailPage } from './pages'
import {
  hasOverflowScroll,
  isEmbedded,
  isEmbedPreview,
  isPrintMode,
  isPrintModeLandscape,
  isPrintOrEmbedMode,
} from '../shared/ducks/ui/ui'
import { hasGlobalError } from '../shared/ducks/error/error-message'
import { getPage, isHomepage } from '../store/redux-first-router/selectors'
import Header from './components/Header'
import AppBody from './AppBody'
import { routing } from './routes'
import Footer from './components/Footer/Footer'
import getState from '../shared/services/redux/get-state'
import matomoInstance from './matomo'
import environment from '../environment'

const StyledContainer = styled(Container)`
  min-height: 100%;
  background-color: ${themeColor('tint', 'level1')};
  position: relative;
  display: flex;
  flex-direction: column;

  @media screen and ${breakpoint('min-width', 'laptopM')} {
    margin: 0 ${themeSpacing(6)};
  }
`

const graphQLClient = createClient({
  url: `${environment.GRAPHQL_ENDPOINT}`,
  fetchOptions: () => {
    const token = getState().user.accessToken
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    }
  },
  exchanges: [dedupExchange, cacheExchange, fetchExchange],
  requestPolicy: 'cache-first',
})

function AppWrapper({ children, hasMaxWidth, currentPage, isFullHeight }) {
  const rootClasses = classNames({
    'c-dashboard--max-width': hasMaxWidth,
    'c-dashboard--full-height': isFullHeight,
  })

  // Todo: don't use page types, this will be used
  const pageTypeClass = currentPage.toLowerCase().replace('_', '-')

  return hasMaxWidth ? (
    <StyledContainer beamColor="valid">
      {children}
      <Footer />
    </StyledContainer>
  ) : (
    <div className={`c-dashboard c-dashboard--page-type-${pageTypeClass} ${rootClasses}`}>
      {children}
    </div>
  )
}

const App = ({
  isFullHeight,
  visibilityError,
  homePage,
  currentPage,
  embedMode,
  printMode,
  embedPreviewMode,
  overflowScroll,
  printModeLandscape,
  printOrEmbedMode,
}) => {
  const hasMaxWidth =
    homePage ||
    isEditorialDetailPage(currentPage) ||
    isContentPage(currentPage) ||
    isSearchPage(currentPage)

  // Redirect to the 404 page if currentPage isn't set
  if (currentPage === '' && typeof window !== 'undefined') {
    window.location.replace(routing.niet_gevonden.path)
  }

  const bodyClasses = classNames({
    'c-dashboard__body--error': visibilityError,
    'c-dashboard__body--overflow': overflowScroll,
  })

  if (typeof window !== 'undefined') {
    // Todo: preferably don't modify html class, now needed since these classes add height: auto to
    // html and body
    const printAndEmbedClasses = [
      'is-print-mode',
      'is-print-mode--landscape',
      'is-embed',
      'is-embed-preview',
    ]
    const printEmbedModeClasses = classNames({
      [printAndEmbedClasses[0]]: printMode,
      [printAndEmbedClasses[1]]: printModeLandscape,
      [printAndEmbedClasses[2]]: embedMode,
      [printAndEmbedClasses[3]]: embedPreviewMode,
    })

    // Adding/removing multiple classes as string doesn't seem to work in IE11.
    // Add/remove them one by one.
    printAndEmbedClasses.forEach((element) => {
      document.documentElement.classList.remove(element)
    })

    if (printEmbedModeClasses) {
      printEmbedModeClasses.split(' ').forEach((element) => {
        document.documentElement.classList.add(element)
      })
    }
  }

  return (
    <ThemeProvider>
      <GlobalStyle />
      <MatomoProvider value={matomoInstance}>
        <GraphQLProvider value={graphQLClient}>
          <AppWrapper {...{ currentPage, isFullHeight, hasMaxWidth }}>
            {!embedMode && (
              <Header
                {...{ homePage, hasMaxWidth, printMode, embedPreviewMode, printOrEmbedMode }}
              />
            )}
            <AppBody
              {...{
                hasGrid: hasMaxWidth,
                visibilityError,
                bodyClasses,
                homePage,
                currentPage,
                embedPreviewMode,
              }}
            />
          </AppWrapper>
        </GraphQLProvider>
      </MatomoProvider>
    </ThemeProvider>
  )
}

App.defaultProps = {
  isFullHeight: false,
  visibilityError: false,
}

App.propTypes = {
  isFullHeight: PropTypes.bool,
  currentPage: PropTypes.string.isRequired,
  visibilityError: PropTypes.bool, // vm.visibility.error
  embedMode: PropTypes.bool.isRequired,
  homePage: PropTypes.bool.isRequired,
  printMode: PropTypes.bool.isRequired,
  printOrEmbedMode: PropTypes.bool.isRequired,
  printModeLandscape: PropTypes.bool.isRequired,
  embedPreviewMode: PropTypes.bool.isRequired,
  overflowScroll: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  currentPage: getPage(state),
  embedMode: isEmbedded(state),
  homePage: isHomepage(state),
  printMode: isPrintMode(state),
  printModeLandscape: isPrintModeLandscape(state),
  embedPreviewMode: isEmbedPreview(state),
  overflowScroll: hasOverflowScroll(state),
  printOrEmbedMode: isPrintOrEmbedMode(state),
  visibilityError: hasGlobalError(state),
})

const AppContainer = connect(mapStateToProps, null)(App)

export default AppContainer
