import {
  breakpoint,
  Button,
  Container,
  GlobalStyle,
  themeColor,
  ThemeProvider,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { MatomoProvider } from '@datapunt/matomo-tracker-react'
import classNames from 'classnames'
import { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  Provider as GraphQLProvider,
} from 'urql'
import environment from '../environment'
import { RootState } from '../reducers/root'
import { IDS } from '../shared/config/config'
import { hasGlobalError } from '../shared/ducks/error/error-message'
import {
  hasOverflowScroll,
  isEmbedded,
  isEmbedPreview,
  isPrintMode,
  isPrintModeLandscape,
  isPrintOrEmbedMode,
} from '../shared/ducks/ui/ui'
import getState from '../shared/services/redux/get-state'
import { getPage, isHomepage } from '../store/redux-first-router/selectors'
import AppBody from './AppBody'
import Footer from './components/Footer/Footer'
import Header from './components/Header'
import matomoInstance from './matomo'
import { isContentPage, isEditorialDetailPage, isSearchPage } from './pages'
import { routing } from './routes'

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

const SkipNavigationLink = styled(Button)`
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 30; // on top of header
  transform: translateY(-100%) translateX(-50%);
  transition: transform 0.3s;
  &:focus {
    transform: translateY(0%) translateX(-50%);
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

interface AppWrapperProps {
  hasMaxWidth: boolean
  isFullHeight: boolean
  currentPage: string
}

const AppWrapper: FunctionComponent<AppWrapperProps> = ({
  children,
  hasMaxWidth,
  isFullHeight,
  currentPage,
}) => {
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

interface AppProps {
  isFullHeight: boolean
  currentPage: string
  visibilityError: boolean
  embedMode: boolean
  homePage: boolean
  printMode: boolean
  printOrEmbedMode: boolean
  printModeLandscape: boolean
  embedPreviewMode: boolean
  overflowScroll: boolean
}

const App: FunctionComponent<AppProps> = ({
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
  // Todo: match with react-router paths
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
          <AppWrapper
            currentPage={currentPage}
            isFullHeight={isFullHeight}
            hasMaxWidth={hasMaxWidth}
          >
            {/* @ts-ignore */}
            <SkipNavigationLink
              variant="primary"
              title="Direct naar: inhoud"
              forwardedAs="a"
              href={`#${IDS.main}`}
            >
              Direct naar: inhoud
            </SkipNavigationLink>
            <SkipNavigationLink
              variant="primary"
              title="Direct naar: zoeken"
              onClick={() => {
                document.getElementById(IDS.searchbar)?.focus()
              }}
            >
              Direct naar: zoeken
            </SkipNavigationLink>
            {/* @ts-ignore */}
            <SkipNavigationLink
              variant="primary"
              title="Direct naar: footer"
              forwardedAs="a"
              href={`#${IDS.footer}`}
            >
              Direct naar: footer
            </SkipNavigationLink>
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

const mapStateToProps = (state: RootState) => ({
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
