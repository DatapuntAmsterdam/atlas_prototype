import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GlobalStyle, ThemeProvider } from '@datapunt/asc-ui'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'
import { isOldCmsPage, isEditorialPage } from './pages'
import './_app.scss'
import {
  hasOverflowScroll,
  hasPrintMode,
  isEmbedded,
  isEmbedPreview,
  isMapActive,
  isPrintMode,
  isPrintModeLandscape,
  isPrintOrEmbedMode,
} from '../shared/ducks/ui/ui'
import { hasGlobalError } from '../shared/ducks/error/error-message'
import { getUser } from '../shared/ducks/user/user'
import { getPage, isHomepage } from '../store/redux-first-router/selectors'
import Header from './components/Header'
import { AppStateProvider } from './utils/useAppReducer'
import AppBody from './AppBody'
import main, { initialState } from './react-reducers'
import { getEnvironment } from '../shared/environment'
import { MATOMO_CONFIG } from '../store/middleware/matomo/constants'
import { routing } from './routes'

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
  user,
  hasPrintButton,
  hasEmbedButton,
}) => {
  const editorialPage = isEditorialPage(currentPage)
  const hasMaxWidth = homePage || editorialPage || isOldCmsPage(currentPage)

  // Redirect to the 404 page if currentPage isn't set
  if (currentPage === '' && window) {
    window.location.replace(routing.niet_gevonden.path)
  }

  const rootClasses = classNames({
    'c-dashboard--max-width': hasMaxWidth,
    'c-dashboard--full-height': isFullHeight,
    'c-dashboard--homepage': homePage,
    'c-dashboard--editorial': editorialPage,
  })
  const bodyClasses = classNames({
    'c-dashboard__body--error': visibilityError,
    'c-dashboard__body--overflow': overflowScroll,
  })

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
  printAndEmbedClasses.forEach(element => {
    document.documentElement.classList.remove(element)
  })

  if (printEmbedModeClasses) {
    printEmbedModeClasses.split(' ').forEach(element => {
      document.documentElement.classList.add(element)
    })
  }

  // Todo: don't use page types, this will be used
  const pageTypeClass = currentPage.toLowerCase().replace('_', '-')

  const matomoInstance = createInstance({
    urlBase: MATOMO_CONFIG.BASE_URL,
    siteId: MATOMO_CONFIG[getEnvironment(window.location.hostname)].SITE_ID,
  })

  return (
    <ThemeProvider>
      <GlobalStyle />
      <MatomoProvider value={matomoInstance}>
        <AppStateProvider initialState={initialState} reducer={main}>
          <div className={`c-dashboard c-dashboard--page-type-${pageTypeClass} ${rootClasses}`}>
            {!embedMode && (
              <Header
                homePage={homePage}
                hasMaxWidth={hasMaxWidth}
                user={user}
                printMode={printMode}
                embedPreviewMode={embedPreviewMode}
                printOrEmbedMode={printOrEmbedMode}
                hasPrintButton={hasPrintButton}
                hasEmbedButton={hasEmbedButton}
              />
            )}
            <AppBody
              {...{
                visibilityError,
                bodyClasses,
                hasMaxWidth,
                homePage,
                currentPage,
                embedPreviewMode,
              }}
            />
          </div>
        </AppStateProvider>
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
  user: PropTypes.shape({}).isRequired,
  hasPrintButton: PropTypes.bool.isRequired,
  hasEmbedButton: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  currentPage: getPage(state),
  embedMode: isEmbedded(state),
  homePage: isHomepage(state),
  printMode: isPrintMode(state),
  printModeLandscape: isPrintModeLandscape(state),
  embedPreviewMode: isEmbedPreview(state),
  overflowScroll: hasOverflowScroll(state),
  printOrEmbedMode: isPrintOrEmbedMode(state),
  user: getUser(state),
  visibilityError: hasGlobalError(state),
  hasPrintButton: hasPrintMode(state),
  hasEmbedButton: isMapActive(state),
})

const AppContainer = connect(
  mapStateToProps,
  null,
)(App)

export default AppContainer
