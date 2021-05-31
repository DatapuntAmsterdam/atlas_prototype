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
import { matchPath, useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  Provider as GraphQLProvider,
} from 'urql'
import type { FunctionComponent } from 'react'
import { useMemo } from 'react'
import environment from '../environment'
import getState from '../shared/services/redux/get-state'
import AppBody, { APP_CONTAINER_ID } from './AppBody'
import Footer, { FOOTER_ID } from './components/Footer/Footer'
import Header from './components/Header'
import { SEARCH_BAR_INPUT_ID } from './components/SearchBar/SearchBar'
import { useIsEmbedded } from './contexts/ui'
import { toNotFound } from './links'
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
  currentPage?: string
}

const AppWrapper: FunctionComponent<AppWrapperProps> = ({ children, hasMaxWidth, currentPage }) => {
  const rootClasses = classNames({
    'c-dashboard--max-width': hasMaxWidth,
  })

  // Todo: don't use page types, this will be used
  const pageTypeClass = currentPage?.toLowerCase()?.replace('_', '-')

  return hasMaxWidth ? (
    <StyledContainer beamColor="valid">
      {children}
      <Footer />
    </StyledContainer>
  ) : (
    <div className={`c-dashboard c-dashboard--page-type-${pageTypeClass ?? ''} ${rootClasses}`}>
      {children}
    </div>
  )
}

const App: FunctionComponent = () => {
  const history = useHistory()
  const location = useLocation()
  const currentPage = useMemo(
    () =>
      Object.values(routing).find((value) =>
        matchPath(location.pathname, { path: value.path, exact: true }),
      )?.page,
    [location, routing],
  )
  const isEmbedded = useIsEmbedded()
  const homePage = currentPage === routing.home.page

  // Todo: match with react-router paths
  const hasMaxWidth = currentPage
    ? homePage ||
      isEditorialDetailPage(currentPage) ||
      isContentPage(currentPage) ||
      isSearchPage(currentPage)
    : false

  // Redirect to the 404 page if currentPage isn't set
  if (!currentPage) {
    history.replace(toNotFound())
  }

  return (
    <ThemeProvider>
      <GlobalStyle />
      <MatomoProvider value={matomoInstance}>
        <GraphQLProvider value={graphQLClient}>
          <AppWrapper currentPage={currentPage} hasMaxWidth={hasMaxWidth}>
            {/* @ts-ignore */}
            <SkipNavigationLink
              variant="primary"
              title="Direct naar: inhoud"
              forwardedAs="a"
              href={`#${APP_CONTAINER_ID}`}
            >
              Direct naar: inhoud
            </SkipNavigationLink>
            <SkipNavigationLink
              variant="primary"
              title="Direct naar: zoeken"
              onClick={() => {
                document.getElementById(SEARCH_BAR_INPUT_ID)?.focus()
              }}
            >
              Direct naar: zoeken
            </SkipNavigationLink>
            {/* @ts-ignore */}
            <SkipNavigationLink
              variant="primary"
              title="Direct naar: footer"
              forwardedAs="a"
              href={`#${FOOTER_ID}`}
            >
              Direct naar: footer
            </SkipNavigationLink>
            {!isEmbedded && <Header homePage={homePage} hasMaxWidth={hasMaxWidth} />}
            <AppBody hasGrid={hasMaxWidth} />
          </AppWrapper>
        </GraphQLProvider>
      </MatomoProvider>
    </ThemeProvider>
  )
}

export default App
